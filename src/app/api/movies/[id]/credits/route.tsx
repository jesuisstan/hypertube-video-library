import { NextResponse } from 'next/server';

import { TCrewMember, TMovieCredits } from '@/types/movies';

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

    const sortedCrew = data.crew.sort((a: TCrewMember, b: TCrewMember) => {
      const directorKeywords = [
        'Director',
        'director',
        'режиссер',
        'Режиссер',
        'Directeur',
        'directeur',
        'realisateur',
        'Realisateur',
      ];

      const producerKeywords = [
        'Executive Producer',
        'executive producer',
        'исполнительный продюсер',
        'Исполнительный продюсер',
        'Producteur exécutif',
        'producteur exécutif',
      ];

      const isADirector = directorKeywords.includes(a.job);
      const isBDirector = directorKeywords.includes(b.job);
      const isAProducer = producerKeywords.includes(a.job);
      const isBProducer = producerKeywords.includes(b.job);

      // Director always comes first
      if (isADirector && !isBDirector) return -1;
      if (!isADirector && isBDirector) return 1;

      // If both are Directors or Producers, keep the original order
      if (isADirector && isBDirector) return 0;
      if (isAProducer && isBProducer) return 0;

      // If one is a Director and the other is a Producer, the Director comes first
      if (isAProducer && !isBDirector) return -1;
      if (!isAProducer && isBProducer) return 1;

      // If neither is a Director or Producer, sort by name
      return 0;
    });

    return NextResponse.json({ ...data, crew: sortedCrew });
  } catch (error: any) {
    console.error('Credits fetch error:', error);
    return NextResponse.json({ error: 'error-fetching-credits' }, { status: 500 });
  }
}
