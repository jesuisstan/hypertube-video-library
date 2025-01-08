// src/app/api/movies/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };

    // Fetch popular movies for the last week from TMDB
    const response = await fetch('https://api.themoviedb.org/3/trending/movie/week', options);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[ERROR] TMDB API response:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch popular movies' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[INFO] Fetched movies data:', data);

    // Return the movies data as JSON
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[ERROR] An error occurred:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
