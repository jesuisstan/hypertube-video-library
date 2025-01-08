import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };

    // Fetch popular movies from TMDB
    const response = await fetch(`${process.env.TMDB_API_URL}/trending/movie/week?page=1&sort_by=popularity.desc`, options);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('[INFO] Fetched movies data:', data.page, data.results.length);

    // Return the movies data to the client
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Movies fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
