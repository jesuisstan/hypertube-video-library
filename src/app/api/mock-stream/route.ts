import { NextRequest } from 'next/server';

import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const filePath = path.resolve('public/sample.mp4');

  if (!fs.existsSync(filePath)) {
    return new Response('Video not found', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.get('range');

  if (!range) {
    return new Response('Requires Range header', { status: 416 });
  }

  const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
  const start = parseInt(startStr, 10);
  const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

  if (start >= fileSize || isNaN(start)) {
    return new Response('Requested range not satisfiable', { status: 416 });
  }

  const chunkSize = end - start + 1;
  const file = fs.createReadStream(filePath, { start, end });

  return new Response(file as any, {
    status: 206,
    headers: {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize.toString(),
      'Content-Type': 'video/mp4',
    },
  });
}
