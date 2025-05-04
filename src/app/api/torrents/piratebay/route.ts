import { NextResponse } from 'next/server';

import { piratebay } from 'piratebay-scraper';

export async function GET(request: Request) {
  try {
    const movieTitle = new URL(request.url).searchParams.get('title') || '';
    const releaseYear = new URL(request.url).searchParams.get('year') || '';

    // List of formats to filter by
    const formats = [
      '2160',
      '4k',
      '1440',
      '2k',
      '1080p',
      '1080i',
      '1080',
      '720',
      'web-dl',
      'webrip',
      'bluray',
      'brrip',
      'dvdrip',
      'hdtv',
      'x264',
      'x265',
      'hevc',
      'aac',
      'dts',
      'ac3',
      '5.1',
      '7.1',
      'dts-hd',
      'dolby',
      'atmos',
    ];

    // Fetch results from PirateBay using the search term
    const searchQuery = `${movieTitle} ${releaseYear}`;
    const results = await piratebay.search(searchQuery);

    // Filter results to match the movie title and formats
    const filteredResults = results
      .filter((item) => {
        const title = item.title.toLowerCase();
        const cleanedMovieTitle = movieTitle.toLowerCase().replace(/[^\w\s]/g, ''); // Remove punctuation from movieTitle

        // Extract the part of the title before the releaseYear
        const [titleBeforeYear] = title.split(releaseYear.toLowerCase());
        const cleanedTitleBeforeYear = titleBeforeYear?.trim().replace(/[^\w\s]/g, ''); // Remove punctuation

        // Check if the cleaned title before the year matches the cleaned movie title
        const matchesTitle = cleanedTitleBeforeYear === cleanedMovieTitle;

        // Check if the title contains the release year
        const matchesYear = title.includes(releaseYear.toLowerCase());

        // Check if the title contains a valid format
        const matchesFormat = formats.some((format) => title.includes(format));

        return matchesTitle && matchesYear && matchesFormat;
      })
      .slice(0, 10); // Limit the results to 10 items

    // Return filtered results as JSON
    return NextResponse.json(filteredResults);
  } catch (error) {
    console.error('Error fetching PirateBay data:', error);
    return NextResponse.json({ error: 'Failed to fetch data from PirateBay' }, { status: 500 });
  }
}
