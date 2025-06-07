import { NextResponse } from 'next/server';

// Import the RuTracker API (you'll need to install: npm install rutracker-api-with-proxy)
import RutrackerApi from 'rutracker-api-with-proxy';

export async function GET(request: Request) {
  try {
    const movieTitle = new URL(request.url).searchParams.get('title') || '';
    const releaseYear = new URL(request.url).searchParams.get('year') || '';

    if (!movieTitle || !releaseYear) {
      return NextResponse.json(
        { error: 'Title and year parameters are required' },
        { status: 400 }
      );
    }

    // Initialize RuTracker API
    const rutracker = new RutrackerApi();

    // Login credentials
    const username = process.env.RUTRACKER_LOGIN;
    const password = process.env.RUTRACKER_PASSWORD;

    if (!username || !password) {
      return NextResponse.json({ error: 'RuTracker credentials not configured' }, { status: 500 });
    }

    const credentials = { username, password };

    // Login to RuTracker
    await rutracker.login(credentials);

    // Search for torrents
    const searchQuery = `${movieTitle} ${releaseYear}`;
    const torrents = await rutracker.search({
      query: searchQuery,
      sort: 'seeds', // Sort by seeds for better quality results
      order: 'desc',
    });

    // Filter results for video content and limit to 10 results
    const videoCategories = [
      'Зарубежные фильмы',
      'Фильмы',
      'Зарубежное кино',
      'Наше кино',
      'Зарубежные сериалы',
      'Наши сериалы',
      'Мультфильмы',
      'Аниме',
    ];

    const filteredTorrents = torrents
      .filter((torrent: any) => {
        // Filter by video categories
        const isVideoCategory = videoCategories.some((category) =>
          torrent.category.toLowerCase().includes(category.toLowerCase())
        );

        // Filter by approved status
        const isApproved = torrent.state === 'проверено';

        // Filter by title containing movie title
        const titleMatch = torrent.title.toLowerCase().includes(movieTitle.toLowerCase());

        return isVideoCategory && isApproved && titleMatch;
      })
      .slice(0, 10);

    // Get magnet links for filtered torrents
    const torrentsWithMagnets = await Promise.all(
      filteredTorrents.map(async (torrent: any) => {
        try {
          const magnetLink = await rutracker.getMagnetLink(torrent.id);
          return {
            ...torrent,
            magnetLink,
          };
        } catch (error) {
          console.error(`Failed to get magnet link for torrent ${torrent.id}:`, error);
          return null; // Return null for torrents without magnet links
        }
      })
    );

    // Filter out torrents without magnet links
    const validTorrents = torrentsWithMagnets.filter((torrent) => torrent !== null);

    return NextResponse.json(validTorrents);
  } catch (error) {
    console.error('Error fetching RuTracker data:', error);
    return NextResponse.json({ error: 'error-fetching-torrent-data' }, { status: 500 });
  }
}
