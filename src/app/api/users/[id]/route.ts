import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

import { canModifyUser, createAuthErrorResponse, getAuthSession } from '@/lib/auth-helpers';

export async function DELETE(req: Request, context: { params: Promise<{ id: any }> }) {
  const client = await db.connect();

  try {
    const params = await context.params;
    const id = params.id;

    // 🔒 CHECK AUTHENTICATION
    const session = await getAuthSession();
    if (!session) {
      const authError = createAuthErrorResponse('unauthorized');
      return NextResponse.json(
        { error: authError.error, message: authError.message },
        { status: authError.status }
      );
    }

    // 🔒 CHECK AUTHORIZATION TO DELETE USER
    if (!canModifyUser(session, id)) {
      const authError = createAuthErrorResponse('forbidden');
      return NextResponse.json(
        { error: authError.error, message: authError.message },
        { status: authError.status }
      );
    }

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

  try {
    // 🔒 CHECK AUTHENTICATION
    const session = await getAuthSession();
    if (!session) {
      const authError = createAuthErrorResponse('unauthorized');
      return NextResponse.json(
        { error: authError.error, message: authError.message },
        { status: authError.status }
      );
    }

    // 🔒 CHECK AUTHORIZATION TO UPDATE USER
    if (!canModifyUser(session, id)) {
      const authError = createAuthErrorResponse('forbidden');
      return NextResponse.json(
        { error: authError.error, message: authError.message },
        { status: authError.status }
      );
    }

    const body = await req.json();
    const { category } = body;

    const {
      firstname,
      lastname,
      nickname,
      description,
      latitude,
      longitude,
      address,
      preferred_language,
    } = body;
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
    } else if (category === 'preferred_language') {
      // Step 1: Check if the user exists
      const selectQuery = `
        SELECT preferred_language
        FROM users 
        WHERE id = $1
      `;
      const currentDataResult = await client.query(selectQuery, [id]);

      if (currentDataResult.rowCount === 0) {
        return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
      }

      const currentData = currentDataResult.rows[0];

      // Step 2: Check if the data is up-to-date
      if (currentData.preferred_language === preferred_language) {
        return NextResponse.json({ message: 'data-is-up-to-date' });
      }

      // Step 3: Conditionally update the preferred_language, last action in one query
      updateQuery = `
        UPDATE users
        SET preferred_language = $2, last_action = $3
        WHERE id = $1
        RETURNING id, preferred_language, last_action;
      `;
      updateValues = [id, preferred_language, currentDate];
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

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export async function GET(req: Request, context: { params: Promise<{ id: any }> }) {
  const { id } = await context.params; // Get the movie ID from the request params

  // If no profileToFindId is provided, return an error response
  if (!id) {
    return NextResponse.json({ error: 'error-user-id-is-required' }, { status: 400 });
  }
  if (!isValidUUID(id)) {
    return NextResponse.json({ error: 'invalid-input' }, { status: 400 });
  }

  // 🔒 CHECK AUTHENTICATION
  const session = await getAuthSession();
  if (!session) {
    const authError = createAuthErrorResponse('unauthorized');
    return NextResponse.json(
      { error: authError.error, message: authError.message },
      { status: authError.status }
    );
  }

  //// 🔒 CHECK AUTHORIZATION TO VIEW USER
  //if (!canViewUser(session, id)) {
  //  const authError = createAuthErrorResponse('forbidden');
  //  return NextResponse.json(
  //    { error: authError.error, message: authError.message },
  //    { status: authError.status }
  //  );
  //}

  const client = await db.connect();

  const userResult = await client.query('SELECT * FROM users WHERE id = $1', [id]);
  const user = userResult.rows[0];

  if (!user) {
    return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
  }

  try {
    // Fetch user profile based on the provided id
    const query = `
      SELECT id, firstname, lastname, nickname, biography, last_action, latitude, longitude, 
             address, photos, confirmed, last_action, preferred_language
      FROM users 
      WHERE id = $1
    `;
    const values = [id];
    const result = await client.query(query, values);

    // If no user is found, return an error response
    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    // Return the profile data as a response
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'error-fetching-profile' }, { status: 500 });
  } finally {
    // Release the database client
    client.release();
  }
}
