import { getLanguageName } from './getLangaugeName';

type Box = {
  size: number;
  type: string;
  start: number;
  end: number;
};

function readUInt32(buffer: Buffer, offset: number): number {
  return buffer.readUInt32BE(offset);
}

function readType(buffer: Buffer, offset: number): string {
  return buffer.toString('ascii', offset, offset + 4);
}

function parseBoxes(buffer: Buffer, start = 0, end = buffer.length): Box[] {
  const boxes: Box[] = [];
  let offset = start;

  while (offset < end) {
    const size = readUInt32(buffer, offset);
    const type = readType(buffer, offset + 4);

    if (size === 0) break;

    const boxEnd = offset + size;
    if (boxEnd > end) break;

    boxes.push({ size, type, start: offset + 8, end: boxEnd });
    offset += size;
  }

  return boxes;
}

function findBox(boxes: Box[], type: string): Box | undefined {
  return boxes.find((box) => box.type === type);
}

function parseHdlrBox(buffer: Buffer, box: Box): string {
  return readType(buffer, box.start + 8);
}

function parseStsdBox(buffer: Buffer, stsdBox: Box): string | null {
  const versionAndFlagsSize = 4;
  const entryCountOffset = stsdBox.start + versionAndFlagsSize;
  const entryCount = buffer.readUInt32BE(entryCountOffset);

  if (entryCount === 0) return null;
  return readType(buffer, entryCountOffset + 8);
}

function parseMdhdBox(buffer: Buffer, box: Box): string | undefined {
  const version = buffer.readUInt8(box.start);
  const langOffset = box.start + (version === 1 ? 32 : 20);

  if (langOffset + 2 > box.end) {
    throw new Error('mdhd too short for language field');
  }

  const langBits = buffer.readUInt16BE(langOffset);

  const c1 = ((langBits >> 10) & 0x1f) + 0x60;
  const c2 = ((langBits >> 5) & 0x1f) + 0x60;
  const c3 = (langBits & 0x1f) + 0x60;

  return String.fromCharCode(c1, c2, c3);
}

export function getAudioTracks(buffer: Buffer) {
  const topBoxes = parseBoxes(buffer);

  const moov = findBox(topBoxes, 'moov');
  if (!moov) throw new Error('No moov box found');

  const moovBoxes = parseBoxes(buffer, moov.start, moov.end);
  const trakBoxes = moovBoxes.filter((box) => box.type === 'trak');

  const audioTracks: {
    id: number;
    handlerType: string;
    codec: string;
    lang: string;
  }[] = [];

  for (const trak of trakBoxes) {
    const boxes = parseBoxes(buffer, trak.start, trak.end);

    const mdia = findBox(boxes, 'mdia');
    if (!mdia) continue;

    const mdiaBoxes = parseBoxes(buffer, mdia.start, mdia.end);
    const hdlr = findBox(mdiaBoxes, 'hdlr');

    if (!hdlr) continue;

    const handlerType = parseHdlrBox(buffer, hdlr);

    if (handlerType === 'soun') {
      const minf = findBox(mdiaBoxes, 'minf');
      if (!minf) continue;

      const minfBoxes = parseBoxes(buffer, minf.start, minf.end);
      const stbl = findBox(minfBoxes, 'stbl');
      if (!stbl) continue;

      const stblBoxes = parseBoxes(buffer, stbl.start, stbl.end);
      const stsd = findBox(stblBoxes, 'stsd');
      if (!stsd) continue;

      const codec = parseStsdBox(buffer, stsd) ?? 'not found';

      const mdhd = findBox(mdiaBoxes, 'mdhd');
      const langCode = mdhd ? parseMdhdBox(buffer, mdhd) : 'und';
      const lang = getLanguageName(langCode ?? 'und');

      audioTracks.push({ id: trak.start, handlerType, codec, lang });
    }
  }

  return audioTracks;
}
