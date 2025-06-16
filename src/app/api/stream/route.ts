import { NextRequest, NextResponse } from 'next/server';

import ffmpeg from 'fluent-ffmpeg';
import magnet from 'magnet-uri';
import parseTorrent, { toMagnetURI } from 'parse-torrent';
import torrentStream from 'torrent-stream';

import { createAuthErrorResponse, getAuthSession } from '@/lib/auth-helpers';
import { TTorrentDataYTS, TUnifiedMagnetData } from '@/types/torrent-magnet-data';
import TorrentEngine = TorrentStream.TorrentEngine;
import TorrentFile = TorrentStream.TorrentFile;

const torrents = new Map<
  string,
  {
    magnetUri: string;
    movieId: number;
    engine?: TorrentEngine;
    file?: TorrentFile;
    fileName?: string;
    format?: VideoFileFormat;
  }
>();

function startDirectStream(hash: string): Promise<TorrentFile> {
  return new Promise((resolve, reject) => {
    const data = torrents.get(hash);
    if (!data) {
      console.error('[stream] Unknown hash:', hash);
      return reject(new Error('Unknown hash'));
    }
    if (data.engine) {
      console.log('[stream] Using existing engine for hash:', hash);
      if (data.file) {
        return resolve(data.file);
      }
    }

    const engine = torrentStream(data.magnetUri, {
      tmp: `${process.env.STORAGE_PATH || './tmp'}/streaming`,
      verify: false, // Disable verification for faster streaming
    });
    data.engine = engine;

    engine.on('ready', () => {
      const file = engine.files.find((f: TorrentFile) => {
        const fmt = getVideoFileFormatFrom(f.name);
        return fmt !== VideoFileFormat.UNKNOWN;
      });
      if (!file) {
        console.error(`[stream][${hash}] No video file found in torrent`);
        return reject(new Error('No video file found'));
      }
      data.fileName = file.name;
      data.format = getVideoFileFormatFrom(file.name);
      file.select();
      data.file = file;
      console.log(`[stream][${hash}] Ready to stream: ${file.name}`);
      resolve(file);
    });

    engine.on('error', (err: any) => {
      console.error(`[stream][${hash}] Engine error:`, err);
      reject(err);
    });
  });
}

export async function POST(request: Request) {
  try {
    const data: { source: TTorrentDataYTS | TUnifiedMagnetData | null; movieId: number } =
      await request.json();
    if (!data.source) {
      return NextResponse.json({ error: 'Empty data' }, { status: 400 });
    }

    let magnetUri: string;
    let infoHash: string;

    if ('url' in data.source) {
      const res = await fetch(data.source.url);
      if (!res.ok) {
        return NextResponse.json({ message: 'Failed to fetch torrent file' }, { status: 400 });
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const parsed = await parseTorrent(buf);
      if (!parsed.infoHash) {
        return NextResponse.json({ message: 'Invalid torrent file' }, { status: 400 });
      }
      infoHash = parsed.infoHash;
      magnetUri = toMagnetURI(parsed);
    } else if (data.source.magnetLink.startsWith('magnet:?')) {
      magnetUri = data.source.magnetLink;
      const parsed = magnet(magnetUri);
      if (!parsed.infoHash) {
        return NextResponse.json({ error: 'Failed to parse link' }, { status: 400 });
      }
      infoHash = parsed.infoHash;
    } else {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    torrents.set(infoHash, { magnetUri, movieId: data.movieId });

    return NextResponse.json({ streamUrl: infoHash });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) {
      const authError = createAuthErrorResponse('unauthorized');
      return NextResponse.json(
        { error: authError.error, message: authError.message },
        { status: authError.status }
      );
    }

    const hash = request.nextUrl.searchParams.get('hash');
    if (!hash) {
      return NextResponse.json({ message: 'Missing hash parameter' }, { status: 400 });
    }

    const data = torrents.get(hash);
    if (!data) {
      return NextResponse.json({ message: 'Unknown hash' }, { status: 404 });
    }

    // Always stream directly from torrent
    const file = await startDirectStream(hash);
    const total = file.length;
    const rangeHeader = request.headers.get('range') || '';
    const range = parseRange(rangeHeader, total);

    if (canStreamDirectly(data.format!)) {
      // Direct streaming for supported formats
      const rawStream = file.createReadStream({ start: range.start, end: range.end });
      return createStreamResponse(rawStream, range, total);
    } else {
      // Transcode unsupported formats to MP4 on the fly
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
  } catch (e) {
    console.error('[stream] Error:', e);
    return new NextResponse(null, { status: 404 });
  }
}

/** Helpers */
function getVideoFileFormatFrom(fileName: string): VideoFileFormat {
  const ext = fileName.split('.').pop()!.toLowerCase();
  switch (ext) {
    case 'mp4':
      return VideoFileFormat.MP4;
    case 'mkv':
      return VideoFileFormat.MKV;
    case 'avi':
      return VideoFileFormat.AVI;
    case 'ogg':
      return VideoFileFormat.OGG;
    default:
      return VideoFileFormat.UNKNOWN;
  }
}

interface Range {
  start: number;
  end: number;
  status: 200 | 206;
}

function parseRange(rangeHeader: string, total: number): Range {
  if (!rangeHeader) {
    return { start: 0, end: total - 1, status: 200 };
  }
  const [, range] = rangeHeader.match(/bytes=(.*)/) || [];
  let [s, e] = range.split('-');
  const start = parseInt(s, 10) || 0;
  const end = e
    ? Math.min(parseInt(e, 10), total - 1)
    : Math.min(start + 5 * 1024 * 1024 - 1, total - 1);
  const result = { start, end, status: 206 };
  return <Range>result;
}

function createStreamResponse(
  stream: NodeJS.ReadableStream,
  { start, end, status }: Range,
  total: number
): NextResponse {
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${total}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': String(end - start + 1),
    'Content-Type': 'video/mp4',
  };
  return new NextResponse(stream as any, { status, headers });
}

function canStreamDirectly(format: VideoFileFormat): boolean {
  const ok = format === VideoFileFormat.MP4 || format === VideoFileFormat.OGG;
  return ok;
}

enum VideoFileFormat {
  MP4 = 'mp4',
  MKV = 'mkv',
  AVI = 'avi',
  OGG = 'ogg',
  UNKNOWN = 'unknown',
}
