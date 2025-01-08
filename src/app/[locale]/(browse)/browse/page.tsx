'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import MovieList from '@/components/movie-list';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import BrowseSkeleton from '@/components/ui/skeletons/browse-skeleton';
import { useRouter } from '@/i18n/routing';
import useUserStore from '@/stores/user';

const Browse = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const [moviesTMDB, setMoviesTMDB] = useState<any[]>([]);
  const [moviesPB, setMoviesPB] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');

  const scrapePB = async (searchText: string) => {
    try {
      const response = await fetch(`/api/torrents/piratebay?query=${searchText}`);
      //const response = await fetch('/api/torrents/piratebay');

      const data = await response.json();
      console.log(data);
      setMoviesPB(data);
    } catch (error) {
      console.error('Error scraping PirateBay:', error);
    }
  };

  const scrapeTMDB = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/movies');
      const data = await response.json();
      setMoviesTMDB(data.results);
    } catch (error) {
      console.error('Error scraping TMDB:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrapeTMDB();
  }, []);

  useEffect(() => {
    if (searchTitle) scrapePB(searchTitle);
  }, [searchTitle]);

  //console.log('moviesTMDB:', moviesTMDB); // debug
  //console.log('moviesPB:', moviesPB); // debug

  return !user ? (
    <BrowseSkeleton />
  ) : (
    <div className="flex flex-col items-center gap-10">
      {/* scraping PirateBay */}
      <ButtonCustom onClick={() => scrapePB(searchTitle)}>Scrape Pirate Bay</ButtonCustom>
      <div>
        <h1 className="font-bold">Movies Pirate Bay</h1>
        <ul key="movies-Pirate-Bay" className="flex flex-col">
          {moviesPB?.map((movie) => (
            <li key={movie.link} className="flex flex-col items-center">
              <p className="mt-2 text-center">{movie.title}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* scraping TMDB */}
      <ButtonCustom
        type="button"
        variant={'default'}
        size={'default'}
        onClick={scrapeTMDB}
        loading={loading}
        disabled={loading}
      >
        Scrape TMDB
      </ButtonCustom>
      <div>
        <h1 className="font-bold">Movies TMDB</h1>
        <ul key="moviesTMDB" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {moviesTMDB.map((movie) => (
            <li
              key={movie.id}
              className="flex cursor-pointer flex-col items-center"
              onClick={() => setSearchTitle(movie.title + ' ' + movie.release_date.split('-')[0])}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-md"
                priority
              />
              <p className="mt-2 text-center">{movie.title}</p>
              <p className="mt-2 text-center">{movie.release_date}</p>
              <p className="mt-2 text-center">{movie.vote_average}</p>
              <p className="mt-2 text-center">{movie.overview}</p>
            </li>
          ))}
        </ul>
      </div>
      {/*<MovieList />*/}
    </div>
  );
};

export default Browse;
