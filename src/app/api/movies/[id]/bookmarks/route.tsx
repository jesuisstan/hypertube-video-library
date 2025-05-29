import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const client = await db.connect();
  try {
    const { id: movieId } = await context.params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const posterPath = searchParams.get('poster_path');
    const releaseDate = searchParams.get('release_date');
    const title = searchParams.get('title');
    const vote_average = Number(searchParams.get('vote_average'));

    if (!movieId) {
      return NextResponse.json({ error: 'error-movie-id-is-required' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'error-user-id-is-required' }, { status: 400 });
    }

    // Check if the record already exists
    const checkQuery = `
      SELECT id FROM movies_bookmarks WHERE user_id = $1 AND movie_id = $2
    `;
    const checkResult = await client.query(checkQuery, [userId, movieId]);
    if ((checkResult.rowCount ?? 0) > 0) {
      return NextResponse.json({ message: 'record-already-exists' }, { status: 200 });
    }

    // Add the new record
    const insertQuery = `
      INSERT INTO movies_bookmarks (user_id, movie_id, poster_path, release_date, title, vote_average)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const insertResult = await client.query(insertQuery, [
      userId,
      movieId,
      posterPath,
      releaseDate,
      title,
      vote_average,
    ]);

    return NextResponse.json({
      message: 'record-is-done',
      bookmarkId: insertResult.rows[0].id,
    });
  } catch (error) {
    console.error('Bookmarks PUT error:', error);
    return NextResponse.json({ error: 'error-updating-database' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const client = await db.connect();
  try {
    const { id: movieId } = await context.params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    if (!movieId) {
      return NextResponse.json({ error: 'error-movie-id-is-required' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'error-user-id-is-required' }, { status: 400 });
    }

    const deleteQuery = `
      DELETE FROM movies_bookmarks WHERE user_id = $1 AND movie_id = $2 RETURNING id
    `;
    const result = await client.query(deleteQuery, [userId, movieId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'record-not-found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'record-is-done',
      deletedBookmarkId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Bookmarks DELETE error:', error);
    return NextResponse.json({ error: 'error-updating-database' }, { status: 500 });
  } finally {
    client.release();
  }
}

// Check if a movie is bookmarked
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const client = await db.connect();
  try {
    const { id: movieId } = await context.params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    if (!movieId) {
      return NextResponse.json({ error: 'error-movie-id-is-required' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'error-user-id-is-required' }, { status: 400 });
    }

    const checkQuery = `
      SELECT id FROM movies_bookmarks WHERE user_id = $1 AND movie_id = $2
    `;
    const checkResult = await client.query(checkQuery, [userId, movieId]);
    const isBookmarked = (checkResult.rowCount ?? 0) > 0;

    return NextResponse.json({ isBookmarked });
  } catch (error) {
    console.error('Bookmarks GET error:', error);
    return NextResponse.json({ error: 'error-checking-database' }, { status: 500 });
  } finally {
    client.release();
  }
}
