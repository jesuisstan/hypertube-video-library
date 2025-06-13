import { NextResponse } from 'next/server';

import { del, put } from '@vercel/blob';
import { db } from '@vercel/postgres';

import { canModifyUser, createAuthErrorResponse, getAuthSession } from '@/lib/auth-helpers';

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');

    // 🔒 CHECK AUTHENTICATION
    const session = await getAuthSession();
    if (!session) {
      const authError = createAuthErrorResponse('unauthorized');
      return NextResponse.json(
        { error: authError.error, message: authError.message },
        { status: authError.status }
      );
    }

    if (filename) {
      // Case 1: Upload the photo to Blob Storage
      const blob = await put(filename!, req?.body!, {
        access: 'public',
      });

      return NextResponse.json(blob);
    } else {
      // Case 2: Update the user's profile with the new photo URL
      const body = await req.json();
      const { id, url } = body;

      // 🔒 CHECK AUTHORIZATION TO UPDATE USER
      if (!canModifyUser(session, id)) {
        const authError = createAuthErrorResponse('forbidden');
        return NextResponse.json(
          { error: authError.error, message: authError.message },
          { status: authError.status }
        );
      }

      // Step 1: Validate the photo received from the frontend
      if (!url || typeof url !== 'string' || url.trim() === '') {
        return NextResponse.json({ error: 'error-photo-type' }, { status: 400 });
      }

      // Step 2: Check if the user exists
      const selectQuery = `
        SELECT photos
        FROM users 
        WHERE id = $1
      `;
      const currentDataResult = await client.query(selectQuery, [id]);

      if (currentDataResult.rowCount === 0) {
        return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
      }

      // Step 3: Update the user's photos array by appending the new URL. Update the last action.
      const currentDate = new Date();
      const updateQuery = `
        UPDATE users 
        SET photos = array_append(photos, $2), last_action = $3
        WHERE id = $1
        RETURNING id, photos, last_action;
      `;
      const updateValues = [id, url, currentDate.toISOString()];
      const updatedUserResult = await client.query(updateQuery, updateValues);
      const updatedUser = updatedUserResult.rows[0];

      return NextResponse.json({
        message: 'user-updated-successfully',
        user: updatedUser,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-to-update-user' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(req: Request): Promise<NextResponse> {
  const client = await db.connect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');
    const photoUrl = searchParams.get('url');

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
    if (!canModifyUser(session, userId!)) {
      const authError = createAuthErrorResponse('forbidden');
      return NextResponse.json(
        { error: authError.error, message: authError.message },
        { status: authError.status }
      );
    }

    // Step 1: Validate inputs
    if (!userId || !photoUrl) {
      return NextResponse.json({ error: 'missing-parameters' }, { status: 400 });
    }

    // Step 2: Check if the photo is stored in Blob
    const isBlobUrl = photoUrl.includes('.vercel-storage.com');
    if (isBlobUrl) {
      try {
        // Delete the photo from Blob Storage
        await del(photoUrl);
      } catch (error) {
        console.error('Error deleting photo from Blob:', error);
        return NextResponse.json({ error: 'failed-to-delete-blob-photo' }, { status: 500 });
      }
    }

    // Step 3: Remove the photo URL from the user's photos[] array in PostgreSQL
    const currentDate = new Date();
    const updateQuery = `
      UPDATE users
      SET photos = array_remove(photos, $2), last_action = $3
      WHERE id = $1
      RETURNING id, photos, last_action;
    `;
    const updateValues = [userId, photoUrl, currentDate.toISOString()];
    const updatedUserResult = await client.query(updateQuery, updateValues);

    if (updatedUserResult.rowCount === 0) {
      return NextResponse.json({ error: 'user-not-found' }, { status: 404 });
    }

    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json({
      message: 'photo-deleted-successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'failed-to-delete-photo' }, { status: 500 });
  } finally {
    client.release();
  }
}
