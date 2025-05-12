export type TMovieBasics = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  genres?: { id: string; name: string }[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string; // ISO 8601 date format
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  imdb_id?: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
};

export type TMovieCredits = {
  id: number;
  cast: TCastMember[];
  crew: TCrewMember[];
};

export type TCastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  gender: number | null;
  order: number;
};

export type TCrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  gender: number | null;
};
