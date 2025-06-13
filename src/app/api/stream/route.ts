import { NextRequest, NextResponse } from 'next/server';

import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import magnet from 'magnet-uri';
import parseTorrent, { toMagnetURI } from 'parse-torrent';
import path from 'path';
import { PassThrough, Readable } from 'stream';
import torrentStream from 'torrent-stream';
import TorrentEngine = TorrentStream.TorrentEngine;
import { TTorrentDataYTS, TUnifiedMagnetData } from '@/types/torrent-magnet-data';
import TorrentFile = TorrentStream.TorrentFile;

interface TorrentData {
  magnetUri: string;
  engine?: TorrentStream.TorrentEngine;
  file?: TorrentStream.TorrentFile;
  downloadPromise?: Promise<void>;
  fileName?: string;
  format?: VideoFileFormat;
  storagePath?: string;
}

const torrents = new Map<string, TorrentData>();

function ensureStorageDir(hash: string) {
  const dir = path.resolve(`./storage/films/${hash}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function startBackgroundDownload(hash: string): Promise<TorrentStream.TorrentFile> {
  return new Promise((resolve, reject) => {
    const data = torrents.get(hash);
    if (!data) reject(new Error('Unknown hash'));
    if (data!.downloadPromise) reject(new Error('Already downloading'));
    const engine = torrentStream(data!.magnetUri, {
      tmp: './tmp',
      path: `./storage/films/${hash}`,
      verify: true,
    });
    data!.engine = engine;
    engine.on('ready', () => {
      const file = engine.files.find((f: TorrentStream.TorrentFile) => {
        const fmt = getVideoFileFormatFrom(f.name);
        return fmt !== VideoFileFormat.UNKNOWN;
      });
      if (!file) return reject(new Error('No video file found'));
      data!.fileName = file.name;
      data!.format = getVideoFileFormatFrom(file.name);
      const storageDir = ensureStorageDir(hash);
      const outputPath = path.join(storageDir, 'video.mp4');
      data!.storagePath = outputPath;
      file.select();
      data!.file = file;
      resolve(file);
      const out = fs.createWriteStream(outputPath);
      out.on('finish', () => resolve(file));
    });
    engine.on('error', reject);
    // });
  });
}

export async function POST(request: Request) {
  const {
    torrentSource,
  }: {
    torrentSource: TTorrentDataYTS | TUnifiedMagnetData | null;
  } = await request.json();
  let magnetUri: string;
  let infoHash: string;
  if (!torrentSource) {
    return NextResponse.json({ error: 'Empty data' }, { status: 400 });
  }
  if ('url' in torrentSource) {
    const res = await fetch(torrentSource.url);
    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to fetch torrent file' }, { status: 400 });
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const parsed = await parseTorrent(buf);
    if (!parsed.infoHash) {
      console.log('Invalid torrent file:', parsed);
      return NextResponse.json({ message: 'Invalid torrent file' }, { status: 400 });
    }
    infoHash = parsed.infoHash;
    magnetUri = toMagnetURI(parsed);
  } else if (torrentSource.magnetLink.startsWith('magnet:?')) {
    magnetUri = torrentSource.magnetLink;
    const parsed = magnet(magnetUri);
    if (!parsed.infoHash) {
      return NextResponse.json({ error: 'Failed to parse link' }, { status: 400 });
    }
    infoHash = parsed.infoHash;
  } else {
    return NextResponse.json({ message: 'Invalid  data' }, { status: 400 });
  }
  torrents.set(infoHash, { magnetUri });
  startBackgroundDownload(infoHash);
  return NextResponse.json({ streamUrl: infoHash });
}

export async function GET(request: NextRequest) {
  const hash = request.nextUrl.searchParams.get('hash');
  if (!hash) {
    return NextResponse.json({ message: 'Missing hash parameter' }, { status: 400 });
  }

  const data = torrents.get(hash);
  if (!data) {
    return NextResponse.json({ message: 'Unknown hash' }, { status: 404 });
  }
  let file: TorrentFile;
  if (!data.file || !data.engine) {
    file = await startBackgroundDownload(hash);
  } else {
    file = data.file;
  }

  try {
    const format = getVideoFileFormatFrom(file.name);
    const total = file.length;

    const rangeHeader = request.headers.get('range') || '';
    const CHUNK_SIZE = 5 * 1024 * 1024;
    console.log(request.headers);
    console.log(request.nextUrl.searchParams);
    let start = 0;
    let end = total - 1;
    if (canStreamDirectly(format) && rangeHeader) {
      const [, range] = rangeHeader.match(/bytes=(.*)/) || [];
      const [s, e] = range.split('-');
      start = parseInt(s, 10);
      end = e ? Math.min(parseInt(e, 10), total - 1) : Math.min(start + CHUNK_SIZE - 1, total - 1);
    }

    const stream = file.createReadStream({ start, end });
    let outputStream: PassThrough | Readable;

    if (canStreamDirectly(format)) {
      outputStream = stream;
    } else {
      outputStream = ffmpeg(stream)
        .outputFormat('mp4')
        .outputOptions(['-movflags frag_keyframe+empty_moov+faststart'])
        .on('error', (err) => console.error('FFmpeg error:', err))
        .pipe() as PassThrough;
      return new NextResponse(outputStream as any, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4',
        },
      });
    }

    return new NextResponse(outputStream as any, {
      status: rangeHeader ? 206 : 200,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(end - start + 1),
        'Content-Type': 'video/mp4',
      },
    });
  } catch (err) {
    console.error('Streaming error:', err);
    return NextResponse.json({ message: 'Failed to stream video' }, { status: 500 });
  }
}

// Helpers
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

function canStreamDirectly(format: VideoFileFormat): boolean {
  return format === VideoFileFormat.MP4 || format === VideoFileFormat.OGG;
}

enum VideoFileFormat {
  MP4 = 'mp4',
  MKV = 'mkv',
  AVI = 'avi',
  OGG = 'ogg',
  UNKNOWN = 'unknown',
}

function getVideoFile(engine: TorrentEngine): Promise<TorrentStream.TorrentFile> {
  return new Promise((resolve, reject) => {
    engine.on('ready', () => {
      const file = engine.files.find(
        (f) => getVideoFileFormatFrom(f.name) !== VideoFileFormat.UNKNOWN
      );
      if (file) {
        file.select();
        resolve(file);
      } else {
        reject(new Error('No video file found'));
      }
    });
    engine.on('error', reject);
  });
}
