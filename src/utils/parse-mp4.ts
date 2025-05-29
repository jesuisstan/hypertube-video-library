type Box = {
  size: number;
  type: string;
  start: number; // position in buffer where box data starts
  end: number; // position where box data ends
};

// Read a uint32 from buffer at offset
function readUInt32(buffer: Buffer, offset: number): number {
  return buffer.readUInt32BE(offset);
}

// Read a string of 4 chars from buffer at offset
function readType(buffer: Buffer, offset: number): string {
  return buffer.toString('ascii', offset, offset + 4);
}

// Parse MP4 boxes recursively, return boxes with offsets
function parseBoxes(buffer: Buffer, start = 0, end = buffer.length): Box[] {
  const boxes: Box[] = [];
  let offset = start;

  while (offset < end) {
    const size = readUInt32(buffer, offset);
    const type = readType(buffer, offset + 4);

    if (size === 0) break; // size=0 means "rest of file" — stop for simplicity

    const boxEnd = offset + size;
    if (boxEnd > end) break; // invalid box size

    boxes.push({ size, type, start: offset + 8, end: boxEnd });
    offset += size;
  }

  return boxes;
}

// Find first box of given type among boxes
function findBox(boxes: Box[], type: string): Box | undefined {
  return boxes.find((box) => box.type === type);
}

// Recursively find all boxes of given type
function findBoxesRecursive(buffer: Buffer, boxes: Box[], type: string): Box[] {
  let results: Box[] = [];

  for (const box of boxes) {
    if (box.type === type) results.push(box);
    else {
      const childBoxes = parseBoxes(buffer, box.start, box.end);
      results = results.concat(findBoxesRecursive(buffer, childBoxes, type));
    }
  }

  return results;
}

// Parse 'hdlr' box to get handler type (track type)
function parseHdlrBox(buffer: Buffer, box: Box): string {
  return readType(buffer, box.start + 8);
}

// Now use these to extract audio tracks info
export function getAudioTracks(buffer: Buffer) {
  const topBoxes = parseBoxes(buffer);

  const moov = findBox(topBoxes, 'moov');
  if (!moov) throw new Error('No moov box found');

  const moovBoxes = parseBoxes(buffer, moov.start, moov.end);
  const trakBoxes = moovBoxes.filter((box) => box.type === 'trak');
  console.log(`Found ${trakBoxes.length} trak boxes`);

  const audioTracks: { id: number; handlerType: string }[] = [];

  for (const trak of trakBoxes) {
    const boxes = parseBoxes(buffer, trak.start, trak.end);

    const mdia = findBox(boxes, 'mdia');
    if (!mdia) continue;

    const mdiaBoxes = parseBoxes(buffer, mdia.start, mdia.end);

    const hdlr = findBox(mdiaBoxes, 'hdlr');

    if (!hdlr) continue;

    const handlerType = parseHdlrBox(buffer, hdlr);
    console.log(`trak at ${trak.start} has handlerType: "${handlerType}"`);

    if (handlerType === 'soun') {
      // For simplicity, track id = trak start offset (or parse actual tkhd box for track id)
      audioTracks.push({ id: trak.start, handlerType });
    }
  }

  return audioTracks;
}
