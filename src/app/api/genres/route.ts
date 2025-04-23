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

    const languages = ['en-US', 'ru-RU', 'fr-FR'];
    const fetchPromises = languages.map((lang) =>
      fetch(`${process.env.TMDB_API_URL}/genre/movie/list?language=${lang}`, options)
    );

    const responses = await Promise.all(fetchPromises);

    const data = await Promise.all(
      responses.map(async (response, index) => {
        if (!response.ok) {
          throw new Error(
            `Request Genres ${languages[index]} failed with status ${response.status}`
          );
        }
        return response.json();
      })
    );

    const result = {
      en: data[0].genres,
      ru: data[1].genres,
      fr: data[2].genres,
    };

    // Return the genres data to the client
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Genres fetch error:', error);
    return NextResponse.json({ error: 'error-fetching-genres' }, { status: 500 });
  }
}
