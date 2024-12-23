import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const client = await db.connect();

  if (!code) {
    return NextResponse.json({ error: 'missing-code' }, { status: 400 });
  }

  // Exchange code for access token
  const githubTokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const githubTokenData = await githubTokenResponse.json();
  const githubAccessToken = githubTokenData.access_token;

  const githubUserResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${githubAccessToken}`,
    },
  });

  const githubUserData = await githubUserResponse.json();
  const githubEmail = githubUserData.email;
  console.log('!!!!!!!!!!!!! githubUserData', githubUserData); // debug
  let result = await client.query('SELECT * FROM users WHERE email = $1', [githubEmail]);

  if (!result || !result.rows || result.rows.length === 0) {
    // User does not exist, create a new user
    const insertQuery = `
      INSERT INTO users (email, password, confirmed, firstname, lastname, nickname, biography, tags, complete, latitude, longitude, address, registration_date, last_action, photos, birthdate, sex)
      VALUES ($1, $2, true, $3, $4, $5, '', '{}', false, 0, 0, '', NOW(), NOW(), $6, $7, $8)
      RETURNING id, email, confirmed, firstname, lastname, nickname, biography, tags, complete, latitude, longitude, address, registration_date, last_action, photos;
    `;
    const insertValues = [
      githubEmail,
      'oauth_default_password',
      githubUserData.name.split(' ')[0],
      githubUserData.name.split(' ')[1],
      githubUserData.login,
      [githubUserData.avatar_url],
      '1970-01-01',
      'male',
    ];
    result = await client.query(insertQuery, insertValues);
  }

  const user = result.rows[0];

  // Check if email is confirmed
  if (!user.confirmed) {
    return NextResponse.json({ error: 'please-confirm-email-before-login' }, { status: 401 });
  }

  let token;
  try {
    // Create JWT token
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60; // Token expires in 1 hour
    const secretKey = new TextEncoder().encode(JWT_SECRET);

    token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(secretKey);
  } catch (error) {
    console.error('Error creating JWT:', error);
    return NextResponse.json({ error: 'login-failed' }, { status: 500 });
  }

  // Update the last_action, online status and rating of the user
  try {
    const currentDate = new Date();
    const updateQuery = `
        UPDATE users 
        SET last_action = $2, online = true
        WHERE id = $1
        RETURNING id, email, confirmed, firstname, lastname, nickname, biography, tags, complete, latitude, longitude, address, registration_date, last_action, photos, birthdate;
      `;
    const updateValues = [user.id, currentDate.toISOString()];
    const updatedUserResult = await client.query(updateQuery, updateValues);
    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json({ token, user: updatedUser });
  } catch (error) {
    console.error('Error updating last_action:', error);
    return NextResponse.json({ error: 'login-failed' }, { status: 500 });
  } finally {
    client.release();
  }
}
