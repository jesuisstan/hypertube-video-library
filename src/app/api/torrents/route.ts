import { NextResponse } from 'next/server';

import fs from 'fs';
import parseTorrent, { Instance as TorrentInstance } from 'parse-torrent';
import path from 'path';

async function fetchTorrentBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch torrent file');
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: Request) {
  try {
    const { torrentUrl } = await req.json(); // Получение URL торрента из запроса
    const tempDir = path.resolve(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true }); // Создаёт папку и вложенные директории, если нужно
    }

    const torrentBuffer = await fetchTorrentBuffer(torrentUrl);
    const torrent = (await parseTorrent(torrentBuffer)) as TorrentInstance;
    console.log('------TORRENT:', torrent); // debug

    if (!torrent) {
      throw new Error('Failed to parse torrent');
    }

    const videoFile = torrent.files?.find(
      (file) => file.name.endsWith('.mp4') || file.name.endsWith('.mkv')
    );
    console.log('------VIDEO FILE:', videoFile); // debug
    if (!videoFile) {
      throw new Error('No video file found in the torrent');
    }

    const videoPath = path.join(tempDir, `${torrent.name}.mp4`);
    const writeStream = fs.createWriteStream(videoPath);

    // Simplified logic: simulate file writing
    writeStream.write('Simulated video data');
    writeStream.end();

    return NextResponse.json({
      hash: torrent.infoHash,
      videoPath,
      fileName: videoFile.name,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
