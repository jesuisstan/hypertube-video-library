import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export async function DELETE(req: Request, context: { params: Promise<{ id: any }> }) {
  const client = await db.connect();

  try {
    const params = await context.params;
    const id = params.id;
    const { password } = await req.json(); // Get the password from the request body

    // Step 1: Validate input
    if (!id || !password) {
      return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
    }

    // Step 2: Check if the user exists and get the hashed password
    const selectQuery = `
      SELECT password
      FROM users
      WHERE id = $1
    `;
    const currentDataResult = await client.query(selectQuery, [id]);

    if (currentDataResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const { password: hashedPassword } = currentDataResult.rows[0];

    // Ensure hashedPassword is defined
    if (!hashedPassword) {
      return NextResponse.json({ error: 'password-not-found' }, { status: 500 });
    }

    // Step 3: Verify the password
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'password-invalid' }, { status: 401 });
    }

    // Step 4: Execute the delete query
    const deleteQuery = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id;
    `;
    const result = await client.query(deleteQuery, [id]);

    // Step 5: Check if a user was deleted
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'user-deleted-successfully',
      deletedUserId: result.rows[0].id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-to-delete-user' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: any }> }) {
  const client = await db.connect();
  const params = await context.params;
  const id = params.id;
  const body = await req.json();
  const { category } = body;

  try {
    const { firstname, lastname, nickname, description, latitude, longitude, address } = body;
    const currentDate = new Date().toISOString();
    let updateQuery = '';
    let updateValues: (string | number)[] = [];

    if (category === 'basics') {
      // Step 1: Check if the user exists
      const selectQuery = `
        SELECT firstname, lastname, nickname
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
      updateQuery = `
        UPDATE users 
        SET firstname = $2, lastname = $3, nickname = $4, last_action = $5
        WHERE id = $1
        RETURNING id, firstname, lastname, nickname, last_action;
      `;
      updateValues = [id, firstname, lastname, nickname, currentDate];
    } else if (category === 'description') {
      // Step 0: Validate the description length received from the frontend
      if (description.trim().length < 42) {
        return NextResponse.json({ error: 'error-min-biography-length' }, { status: 400 });
      }
      if (description.trim().length > 442) {
        return NextResponse.json({ error: 'error-max-biography-length' }, { status: 400 });
      }

      // Step 1: Check if the user exists
      const selectQuery = `
        SELECT biography
        FROM users 
        WHERE id = $1
      `;
      const currentDataResult = await client.query(selectQuery, [id]);

      if (currentDataResult.rowCount === 0) {
        return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
      }

      const currentData = currentDataResult.rows[0];

      // Step 2: Check if the data is up-to-date
      if (currentData.biography === description) {
        return NextResponse.json({ message: 'data-is-up-to-date' });
      }

      // Step 3: Conditionally update the biography/description, last action in one query
      updateQuery = `
        UPDATE users
        SET biography = $2, last_action = $3
        WHERE id = $1
        RETURNING id, biography, last_action;
      `;
      updateValues = [id, description, currentDate];
    } else if (category === 'location') {
      // Step 1: Check if the user exists
      const selectQuery = `
        SELECT latitude, longitude, address
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
        currentData.latitude === latitude &&
        currentData.longitude === longitude &&
        currentData.address === address
      ) {
        return NextResponse.json({ message: 'data-is-up-to-date' });
      }

      // Step 3: Update the user data if needed
      const currentDate = new Date().toISOString();
      updateQuery = `
        UPDATE users
        SET latitude = $2, longitude = $3, address = $4, last_action = $5
        WHERE id = $1
        RETURNING id, latitude, longitude, address, last_action;
      `;
      updateValues = [id, latitude, longitude, address, currentDate];
    }

    const updatedUserResult = await client.query(updateQuery, updateValues);
    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json({
      message: 'user-updated-successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-to-update-user' }, { status: 500 });
  } finally {
    client.release();
  }
}
