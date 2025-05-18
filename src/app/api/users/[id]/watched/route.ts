import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const client = await db.connect();
  try {
    const { id: userId } = await context.params;
    if (!userId) {
      return NextResponse.json({ error: 'error-user-id-is-required' }, { status: 400 });
    }

    const query = `
      SELECT movie_id AS id, poster_path, release_date, title, vote_average, created_at
      FROM movies_watched
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await client.query(query, [userId]);
    return NextResponse.json({ watched: result.rows });
  } catch (error) {
    console.error('Watched movies GET error:', error);
    return NextResponse.json({ error: 'error-fetching-watched' }, { status: 500 });
  } finally {
    client.release();
  }
}
