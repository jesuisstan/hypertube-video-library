import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const client = await db.connect();
  try {
    const { id: commentId } = await context.params;
    if (!commentId) {
      return NextResponse.json({ error: 'error-comment-id-is-required' }, { status: 400 });
    }

    // Получаем nickname и photos пользователя через JOIN с таблицей users
    const query = `
      SELECT mc.id, mc.user_id, mc.movie_id, mc.content, mc.created_at, u.nickname, u.photos
      FROM movies_comments mc
      JOIN users u ON mc.user_id = u.id
      WHERE mc.id = $1
      LIMIT 1
    `;
    const result = await client.query(query, [commentId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'comment-not-found' }, { status: 404 });
    }

    return NextResponse.json({ comment: result.rows[0] });
  } catch (error) {
    console.error('Comments GET error:', error);
    return NextResponse.json({ error: 'error-fetching-comment' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const client = await db.connect();
  try {
    const { id: commentId } = await context.params;
    if (!commentId) {
      return NextResponse.json({ error: 'error-comment-content-is-required' }, { status: 400 });
    }
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get('movie_id');
    const userId = searchParams.get('user_id');

    const deleteQuery = `
      DELETE FROM movies_comments WHERE id = $1 AND movie_id = $2 AND user_id = $3
    `;
    await client.query(deleteQuery, [commentId, movieId, userId]);

    return NextResponse.json({ message: 'comment-deleted' });
  } catch (error) {
    console.error('Comment DELETE error:', error);
    return NextResponse.json({ error: 'error-deleting-comment' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const client = await db.connect();
  try {
    const { id: commentId } = await context.params;
    if (!commentId) {
      return NextResponse.json({ error: 'error-comment-content-is-required' }, { status: 400 });
    }
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get('movie_id');
    const userId = searchParams.get('user_id');
    const commentContent = searchParams.get('comment_content');

    if (!movieId) {
      return NextResponse.json({ error: 'error-movie-id-is-required' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'error-user-id-is-required' }, { status: 400 });
    }
    if (!commentContent) {
      return NextResponse.json({ error: 'error-comment-content-is-required' }, { status: 400 });
    }

    // Update the comment
    const updateQuery = `
      UPDATE movies_comments
      SET content = $1
      WHERE id = $2 AND movie_id = $3 AND user_id = $4
      RETURNING id
    `;
    const updateResult = await client.query(updateQuery, [
      commentContent,
      commentId,
      movieId,
      userId,
    ]);

    if (updateResult.rowCount === 0) {
      return NextResponse.json({ error: 'comment-not-found' }, { status: 404 });
    }

    // Получить все данные о комментарии и пользователе
    const selectQuery = `
      SELECT mc.id, mc.user_id, mc.movie_id, mc.content, mc.created_at, u.nickname, u.photos
      FROM movies_comments mc
      JOIN users u ON mc.user_id = u.id
      WHERE mc.id = $1
      LIMIT 1
    `;
    const selectResult = await client.query(selectQuery, [commentId]);

    return NextResponse.json({
      message: 'comment-updated',
      comment: selectResult.rows[0],
    });
  } catch (error) {
    console.error('Comment PATCH error:', error);
    return NextResponse.json({ error: 'error-updating-comment' }, { status: 500 });
  } finally {
    client.release();
  }
}
