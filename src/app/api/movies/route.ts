import { NextResponse } from 'next/server';

import { TMovieBasics } from '@/types/movies';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'discover';
    const search = searchParams.get('search') || '';
    const total_pages_available = searchParams.get('total_pages_available') || '42'; // default to 42 pages
    const lang = searchParams.get('lang') || 'en-US';
    const page = searchParams.get('page') || '1';
    const include_adult = searchParams.get('include_adult') || 'false';
    const sort_by = searchParams.get('sort_by') || 'popularity.desc';
    const rating_min = searchParams.get('rating_min') || '6';
    const rating_max = searchParams.get('rating_max') || '10';
    const min_votes = searchParams.get('min_votes') || '142';
    const release_date_min = searchParams.get('release_date_min') || '1895-11-28'; // Date of the first movie release ever in UTC
    const release_date_max =
      searchParams.get('release_date_max') || new Date().toISOString().split('T')[0]; // Date without timezone shift
    const with_genres = searchParams.get('with_genres') || '';
    const with_keywords = searchParams.get('with_keywords') || '';

    if (
      Number(page) > Number(total_pages_available) &&
      Number(page) !== 1 &&
      Number(total_pages_available) > 5
    ) {
      return NextResponse.json({ error: 'error-page-limit-reached' }, { status: 400 });
    }

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };

    let response: Response | undefined; // Initialize as undefined to avoid TypeScript warning

    if (category === 'discover') {
      const queryParams = new URLSearchParams({
        include_adult,
        sort_by,
        'vote_average.gte': rating_min,
        'vote_average.lte': rating_max,
        'vote_count.gte': min_votes,
        'release_date.gte': release_date_min,
        'release_date.lte': release_date_max,
        with_genres,
        with_keywords,
        language: lang,
        page,
      });

      response = await fetch(
        `${process.env.TMDB_API_URL}/discover/movie?${queryParams.toString()}`,
        options
      );
    } else if (category === 'search') {
      const queryParams = new URLSearchParams({
        query: search,
        include_adult,
        language: lang,
        page,
      });

      response = await fetch(
        `${process.env.TMDB_API_URL}/search/movie?${queryParams.toString()}`,
        options
      );
    } else {
      throw new Error(`Invalid category: ${category}`); // Handle invalid category
    }

    if (!response || !response.ok) {
      throw new Error(`Request failed with status ${response?.status}`);
    }

    const data: TMovieBasics[] = await response.json();

    // Return the movies data to the client
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Movies fetch error:', error);
    return NextResponse.json({ error: 'error-fetching-movies' }, { status: 500 });
  }
}
