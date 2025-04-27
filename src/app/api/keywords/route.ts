import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const lang = searchParams.get('lang') || 'en-US';
    const page = searchParams.get('page') || '1';

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };

    const response = await fetch(
      `${process.env.TMDB_API_URL}/search/keyword?query=${encodeURIComponent(query)}&language=${lang}&page=${page}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Keywords fetch error:', error);
    return NextResponse.json({ error: 'error-fetching-keywords' }, { status: 500 });
  }
}
