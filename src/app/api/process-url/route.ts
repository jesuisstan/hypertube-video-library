import { NextRequest, NextResponse } from 'next/server';

import * as magnet from 'magnet-uri';
import torrentStream from 'torrent-stream';

const torrents: Map<string, magnet.Instance> = new Map();

export async function POST(request: Request) {
  const { url } = await request.json();
  let magnet = parseMagnetLink(url) as magnet.Instance;
  if (magnet.xt === undefined || typeof magnet.xt !== 'string' || magnet.xt.length === 0) {
    return NextResponse.json({ message: 'Invalid magnet link' }, { status: 400 });
  }
  let hash = magnet.xt.split(':').pop();
  if (hash === undefined) {
    return NextResponse.json({ message: 'No hash found in magnet link' }, { status: 400 });
  }
  torrents.set(hash, magnet);
  let videoPath = `/api/process-url?hash=${hash}`;
  console.log('Video path:', videoPath);
  return NextResponse.json({ videoLink: videoPath });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hash = searchParams.get('hash');
  if (!hash || typeof hash !== 'string') {
    return NextResponse.json({ message: 'Missing hash parameter' }, { status: 400 });
  }
  const magnetUri = torrents.get(hash);
  if (magnetUri === undefined) {
    return NextResponse.json({ message: 'No magnet URI provided' }, { status: 400 });
  }
  let magnetString = magnet.encode(magnetUri);
  console.log('Magnet:', magnetString);

  const engine = torrentStream(magnetString, {
    tmp: './tmp',
    path: './tmp/downloads',
    verify: true,
  });

  try {
    const file = await getVideoFile(engine);
    const total = file.length;

    const rangeHeader = request.headers.get('range') || '';
    let start = 0;
    let end = total - 1;

    if (rangeHeader) {
      const [, range] = rangeHeader.match(/bytes=(.*)/) || [];
      const [rangeStart, rangeEnd] = range.split('-');
      start = parseInt(rangeStart, 10);
      if (rangeEnd) end = parseInt(rangeEnd, 10);
    }

    const stream = file.createReadStream({ start, end });

    const response = new NextResponse(stream as any, {
      status: rangeHeader ? 206 : 200,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': (end - start + 1).toString(),
        'Content-Type': 'video/mp4',
      },
    });
    return response;
  } catch (err) {
    console.error('Streaming error:', err);
    return NextResponse.json({ message: 'Failed to stream video' }, { status: 500 });
  }
}

function parseMagnetLink(uri: string): magnet.Instance {
  return magnet.decode(uri);
}

function getVideoFile(engine: TorrentStream.TorrentEngine): Promise<any> {
  return new Promise((resolve, reject) => {
    engine.on('ready', () => {
      console.log('Engine is ready');
      const videoFile = engine.files.find((file) => {
        const ext = file.name.split('.').pop();
        if (!ext) return false;
        return ['mp4', 'mkv', 'avi', 'ogg'].includes(ext);
      });
      if (videoFile) resolve(videoFile);
      else reject('No video file found.');
    });
  });
}
