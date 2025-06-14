import { NextRequest, NextResponse } from 'next/server';

import { db, VercelPoolClient } from '@vercel/postgres';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import magnet from 'magnet-uri';
import parseTorrent, { toMagnetURI } from 'parse-torrent';
import path from 'path';
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

function startBackgroundDownload(hash: string): Promise<TorrentFile> {
  return new Promise((resolve, reject) => {
    const data = torrents.get(hash);
    if (!data) {
      console.error('[download] Unknown hash:', hash);
      return reject(new Error('Unknown hash'));
    }
    if (data.engine) {
      console.warn('[download] Download already in progress for hash:', hash);
      return reject(new Error('Already downloading'));
    }

    const engine = torrentStream(data.magnetUri, {
      tmp: `${process.env.STORAGE_PATH}/tmp`,
      path: `${process.env.STORAGE_PATH}/downloading/${hash}`,
      verify: true,
    });
    data.engine = engine;
    engine.on('ready', () => {
      const file = engine.files.find((f: TorrentFile) => {
        const fmt = getVideoFileFormatFrom(f.name);
        return fmt !== VideoFileFormat.UNKNOWN;
      });
      if (!file) {
        console.error(`[download][${hash}] No video file found in torrent`);
        return reject(new Error('No video file found'));
      }
      data.fileName = file.name;
      data.format = getVideoFileFormatFrom(file.name);
      file.select();
      data.file = file;
      resolve(file);
    });

    engine.on('error', (err: any) => {
      console.error(`[download][${hash}] Engine error:`, err);
      reject(err);
    });

    engine.on('idle', async () => {
      try {
        await saveVideoFile(data, hash);
        await setDownloadComplete(data.movieId, hash);
      } catch (err) {
        console.error(`[download][${hash}] Error saving or updating:`, err);
      }
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
    await cleanupStaleMovies();
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

  if (await isFileAvailable(hash)) {
    const filePath = path.resolve(`./storage/available/${hash}`);
    await updateLastWatchedLocal(hash);
    return streamFileFromDisk(filePath, request);
  }

  let file: TorrentFile;
  if (data.file && data.engine) {
    file = data.file;
  } else {
    file = await startBackgroundDownload(hash);
  }

  const total = file.length;
  const rangeHeader = request.headers.get('range') || '';
  const range = parseRange(rangeHeader, total);

  if (canStreamDirectly(data.format!)) {
    const rawStream = file.createReadStream({ start: range.start, end: range.end });
    return createStreamResponse(rawStream, range, total);
  }
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

async function streamFileFromDisk(filePath: string, req: NextRequest): Promise<NextResponse> {
  const { size } = await fs.promises.stat(filePath);
  const rangeHeader = req.headers.get('range') || '';
  const range = parseRange(rangeHeader, size);
  const rs = fs.createReadStream(filePath, { start: range.start, end: range.end });
  return createStreamResponse(rs, range, size);
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

// DB and storage helpers...
async function saveVideoFile(data: { file?: TorrentFile; format?: VideoFileFormat }, hash: string) {
  console.log('[saveVideo] Saving video for hash:', hash);
  if (!data.file) throw new Error('No file to save');
  const base = process.env.STORAGE_PATH ?? './storage';
  const srcFolder = path.join(base, 'downloading', hash);
  const srcPath = path.join(srcFolder, data.file.path);
  if (!srcPath) throw new Error('Failed to find file path');
  const destFolder = path.join(base, 'available');
  await fs.promises.mkdir(destFolder, { recursive: true });
  const destDir = path.join(destFolder, hash);
  const isDirect = canStreamDirectly(data.format!);
  if (isDirect) {
    await fs.promises.rename(srcPath, destDir);
  } else {
    const mp4Path = `${destDir}.mp4`;
    await convertToMp4(srcPath, mp4Path);
    await fs.promises.rename(mp4Path, destDir);
  }
  const tmpDir = path.dirname(data.file.path);
  await fs.promises.rm(srcFolder, { recursive: true, force: true });
  console.log('[saveVideo] Cleaned up temp dir:', tmpDir);
}

async function convertToMp4(inputPath: string, outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(['-c:v libx264', '-c:a aac', '-movflags frag_keyframe+empty_moov+faststart'])
      .on('error', (err) => {
        console.error('[saveAsMp4] FFmpeg error:', err);
        reject(err);
      })
      .on('end', async () => {
        await fs.promises.unlink(inputPath);
        resolve(outputPath);
      })
      .save(outputPath);
  });
}

async function setDownloadComplete(movieId: number, hash: string) {
  const client = await db.connect();
  const query = `INSERT INTO movies_available (torrent_hash, movie_id, last_watched) VALUES ($1, $2, NOW()) RETURNING id`;
  try {
    const res = await client.query(query, [hash, movieId]);
    return res.rows[0].id;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

async function isFileAvailable(hash: string): Promise<boolean> {
  const dbOk = await checkDbIsFileAvailable(hash);
  const fsOk = await checkStorageIsFileAvailable(hash);
  return dbOk && fsOk;
}

async function checkDbIsFileAvailable(hash: string): Promise<boolean> {
  const client: VercelPoolClient = await db.connect();
  try {
    const { rows } = await client.query(
      `SELECT EXISTS(SELECT 1 FROM movies_available WHERE torrent_hash=$1) AS exists`,
      [hash]
    );
    return rows[0].exists;
  } finally {
    client.release();
  }
}

async function checkStorageIsFileAvailable(hash: string): Promise<boolean> {
  const base = process.env.STORAGE_PATH || './storage';
  const dest = path.join(base, 'available', hash);
  try {
    await fs.promises.access(dest, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function updateLastWatchedLocal(hash: string): Promise<number> {
  const client = await db.connect();
  const query = `
    UPDATE movies_available
    SET last_watched = NOW()
    WHERE id = (
      SELECT id
      FROM movies_available
      WHERE torrent_hash = $1
      ORDER BY last_watched DESC
      LIMIT 1
      )
      RETURNING id
  `;
  try {
    const res = await client.query(query, [hash]);
    if (res.rows.length === 0) {
      return 0;
    }
    return res.rows[0].id;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

async function cleanupStaleMovies(): Promise<string[]> {
  const base = process.env.STORAGE_PATH ?? './storage';
  const availableRoot = path.join(base, 'available');
  let staleHashes: string[];
  try {
    staleHashes = await fetchStaleMovieHashes();
  } catch (err) {
    console.error('[cleanup] Failed to fetch stale hashes:', err);
    throw err;
  }

  const deleted: string[] = [];
  for (const hash of staleHashes) {
    const dirToDelete = path.join(availableRoot, hash);
    try {
      await fs.promises.rm(dirToDelete, { recursive: true, force: true });
      deleted.push(hash);
    } catch (err) {
      console.error(`[cleanup] Error deleting ${dirToDelete}:`, err);
    }
  }
  return deleted;
}

async function fetchStaleMovieHashes(): Promise<string[]> {
  const client = await db.connect();
  try {
    const query = `
      SELECT DISTINCT torrent_hash
      FROM movies_available
      WHERE last_watched < NOW() - INTERVAL '30 days'
    `;
    const { rows } = await client.query<{ torrent_hash: string }>(query);
    return rows.map((r) => r.torrent_hash);
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}
