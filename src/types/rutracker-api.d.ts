declare module 'rutracker-api-with-proxy' {
  interface TorrentResult {
    id: string;
    title: string;
    author: string;
    category: string;
    size: number;
    formattedSize: string;
    seeds: number;
    leeches: number;
    url: string;
    state: string;
    downloads: number;
    registered: Date;
  }

  interface LoginCredentials {
    username: string;
    password: string;
  }

  interface SearchOptions {
    query: string;
    sort?: 'registered' | 'title' | 'downloads' | 'size' | 'lastMessage' | 'seeds' | 'leeches';
    order?: 'desc' | 'asc';
  }

  interface ProxyOptions {
    proxy?: {
      protocol: 'http' | 'https';
      host: string;
      port: string;
      auth?: {
        username: string;
        password: string;
      };
    };
    httpsAgent?: any;
  }

  class RutrackerApi {
    constructor(baseUrl?: string, options?: ProxyOptions);
    login(credentials: LoginCredentials): Promise<void>;
    search(options: SearchOptions): Promise<TorrentResult[]>;
    download(torrentId: string): Promise<ReadableStream>;
    getMagnetLink(torrentId: string): Promise<string>;
  }

  export = RutrackerApi;
}
