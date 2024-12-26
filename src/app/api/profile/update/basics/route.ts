import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { checkIfUserDataIsFilled } from '@/lib/check-user-details-filled';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { id, firstname, lastname, nickname } = body;

    // Step 1: Check if the user exists
    const selectQuery = `
        SELECT firstname, lastname, nickname, birthdate, sex
        FROM users 
        WHERE id = $1
      `;
    const currentDataResult = await client.query(selectQuery, [id]);

    if (currentDataResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const currentData = currentDataResult.rows[0];

    // Step 2: Check if the data is up-to-date
    if (
      currentData.firstname === firstname &&
      currentData.lastname === lastname &&
      currentData.nickname === nickname
    ) {
      return NextResponse.json({ message: 'data-is-up-to-date' });
    }

    // Step 4: Update the user data if needed
    const currentDate = new Date().toISOString();
    const updateQuery = `
        UPDATE users 
        SET firstname = $2, lastname = $3, nickname = $4, last_action = $5
        WHERE id = $1
        RETURNING id, firstname, lastname, nickname, last_action;
      `;
    const updateValues = [id, firstname, lastname, nickname, currentDate];
    const updatedUserResult = await client.query(updateQuery, updateValues);
    const updatedUser = updatedUserResult.rows[0];

    // Check if all required fields are filled to determine `complete` status & Update the `complete` status if necessary
    const { complete, changedToCompleteFlag } = await checkIfUserDataIsFilled(client, id);
    if (changedToCompleteFlag) {
      await client.query('UPDATE users SET complete = $2 WHERE id = $1', [id, complete]);
    }

    return NextResponse.json({
      message: 'user-updated-successfully',
      user: { ...updatedUser, complete },
      changedToCompleteFlag,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-to-update-user' }, { status: 500 });
  } finally {
    client.release();
  }
}
