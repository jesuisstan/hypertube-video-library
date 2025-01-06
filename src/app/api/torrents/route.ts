import { NextResponse } from 'next/server';

import fs from 'fs';
import parseTorrent, { Instance as TorrentInstance } from 'parse-torrent';
import path from 'path';

import { downloadTorrentFile, downloadVideoFile } from '@/lib/torrent-downloader';

export async function POST(req: Request) {
  try {
    const { torrentUrl } = await req.json();
    console.log('[INFO] Torrent URL:', torrentUrl);

    if (!torrentUrl) {
      return NextResponse.json(
        { success: false, error: 'No torrent URL provided' },
        { status: 400 }
      );
    }

    // Создаем директории для хранения файлов
    const torrentsDir = path.resolve(process.cwd(), 'public/downloads/torrents');
    const videosDir = path.resolve(process.cwd(), 'public/downloads/videos');
    if (!fs.existsSync(torrentsDir)) fs.mkdirSync(torrentsDir, { recursive: true });
    if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

    // Скачиваем .torrent файл
    const torrentFilePath = path.join(torrentsDir, `${Date.now()}.torrent`);
    await downloadTorrentFile(torrentUrl, torrentFilePath);

    // Парсим .torrent файл
    const torrentBuffer = fs.readFileSync(torrentFilePath);
    const torrentMetadata = (await parseTorrent(torrentBuffer)) as TorrentInstance;

    if (!torrentMetadata || !torrentMetadata.infoHash) {
      throw new Error('Invalid torrent metadata');
    }

    console.log('[INFO] Torrent metadata:', torrentMetadata);

    // Загружаем и сохраняем видеофайл
    const videoFilePath = path.join(videosDir, `${torrentMetadata.infoHash}.mp4`);
    await downloadVideoFile(torrentMetadata, videosDir);

    return NextResponse.json({
      success: true,
      infoHash: torrentMetadata.infoHash,
      videoFilePath,
    });
  } catch (error: any) {
    console.error('[ERROR] Torrent download failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
