const PROXY_YTS_API_URL = '/api/torrents/proxy';

/**
 * Universal function for fetching data from YTS API
 */
export async function fetchYTSApi(endpoint: string, params: Record<string, string | number>) {
  const query = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => {
        acc[key] = value.toString();
        return acc;
      },
      {} as Record<string, string>
    )
  ).toString();

  const targetUrl = `${process.env.YTS_API_BASE_URL || 'https://yts.mx/api/v2'}/${endpoint}.json?${query}`;
  const response = await fetch(`${PROXY_YTS_API_URL}?targetUrl=${encodeURIComponent(targetUrl)}`);

  if (!response.ok) {
    console.log('Error fetching YTS API:', response.statusText); // to avoid throwing an error in case the API is blocked by internet provider
    return;
    //throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a list of movies
 */
export async function fetchMovies(params: Record<string, string | number>) {
  return fetchYTSApi('list_movies', params);
}

/**
 * Get details of a movie
 */
export async function fetchMovieDetails(movieId: number) {
  return fetchYTSApi('movie_details', { movie_id: movieId });
}

/**
 * Get movie suggestions
 */
export async function fetchMovieSuggestions(movieId: number) {
  return fetchYTSApi('movie_suggestions', { movie_id: movieId });
}

/**
 * Get movie comments
 */
export async function fetchMovieComments(movieId: number) {
  return fetchYTSApi('movie_comments', { movie_id: movieId });
}

/**
 * Search movies by title
 */
export async function fetchMoviesByTitle(
  title: string,
  additionalParams: Record<string, string | number> = {}
) {
  // 'query_term' is used to search movies by title or other identifying term
  return fetchYTSApi('list_movies', {
    query_term: title,
    ...additionalParams,
  });
}
