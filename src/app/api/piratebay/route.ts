// src/app/api/piratebay/route.ts
import { NextResponse } from 'next/server';

import { piratebay } from 'piratebay-scraper';

export async function GET(request: Request) {
  try {
    const searchQuery = new URL(request.url).searchParams.get('query') || 'The Stranger 1946'; // Default to 'The Stranger 1946'
    
    // Fetch results from PirateBay using the search term
    const results = await piratebay.search(searchQuery);

    // Return results as JSON
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching PirateBay data:', error);
    return NextResponse.json({ error: 'Failed to fetch data from PirateBay' }, { status: 500 });
  }
}
