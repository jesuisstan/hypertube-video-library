import { NextResponse } from 'next/server';

import { del } from '@vercel/blob';
import { db } from '@vercel/postgres';

import { checkIfUserDataIsFilled } from '@/lib/check-user-details-filled';

export async function DELETE(req: Request): Promise<NextResponse> {
  const client = await db.connect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');
    const photoUrl = searchParams.get('url');

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

    // Step 4: Check if all required fields are filled to determine `complete` status
    const { complete, changedToCompleteFlag } = await checkIfUserDataIsFilled(client, userId);
    await client.query('UPDATE users SET complete = $2 WHERE id = $1', [userId, complete]);

    return NextResponse.json({
      message: 'photo-deleted-successfully',
      user: { ...updatedUser, complete },
      changedToCompleteFlag,
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'failed-to-delete-photo' }, { status: 500 });
  } finally {
    client.release();
  }
}
