import { db } from '@vercel/postgres';

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
      const insertValues = [
        email,
        firstname,
        lastname,
        nickname,
        bio,
        location,
        [avatarUrl],
        sex,
      ];
      const insertResult = await client.query(insertQuery, insertValues);
      user = insertResult.rows[0];
    }

    return user;
  } finally {
    client.release();
  }
}

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