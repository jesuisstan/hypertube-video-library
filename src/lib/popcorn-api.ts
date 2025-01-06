const PROXY_POPCORN_API_URL = '/api/torrents/proxy';

/**
 * Universal function for fetching data from POPCORN API
 */
export async function fetchPopcornApi(endpoint: string, params: Record<string, string | number>) {
  const query = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => {
        acc[key] = value.toString();
        return acc;
      },
      {} as Record<string, string>
    )
  ).toString();

  const targetUrl = `${process.env.POPCORN_API_BASE_URL || 'https://tv-v2.api-fetch.website'}/${endpoint}?${query}`;
  console.log('Fetching through proxy:', targetUrl);

  const response = await fetch(
    `${PROXY_POPCORN_API_URL}?targetUrl=${encodeURIComponent(targetUrl)}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a list of movies
 */
export async function fetchMoviesPopcorn(params: Record<string, string | number>) {
  return fetchPopcornApi('movies/page', params);
}

/**
 * Get details of a movie
 */
export async function fetchMovieDetails(movieId: number) {
  return fetchPopcornApi('movie_details', { movie_id: movieId });
}

/**
 * Get movie suggestions
 */
export async function fetchMovieSuggestions(movieId: number) {
  return fetchPopcornApi('movie_suggestions', { movie_id: movieId });
}

/**
 * Get movie comments
 */
export async function fetchMovieComments(movieId: number) {
  return fetchPopcornApi('movie_comments', { movie_id: movieId });
}
