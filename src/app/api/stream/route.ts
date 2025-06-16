import { NextRequest, NextResponse } from 'next/server';

import ffmpeg from 'fluent-ffmpeg';
import magnet from 'magnet-uri';
import parseTorrent, { toMagnetURI } from 'parse-torrent';
import torrentStream from 'torrent-stream';

// В памяти: infoHash -> { magnetUri, engine, file, format }
const torrents = new Map<
  string,
  { magnetUri: string; engine?: any; file?: any; format?: string }
>();

function getVideoFileFormatFrom(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (ext === 'mp4') return 'mp4';
  if (ext === 'ogg') return 'ogg';
  if (ext === 'mkv') return 'mkv';
  if (ext === 'avi') return 'avi';
  return 'unknown';
}

export async function POST(request: Request) {
  const data = await request.json();
  let magnetUri: string, infoHash: string | undefined;

  if ('url' in data.source) {
    const res = await fetch(data.source.url);
    const buf = Buffer.from(await res.arrayBuffer());
    const parsed = await parseTorrent(buf);
    infoHash = parsed.infoHash;
    if (!infoHash) return NextResponse.json({ error: 'Invalid torrent file' }, { status: 400 });
    magnetUri = toMagnetURI(parsed);
  } else if (data.source.magnetLink.startsWith('magnet:?')) {
    magnetUri = data.source.magnetLink;
    const parsed = magnet(magnetUri);
    infoHash = parsed.infoHash;
    if (!infoHash) return NextResponse.json({ error: 'Invalid magnet link' }, { status: 400 });
  } else {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  torrents.set(infoHash, { magnetUri });
  return NextResponse.json({ streamUrl: infoHash });
}

export async function GET(request: NextRequest) {
  const hash = request.nextUrl.searchParams.get('hash');
  if (!hash) return NextResponse.json({ error: 'Missing hash' }, { status: 400 });

  let data = torrents.get(hash);
  if (!data) return NextResponse.json({ error: 'Unknown hash' }, { status: 404 });

  // Инициализация torrent engine и выбор файла
  if (!data.engine) {
    data.engine = torrentStream(data.magnetUri, { verify: false });
    await new Promise((resolve, reject) => {
      data.engine.on('ready', resolve);
      data.engine.on('error', reject);
    });
    data.file = data.engine.files.find((f: any) => getVideoFileFormatFrom(f.name) !== 'unknown');
    if (!data.file) return NextResponse.json({ error: 'No video file found' }, { status: 404 });
    data.format = getVideoFileFormatFrom(data.file.name);
    data.file.select();
  }

  const file = data.file;
  const total = file.length;
  const rangeHeader = request.headers.get('range') || '';
  const match = /bytes=(\d+)-(\d+)?/.exec(rangeHeader);
  const start = match ? parseInt(match[1], 10) : 0;
  const end = match && match[2] ? parseInt(match[2], 10) : total - 1;

  if (data.format === 'mp4' || data.format === 'ogg') {
    const stream = file.createReadStream({ start, end });
    return new NextResponse(stream as any, {
      status: match ? 206 : 200,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(end - start + 1),
        'Content-Type': 'video/mp4',
      },
    });
  } else {
    // On-the-fly transcoding
    const transcoded = ffmpeg(file.createReadStream({ start: 0, end: total - 1 }))
      .outputFormat('mp4')
      .outputOptions(['-movflags frag_keyframe+empty_moov+faststart'])
      .on('error', (err) => console.error('[FFmpeg] Error during transcoding:', err))
      .pipe();

    return new NextResponse(transcoded as any, {
      status: 200,
      headers: { 'Content-Type': 'video/mp4' },
    });
  }
}
