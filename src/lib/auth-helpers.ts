import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { db } from '@vercel/postgres';

import { authOptions } from '@/lib/auth-options';

/**
 * Finds an existing user by email or creates a new user with the provided profile data
 * @param profileData - Object containing user profile information
 * @returns Promise resolving to the user object
 */
export async function findOrCreateUser(profileData: any) {
  const client = await db.connect();
  try {
    const {
      email,
      nickname,
      firstname,
      lastname,
      bio,
      location,
      avatarUrl,
      sex = 'male',
    } = profileData;

    // Check if the user exists
    let result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    if (!user) {
      // Insert new user
      const insertQuery = `
        INSERT INTO users (email, confirmed, firstname, lastname, nickname, biography, tags, complete, latitude, longitude, address, registration_date, last_action, photos, birthdate, sex)
        VALUES ($1, true, $2, $3, $4, $5, '{}', false, 0, 0, $6, NOW(), NOW(), $7, '1970-01-01', $8)
        RETURNING *;
      `;
      const insertValues = [email, firstname, lastname, nickname, bio, location, [avatarUrl], sex];
      const insertResult = await client.query(insertQuery, insertValues);
      user = insertResult.rows[0];
    }

    return user;
  } finally {
    client.release();
  }
}

/**
 * Updates the last action timestamp for a user and sets them as online
 * @param userId - The ID of the user to update
 * @returns Promise that resolves when the update is complete
 */
export async function updateLastAction(userId: string) {
  const client = await db.connect();
  try {
    const currentDate = new Date();
    await client.query('UPDATE users SET last_action = $2, online = true WHERE id = $1', [
      userId,
      currentDate.toISOString(),
    ]);
  } finally {
    client.release();
  }
}

/**
 * Determines the appropriate campus for a user based on their email domain
 * @param peer - User object containing email and campus information
 * @returns The matching campus object or the last campus if no match is found
 */
export const defineCampus = (peer: any) => {
  // Extract the domain from the user's email
  const emailDomain = peer.email.split('@')[1];

  // Filter the campuses where email_extension is contained within the email domain
  const matchingCampuses = peer.campus.filter((campus: any) =>
    emailDomain.includes(campus.email_extension)
  );

  // If there are matching campuses, return the last one
  if (matchingCampuses.length > 0) {
    return matchingCampuses[matchingCampuses.length - 1];
  }

  // If no matches, return the last campus from the array
  return peer.campus[peer.campus.length - 1];
};

export interface AuthSession {
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    nickname: string;
    // Additional user fields as needed
  };
}

/**
 * Retrieves the current authenticated user session
 * @param request - NextRequest object (optional)
 * @returns Promise resolving to AuthSession or null if not authenticated
 */
export async function getAuthSession(request?: NextRequest): Promise<AuthSession | null> {
  try {
    const session = await getServerSession(authOptions);
    return session as AuthSession | null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Checks if the current user can modify data for the specified user
 * @param session - Current user session
 * @param targetUserId - ID of the user to be modified
 * @returns true if modification is allowed, false otherwise
 */
export function canModifyUser(session: AuthSession | null, targetUserId: string): boolean {
  if (!session || !session.user) {
    return false; // Not authenticated
  }

  // Users can only modify their own data
  return session.user.id === targetUserId;
}

/**
 * Checks if the current user can view data for the specified user
 * @param session - Current user session
 * @param targetUserId - ID of the user to be viewed
 * @returns true if viewing is allowed, false otherwise
 */
export function canViewUser(session: AuthSession | null, targetUserId: string): boolean {
  if (!session || !session.user) {
    return false; // Not authenticated
  }

  // Users can view their own data
  // Future: Add logic for viewing other users if needed
  return session.user.id === targetUserId;
}

/**
 * Creates a standardized authentication error response
 * @param type - Type of authentication error ('unauthorized' or 'forbidden')
 * @returns Object containing error details with message and status code
 */
export function createAuthErrorResponse(type: 'unauthorized' | 'forbidden' = 'unauthorized') {
  if (type === 'forbidden') {
    return {
      error: 'forbidden',
      message: 'You do not have permission to perform this action',
      status: 403,
    };
  }

  return {
    error: 'unauthorized',
    message: 'Authentication required',
    status: 401,
  };
}
