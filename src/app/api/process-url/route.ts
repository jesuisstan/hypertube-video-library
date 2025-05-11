import { NextRequest, NextResponse } from 'next/server';

import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import * as magnet from 'magnet-uri';
import { PassThrough, Readable } from 'stream';
import torrentStream from 'torrent-stream';

const torrents: Map<string, magnet.Instance> = new Map();
let currentStream: PassThrough | null = null;

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
    const format = getVideoFileFormatFrom(file.name);
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
    console.log('Range:', start, end);
    const stream = file.createReadStream({ start, end });
    if (currentStream !== null) {
      currentStream = null;
    }
    if (canStreamDirectly(format)) {
      currentStream = stream;
    } else {
      console.log('Transcoding video with ffmpeg');
      currentStream = ffmpeg(stream)
        .outputFormat('mp4')
        .outputOptions([
          '-movflags frag_keyframe+empty_moov', // for streaming
        ])
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
        })
        .pipe() as PassThrough;
    }
    const response = new NextResponse(currentStream as any, {
      status: rangeHeader ? 206 : 200,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${canStreamDirectly(format) ? total : '*'}`,
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

function getVideoFile(engine: TorrentStream.TorrentEngine): Promise<TorrentStream.TorrentFile> {
  return new Promise((resolve, reject) => {
    engine.on('ready', () => {
      console.log('Engine is ready');
      const videoFile = engine.files.find((file) => {
        let format = getVideoFileFormatFrom(file.name);
        if (format === VideoFileFormat.UNKNOWN) {
          return false;
        }
        return true;
      });
      if (videoFile) {
        videoFile.select();
        resolve(videoFile);
      } else {
        reject('No video file found.');
      }
    });
  });
}

function getVideoFileFormatFrom(fileName: string): VideoFileFormat {
  const ext = fileName.split('.').pop();
  if (!ext) return VideoFileFormat.UNKNOWN;
  switch (ext.toLowerCase()) {
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

function isVideoFormat(format: VideoFileFormat): boolean {
  if (format === VideoFileFormat.UNKNOWN) {
    return false;
  }
  return true;
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
