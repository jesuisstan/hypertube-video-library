//import { NextResponse } from 'next/server';

//import { piratebay } from 'piratebay-scraper';

//export async function GET(request: Request) {
//  try {
//    const searchQuery = new URL(request.url).searchParams.get('query') || 'best-of';

//    // Fetch results from PirateBay using the search term
//    const results = await piratebay.search(searchQuery);

//    console.log('[INFO] Fetched PirateBay data:', results); // debug
//    // Return results as JSON
//    return NextResponse.json(results);
//  } catch (error) {
//    console.error('Error fetching PirateBay data:', error);
//    return NextResponse.json({ error: 'Failed to fetch data from PirateBay' }, { status: 500 });
//  }
//}

import { NextResponse } from 'next/server';

import { piratebay } from 'piratebay-scraper';

export async function GET(request: Request) {
  try {
    const searchQuery = new URL(request.url).searchParams.get('query') || 'best-of';

    // Fetch results from PirateBay using the search term
    const results = await piratebay.search(searchQuery);

    // Filter results for exact matches (case-insensitive)
    const filteredResults = results.filter(
      (item) =>
        item.title.toLowerCase().includes('1080') ||
        item.title.toLowerCase().includes('720') ||
        item.title.toLowerCase().includes('web-dl') ||
        item.title.toLowerCase().includes('webrip') ||
        item.title.toLowerCase().includes('bluray') ||
        item.title.toLowerCase().includes('brrip') ||
        item.title.toLowerCase().includes('dvdrip') ||
        item.title.toLowerCase().includes('hdtv') ||
        item.title.toLowerCase().includes('x264') ||
        item.title.toLowerCase().includes('x265') ||
        item.title.toLowerCase().includes('hevc') ||
        item.title.toLowerCase().includes('aac') ||
        item.title.toLowerCase().includes('dts') ||
        item.title.toLowerCase().includes('ac3') ||
        item.title.toLowerCase().includes('5.1') ||
        item.title.toLowerCase().includes('7.1')
    );

    console.log('[INFO] Fetched and filtered PirateBay data:', filteredResults); // debug
    // Return filtered results as JSON
    return NextResponse.json(filteredResults);
  } catch (error) {
    console.error('Error fetching PirateBay data:', error);
    return NextResponse.json({ error: 'Failed to fetch data from PirateBay' }, { status: 500 });
  }
}
