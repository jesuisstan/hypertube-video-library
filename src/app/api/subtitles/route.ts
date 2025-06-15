import { NextResponse } from 'next/server';

import fs from 'fs/promises';
import path from 'path';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subtitlePath = searchParams.get('path');

    if (!subtitlePath) {
      return NextResponse.json({ error: 'Missing subtitle path' }, { status: 400 });
    }

    const downloadsDir = path.resolve(process.cwd(), 'tmp/downloads');

    const resolvedPath = path.resolve(downloadsDir, subtitlePath);

    if (!resolvedPath.startsWith(downloadsDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const vttText = await fs.readFile(resolvedPath, 'utf-8');

    return new Response(vttText, {
      status: 200,
      headers: {
        'Content-Type': 'text/vtt',
      },
    });
  } catch (error) {
    console.error('Subtitle fetch error:', error);
    return NextResponse.json({ error: 'error-fetching-subtitle' }, { status: 500 });
  }
}
