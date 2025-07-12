import crypto from 'crypto';
import dgram from 'dgram';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';
import fs from 'fs';
import net from 'net';

const DEFAULT_TRACKERS = [
  'glotorrents.pw:6969/announce',
  'tracker.opentrackr.org:1337/announce',
  'torrent.gresille.org:80/announce',
  'tracker.openbittorrent.com:80',
  'tracker.coppersurfer.tk:6969',
  'tracker.leechers-paradise.org:6969',
  'p4p.arenabg.ch:1337',
  'tracker.internetwarriors.net:1337',
  'open.demonii.com:1337/announce',
];

/**
 * Function to download the torrent file
 */
export async function downloadTorrentFile(url: string, destination: string): Promise<void> {
  const https = await import('https');
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to fetch torrent file: ${response.statusCode}`));
        }

        response.pipe(file);

        file.on('finish', () => file.close((err) => (err ? reject(err) : resolve())));
        file.on('error', (err) => {
          fs.unlink(destination, () => reject(err));
        });
      })
      .on('error', (err) => reject(err));
  });
}

/**
 * Function to connect to peers and download file
 */
export async function downloadVideoFile(metadata: any, destination: string) {
  const announceList = [...metadata.announce, ...DEFAULT_TRACKERS]; // List of trackers
  const files = metadata.files; // List of files in the torrent
  const totalLength = metadata.length; // Total size of the data
  const pieceLength = metadata.pieceLength; // Length of each piece
  const pieces = metadata.pieces; // List of piece hashes

  // Choose the main video file based on size
  const mainFile = files.reduce((largest: any, file: any) => {
    return file.length > largest.length ? file : largest;
  }, files[0]);

  console.log(`[INFO] Downloading file: ${mainFile.name}, Size: ${mainFile.length} bytes`);

  // Prepare to write the downloaded file
  const fileStream = createWriteStream(destination + '/' + mainFile.name);

  // Connect to peers and download pieces
  for (const trackerUrl of announceList) {
    console.log(`[INFO] Connecting to tracker: ${trackerUrl}`);
    try {
      // Fetch peers from the tracker
      const peers = await fetchPeersFromTracker(trackerUrl, metadata.infoHash);
      console.log(`[INFO] Found ${peers.length} peers`);

      for (const peer of peers) {
        console.log(`[INFO] Connecting to peer: ${peer.ip}:${peer.port}`);
        try {
          await downloadFromPeer(peer, pieces, pieceLength, totalLength, fileStream);
        } catch (peerError) {
          const error = peerError as Error;
          console.error(`[ERROR] Failed to download from peer ${peer.ip}: ${error.message}`);
        }
      }
    } catch (trackerError) {
      if (trackerError instanceof Error) {
        console.error(
          `[ERROR] Failed to connect to tracker ${trackerUrl}: ${trackerError.message}`
        );
      } else {
        console.error(`[ERROR] Failed to connect to tracker ${trackerUrl}: ${trackerError}`);
      }
    }
  }

  console.log(`[INFO] Download complete`);
}

/**
 * Fetch peers from a UDP tracker.
 * @param trackerUrl - The URL of the tracker.
 * @param infoHash - The torrent infoHash.
 * @returns Array of peers { ip, port }.
 */
export async function fetchPeersFromTracker(
  trackerUrl: string,
  infoHash: Buffer
): Promise<{ ip: string; port: number }[]> {
  return new Promise((resolve, reject) => {
    const timeoutDuration = 10000; // 10 seconds timeout
    const [protocol, hostAndPort] = trackerUrl.split('://');
    if (protocol !== 'udp') {
      return reject(new Error('Only UDP trackers are supported'));
    }

    const [host, portStr] = hostAndPort.split(':');
    const port = parseInt(portStr, 10);
    if (!host || isNaN(port)) {
      return reject(new Error('Invalid tracker URL format'));
    }

    console.log('[INFO] Tracker URL:', trackerUrl);
    const socket = dgram.createSocket('udp4');

    const transactionId = crypto.randomBytes(4);
    console.log('[INFO] Transaction ID:', transactionId.toString('hex'));

    const connectRequest = Buffer.concat([
      new Uint8Array([0x00, 0x00, 0x04, 0x17, 0x27, 0x10, 0x19, 0x80]), // Protocol ID
      new Uint8Array([0x00, 0x00, 0x00, 0x00]), // Action: Connect
      new Uint8Array(transactionId), // Transaction ID
    ]);

    const timeout = setTimeout(() => {
      reject(new Error('Tracker response timeout'));
      socket.close();
    }, timeoutDuration);

    socket.send(new Uint8Array(connectRequest), 0, connectRequest.length, port, host, (err) => {
      if (err) {
        clearTimeout(timeout);
        reject(err);
      }
    });

    socket.on('message', (response) => {
      clearTimeout(timeout);
      const action = response.readUInt32BE(0); // First 4 bytes: Action
      const receivedTransactionId = response.subarray(4, 8); // Next 4 bytes: Transaction ID

      if (!transactionId.equals(new Uint8Array(receivedTransactionId))) {
        return reject(new Error('Transaction ID mismatch'));
      }

      if (action === 0) {
        // Connect response
        const connectionId = response.subarray(8, 16); // Next 8 bytes: Connection ID
        const announceRequest = Buffer.concat([
          new Uint8Array(connectionId),
          new Uint8Array([0x00, 0x00, 0x00, 0x01]), // Action: Announce
          new Uint8Array(transactionId),
          new Uint8Array(infoHash), // InfoHash
          new Uint8Array(crypto.randomBytes(20)), // Peer ID (20 random bytes)
          new Uint8Array(Buffer.alloc(8, 0)), // Downloaded
          new Uint8Array(Buffer.alloc(8, 0)), // Left
          new Uint8Array(Buffer.alloc(8, 0)), // Uploaded
          new Uint8Array(Buffer.from([0x00, 0x00, 0x00, 0x00])), // Event: None
          new Uint8Array(Buffer.alloc(4, 0)), // IP Address
          new Uint8Array(crypto.randomBytes(4)), // Key
          new Uint8Array(Buffer.alloc(4, 50)), // Num want
          new Uint8Array(Buffer.from([0x00, 0x00])), // Port
        ]);

        socket.send(
          new Uint8Array(
            announceRequest.buffer,
            announceRequest.byteOffset,
            announceRequest.byteLength
          ),
          0,
          announceRequest.length,
          port,
          host
        );
      } else if (action === 1) {
        // Announce response
        const peers = [];
        for (let i = 20; i < response.length; i += 6) {
          const ip = `${response[i]}.${response[i + 1]}.${response[i + 2]}.${response[i + 3]}`;
          const port = response.readUInt16BE(i + 4);
          peers.push({ ip, port });
        }

        resolve(peers);
        socket.close();
      }
    });

    socket.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

// Helper function to download pieces from a peer
export async function downloadFromPeer(
  peer: { ip: string; port: number },
  pieces: Buffer[],
  pieceLength: number,
  totalLength: number,
  fileStream: fs.WriteStream
): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.connect(peer.port, peer.ip, () => {
      console.log(`[INFO] Connected to peer ${peer.ip}:${peer.port}`);

      // Send handshake
      const handshake = Buffer.concat([
        new Uint8Array(Buffer.from([19])),
        new Uint8Array(Buffer.from('BitTorrent protocol')),
        new Uint8Array(Buffer.alloc(8, 0)),
        new Uint8Array(pieces[0]),
        new Uint8Array(crypto.randomBytes(20)),
      ]);
      socket.write(new Uint8Array(handshake));
    });

    socket.on('data', (data) => {
      // Handle incoming data (piece request/response, keep-alive, etc.)
      console.log(`[INFO] Received data from peer ${peer.ip}`);
      // TODO: Parse piece responses and write to the fileStream
    });

    socket.on('end', () => {
      console.log(`[INFO] Connection closed by peer ${peer.ip}`);
      resolve();
    });

    socket.on('error', (err) => {
      console.error(`[ERROR] Connection error with peer ${peer.ip}: ${err.message}`);
      reject(err);
    });
  });
}
