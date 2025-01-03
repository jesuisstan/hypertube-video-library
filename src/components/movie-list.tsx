//const response = await fetch('/api/yts/list_movies');
//const data = await response.json();
'use client';

import { useEffect, useState } from 'react';

import { ButtonCustom } from './ui/buttons/button-custom';

import { fetchMovieDetails, fetchMovies } from '@/lib/yts-api';

export default function MovieList() {
  const [movies, setMovies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);

  async function fetchMoviesViaProxy() {
    const targetUrl = 'https://yts.mx/api/v2/list_movies.json?limit=50';
    const response = await fetch(`/api/yts/proxy?targetUrl=${encodeURIComponent(targetUrl)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch movies via proxy');
    }

    const data = await response.json();
    console.log("PROXYYYYYYYYYYYYY",data);
  }

  useEffect(() => {
    async function loadMovies() {
      try {
        // Передача эндпоинта и параметров через API-роут
        //const response = await fetch(
        //  '/api/yts/movies?endpoint=list_movies&limit=50&genre=comedy&sort_by=rating'
        //);
        const data = await fetchMovies({ limit: 42, genre: 'drama', sort_by: 'rating' });
        console.log('MOVIES RAIR DATA', data); // debug
        setMovies(data.data.movies || []);
      } catch (err) {
        console.log('ERROR', err); // debug
        setError('Failed to load movies');
      }
    }

    loadMovies();
    fetchMoviesViaProxy();
  }, []);

  async function loadMovieDetails() {
    try {
      // Передача эндпоинта и параметров через API-роут
      //const response = await fetch(
      //  '/api/yts/movies?endpoint=list_movies&limit=50&genre=comedy&sort_by=rating'
      //);

      const fDetails = await fetchMovieDetails(movies[0].id);

      setDetails(fDetails.data.movie || []);
      console.log('RAIR DETAILS', fDetails); // debug
    } catch (err) {
      console.log('ERROR', err); // debug
      setError('Failed to load Movie details');
    }
  }

  if (error) {
    return <p>{error}</p>;
  }
  console.log('MOVIES', movies); // debug

  return (
    <div className="flex flex-row space-x-4">
      <div>
        <h1 className="font-bold">Movies</h1>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      </div>

      <div>
        <h1 className="font-bold">Details</h1>
        <ButtonCustom onClick={loadMovieDetails}>Load Details</ButtonCustom>
        <ul>
          {/*{details?.map((detail) => (
            <li key={detail.id}>{detail.title}</li>
          ))}*/}
          {details && (
            <>
              <li>{details.title}</li>
              <br />
              <li>{details.description_full}</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
