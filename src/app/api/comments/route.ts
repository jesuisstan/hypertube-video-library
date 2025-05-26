import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function GET(req: Request) {
  const client = await db.connect();
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get('movie_id') || '';
    if (!movieId) {
      return NextResponse.json({ error: 'error-movie-id-is-required' }, { status: 400 });
    }

    // Получаем nickname и photos пользователя через JOIN с таблицей users
    const query = `
      SELECT mc.id, mc.user_id, u.nickname, u.photos, mc.content, mc.created_at
      FROM movies_comments mc
      JOIN users u ON mc.user_id = u.id
      WHERE mc.movie_id = $1
      ORDER BY mc.created_at DESC
    `;
    const result = await client.query(query, [movieId]);

    return NextResponse.json({ comments: result.rows });
  } catch (error) {
    console.error('Comments GET error:', error);
    return NextResponse.json({ error: 'error-fetching-comments' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const client = await db.connect();
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get('movie_id') || '';
    const userId = searchParams.get('user_id');
    const commentContent = searchParams.get('comment_content');
    console.log('POST /api/comments', { movieId, userId, commentContent });
    if (!movieId) {
      return NextResponse.json({ error: 'error-movie-id-is-required' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'error-user-id-is-required' }, { status: 400 });
    }
    if (!commentContent) {
      return NextResponse.json({ error: 'error-comment-content-is-required' }, { status: 400 });
    }

    // Check if the record already exists
    const checkQuery = `
      SELECT id FROM movies_comments WHERE user_id = $1 AND movie_id = $2 AND content = $3
    `;
    const checkResult = await client.query(checkQuery, [userId, movieId, commentContent]);
    if ((checkResult.rowCount ?? 0) > 0) {
      return NextResponse.json({ message: 'record-already-exists' }, { status: 200 });
    }

    // Add the new record
    const insertQuery = `
      INSERT INTO movies_comments (user_id, movie_id, content)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const insertResult = await client.query(insertQuery, [userId, movieId, commentContent]);

    return NextResponse.json({
      message: 'record-is-done',
      bookmarkId: insertResult.rows[0].id,
    });
  } catch (error) {
    console.error('Comment POST error:', error);
    return NextResponse.json({ error: 'error-updating-database' }, { status: 500 });
  } finally {
    client.release();
  }
}
