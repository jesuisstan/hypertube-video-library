export type TTorrentDataYTS = {
  url: string; // Download link for the torrent
  hash: string; // Torrent hash
  quality: string; // Video quality (e.g., 720p, 1080p)
  type: string; // Release type (e.g., bluray, web)
  is_repack: string; // Indicates if this is a repack (1 or 0)
  video_codec: string; // Video codec (e.g., x264, x265)
  bit_depth: string; // Bit depth (e.g., 8, 10)
  audio_channels: string; // Number of audio channels (e.g., 2.0, 5.1)
  seeds: number; // Number of seeders
  peers: number; // Number of peers
  size: string; // File size in a human-readable format (e.g., 1.43 GB)
  size_bytes: number; // File size in bytes
  date_uploaded: string; // Upload date in string format
  date_uploaded_unix: number; // Upload date in Unix timestamp format
};

export type TMagnetDataPirateBay = {
  title: string; // Title of the torrent
  seeders: number; // Number of seeders
  leechers: number; // Number of leechers
  uploaded: string; // Upload date in string format (e.g., "09-24 2015")
  uploader: string; // Name of the uploader
  size: string; // File size in a human-readable format (e.g., "1.24 GiB")
  link: string; // Magnet link for the torrent
};

export type TTorrentDataRuTracker = {
  id: string; // Unique torrent identifier
  title: string; // Torrent title
  author: string; // Uploader name
  category: string; // Category name
  size: number; // Size in bytes
  formattedSize: string; // Formatted size (e.g., "3.03 GB")
  seeds: number; // Number of active seeders
  leeches: number; // Number of active leechers
  url: string; // Link to torrent page
  state: string; // Current torrent status
  downloads: number; // Number of downloads
  registered: Date; // Registration date
  magnetLink?: string; // Magnet link (if available)
};

export type TUnifiedMagnetData = {
  id: string; // Unique identifier
  title: string; // Torrent title
  seeds: number; // Number of seeders
  leeches: number; // Number of leechers
  size: string; // Formatted size
  sizeBytes: number; // Size in bytes for sorting
  uploaded: string; // Formatted upload date
  uploadedDate: Date; // Date object for sorting
  magnetLink: string; // Magnet link
  source: 'Rutracker' | 'PirateBay'; // Source of the data
  uploader?: string; // Uploader name (PirateBay)
};
