import { NextResponse } from 'next/server';

import { fetchPopcornApi } from '@/lib/popcorn-api';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const { endpoint, ...queryParams } = params;

  try {
    if (!endpoint) {
      throw new Error('Missing endpoint parameter');
    }

    const data = await fetchPopcornApi(endpoint, queryParams);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
