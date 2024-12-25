import { db } from '@vercel/postgres';

export async function findOrCreateUser(profileData: any, hashedPassword: string) {
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
        INSERT INTO users (email, password, confirmed, firstname, lastname, nickname, biography, tags, complete, latitude, longitude, address, registration_date, last_action, photos, birthdate, sex)
        VALUES ($1, $2, true, $3, $4, $5, $6, '{}', false, 0, 0, $7, NOW(), NOW(), $8, '1970-01-01', $9)
        RETURNING *;
      `;
      const insertValues = [
        email,
        hashedPassword,
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
