import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; // Get the movie ID from the request params
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'en-US';

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };

    // Fetch popular movies from TMDB
    const response = await fetch(
      `${process.env.TMDB_API_URL}/movie/${id}?language=${lang}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('[INFO] Fetched movie-data:', data); // debug

    // Return the movies data to the client
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Movie fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
