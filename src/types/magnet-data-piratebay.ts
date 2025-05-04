export type TMagnetDataPirateBay = {
  title: string; // Title of the torrent
  seeders: number; // Number of seeders
  leechers: number; // Number of leechers
  uploaded: string; // Upload date in string format (e.g., "09-24 2015")
  uploader: string; // Name of the uploader
  size: string; // File size in a human-readable format (e.g., "1.24 GiB")
  link: string; // Magnet link for the torrent
};
