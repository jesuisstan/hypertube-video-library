declare module 'bittorrent-tracker' {
  import { EventEmitter } from 'events';

  interface TrackerClientOptions {
    infoHash: string | Buffer;
    announce: string[];
    peerId: string | Buffer;
    port: number;
  }

  class TrackerClient extends EventEmitter {
    constructor(options: TrackerClientOptions);
    start(): void;
    stop(): void;
  }

  export = TrackerClient;
}
