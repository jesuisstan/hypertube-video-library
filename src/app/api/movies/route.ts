import { NextResponse } from 'next/server';

import { TMovieBasics } from '@/types/movies';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const list = searchParams.get('list') || 'popular';
    const lang = searchParams.get('lang') || 'en-US';
    const page = searchParams.get('page') || '1';

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };

    // Fetch popular movies from TMDB
    const response = await fetch(
      `${process.env.TMDB_API_URL}/movie/${list}?language=${lang}&page=${page}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data: TMovieBasics[] = await response.json();

    // Return the movies data to the client
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Movies fetch error:', error);
    return NextResponse.json({ error: 'error-fetching-movies' }, { status: 500 });
  }
}
