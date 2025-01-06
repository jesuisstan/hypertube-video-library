//const response = await fetch('/api/yts/list_movies');
//const data = await response.json();
'use client';

import { useEffect, useState } from 'react';

import { ButtonCustom } from './ui/buttons/button-custom';
import VideoPlayer from './video-player';

import { fetchMoviesPopcorn } from '@/lib/popcorn-api';
import { fetchMovieDetails, fetchMovies } from '@/lib/yts-api';

export default function MovieList() {
  const [movies, setMovies] = useState<any[]>([]);
  const [moviesPopcorn, setMoviesPopcorn] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [errorPopcorn, setErrorPopcorn] = useState<string | null>(null);

  const [details, setDetails] = useState<any>(null);

  const [torrentUrl, setTorrentUrl] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await fetchMovies({ limit: 25, genre: 'adventure', sort_by: 'rating' });
        //console.log('MOVIES RAIR DATA', data); // debug
        setMovies(data.data.movies || []);
      } catch (err) {
        console.log('ERROR', err); // debug
        setError('Failed to load movies');
      }
    }

    loadMovies();
  }, []);

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await fetchMoviesPopcorn({
          sort: 'rating',
          order: '-1',
          genre: 'all',
          keywords: "string",
        });
        console.log('MOVIES RAIR DATA', data); // debug
        setMoviesPopcorn(data.data.movies || []);
      } catch (err) {
        console.log('ERROR', err); // debug
        setErrorPopcorn('Failed to load movies');
      }
    }

    loadMovies();
  }, []);

  async function loadMovieDetails() {
    try {
      // Передача эндпоинта и параметров через API-роут
      //const response = await fetch(
      //  '/api/yts/movies?endpoint=list_movies&limit=50&genre=comedy&sort_by=rating'
      //);

      const fDetails = await fetchMovieDetails(movies[24].id);

      setDetails(fDetails.data.movie || []);
      console.log('RAIR DETAILS', fDetails.data.movie.torrents[0].url); // debug
      setTorrentUrl(fDetails.data.movie.torrents[0].url);
    } catch (err) {
      console.log('ERROR', err); // debug
      setError('Failed to load Movie details');
    }
  }

  async function handleDownload() {
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/torrents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ torrentUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to download torrent');
      }

      const data = await response.json();
      //console.log('RAIR DATA', data); // debug
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (error) {
    return <p>{error}</p>;
  }
console.log('RAIR MOVIES POPCORN', moviesPopcorn); // debug
  return (
    <div className="flex flex-row space-x-4">
      <div>
        <h1 className="font-bold">Movies YTS</h1>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      </div>

      <div>
        <h1 className="font-bold">Movies POPCORN</h1>
        <ul>
          {moviesPopcorn.map((movie) => (
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
              <li>{details.torrents[0].url}</li>
              <br />

              <li>{torrentUrl}</li>
            </>
          )}
        </ul>
      </div>

      <div>
        <h1 className="font-bold">Download</h1>
        <ButtonCustom onClick={handleDownload}>Download</ButtonCustom>
        <div>
          <p>Downloaded: {String(result?.success)}</p>
          <p>Path: {result?.videoFilePath}</p>
        </div>
      </div>

      <div>{result?.videoFilePath && <VideoPlayer videoUrl={result?.videoFilePath} />}</div>
    </div>
  );
}
