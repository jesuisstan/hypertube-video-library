'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import MovieComments from './(components)/movie-comments';
import MovieCredits from './(components)/movie-credits';
import MovieHeader from './(components)/movie-header';
import MovieMagnetsCombined from './(components)/movie-magnets-combined';
import MovieTorrentsList from './(components)/movie-torrents-list';

import Loading from '@/app/loading';
import VideoPlayer from '@/components/video-player';
import useSidebarCollapseOn2xl from '@/hooks/useSidebarCollapseOn2xl';
import useUserStore from '@/stores/user';
import { TMovieBasics } from '@/types/movies';
import { TTorrentDataYTS, TUnifiedMagnetData } from '@/types/torrent-magnet-data';

const MovieProfile = () => {
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const userPreferedContentLanguage = user?.preferred_language; // todo to be used for subtitles lang
  const { id: movieId } = useParams(); // Grab the id from the dynamic route
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState<TMovieBasics | null>(null);
  const [stream, setStream] = useState<TTorrentDataYTS | TUnifiedMagnetData | null>(null);
  // Collapse sidebar depending on screen size
  useSidebarCollapseOn2xl();

  // Wrapper functions to handle different stream types
  const setTorrentStream = (torrent: TTorrentDataYTS | null) => {
    setStream(torrent);
  };

  const setMagnetStream = (magnet: TUnifiedMagnetData | null) => {
    setStream(magnet);
  };

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

  return loading || !movieData ? (
    <Loading />
  ) : (
    <div className="w-full">
      {/* Main movie content with backdrop */}
      <MovieHeader movieData={movieData} />
      <div className="m-4 flex flex-col items-center gap-4">
        {/* Cast and crew */}
        <MovieCredits movieData={movieData} />
        {/* Movie comments */}
        <MovieComments movieData={movieData} />
        {/* Torrents */}
        <MovieTorrentsList movieData={movieData} setStream={setTorrentStream} />
        {/* Combined Magnets from all sources */}
        <MovieMagnetsCombined movieData={movieData} setStream={setMagnetStream} />
        {/* Player */}
        <VideoPlayer stream={stream} onClose={() => setStream(null)} movieData={movieData} />
      </div>
    </div>
  );
};

export default MovieProfile;
