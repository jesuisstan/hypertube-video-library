import fs from 'fs';
import path from 'path';

import { getAudioTracks } from '@/utils/parse-mp4';

export async function GET() {
  const filePath = path.resolve('./public/sample.mp4');
  const maxBytes = 2 * 1024 * 1024;
  const buffer = fs.readFileSync(filePath).buffer.slice(0, maxBytes); // ArrayBuffer

  const audioTracks = getAudioTracks(Buffer.from(buffer));
  console.log(audioTracks);

  return new Response();
}
