'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import MovieCredits from './(components)/movie-credits';
import MovieHeader from './(components)/movie-header';
import MovieTorrentsList from './(components)/movie-torrents-list';

import Loading from '@/app/loading';
import useUserStore from '@/stores/user';
import { TMovieBasics } from '@/types/movies';

const MovieProfile = () => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const { id: movieId } = useParams(); // Grab the id from the dynamic route
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState<TMovieBasics | null>(null);

  const scrapeTMDB = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/movies/${movieId}/?lang=${locale}`); // todo fetch EN data to avoid torrent-scraping issues coused by original titles
      const data = await response.json();
      setMovieData(data);
    } catch (error) {
      console.error('Error scraping TMDB:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch movie data and credits on component mount
  useEffect(() => {
    scrapeTMDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //console.log('TMBB movieData', movieData); // debug

  return loading || !movieData ? (
    <Loading />
  ) : (
    <div className="w-full">
      {/* Main content with backdrop */}
      <MovieHeader movieData={movieData} />

      <div className="m-4 flex flex-col items-center gap-4">
        <MovieCredits movieData={movieData} />

        {/* scraping torrents */}
        <MovieTorrentsList movieData={movieData} />
      </div>
    </div>
  );
};

export default MovieProfile;
