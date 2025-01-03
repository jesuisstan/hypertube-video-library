const YTS_API_BASE_URL = process.env.YTS_API_BASE_URL || 'https://yts.mx/api/v2';

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

  const url = `${YTS_API_BASE_URL}/${endpoint}.json?${query}`;
  console.log('Fetching URL:', url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
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
