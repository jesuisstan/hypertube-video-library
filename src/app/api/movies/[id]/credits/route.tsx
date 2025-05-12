import { NextResponse } from 'next/server';

import { TMovieCredits } from '@/types/movies';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: movieId } = await context.params; // Get the movie ID from the request params
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'en-US';

    if (!movieId) {
      return NextResponse.json({ error: 'error-movie-id-is-required' }, { status: 400 });
    }

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };

    const response = await fetch(
      `${process.env.TMDB_API_URL}/movie/${movieId}/credits?language=${lang}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data: TMovieCredits = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Credits fetch error:', error);
    return NextResponse.json({ error: 'error-fetching-credits' }, { status: 500 });
  }
}
