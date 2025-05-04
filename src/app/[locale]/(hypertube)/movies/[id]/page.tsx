'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import clsx from 'clsx';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';

const MovieProfile = () => {
  const t = useTranslations();
  const localeActive = useLocale();
  const { id: movieId } = useParams(); // Grab the id from the dynamic route
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState<any>({});
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [moviesPB, setMoviesPB] = useState<any[]>([]);

  const scrapeTMDB = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/movies/${movieId}/?lang=en-EN`);
      const data = await response.json();
      setMovieData(data);
    } catch (error) {
      console.error('Error scraping TMDB:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrapeTMDB();
  }, []);

  const scrapePB = async (searchText: string, searchYear: string) => {
    try {
      const response = await fetch(
        `/api/torrents/piratebay?title=${searchText}&year=${searchYear}`
      );
      const data = await response.json();
      console.log(data); // debug
      setMoviesPB(data);
    } catch (error) {
      console.error('Error scraping PirateBay:', error);
    }
  };

  useEffect(() => {
    if (movieData?.title && movieData.release_date) {
      setSearchTitle(movieData.title);
      setSearchYear(movieData.release_date?.split('-')[0]);
    }
  }, [movieData]);

  useEffect(() => {
    if (searchTitle) scrapePB(searchTitle, searchYear);
  }, [searchTitle]);

  console.log('searchTitle:', searchTitle); // debug
  console.log('TMBB movieData', movieData); // debug
  console.log('PirateBay moviesPB', moviesPB); // debug

  return (
    <div className="flex flex-col gap-5">
      <h1>Movie Profile Page</h1>
      <div>
        <Image
          src={
            movieData.poster_path
              ? `https://image.tmdb.org/t/p/w300${movieData.poster_path}`
              : '/identity/logo-thumbnail.png'
          }
          blurDataURL={'/identity/logo-thumbnail.png'}
          alt={'poster'}
          width={200}
          height={300}
          className="rounded-md"
          priority
        />
      </div>

      {/* scraping PirateBay */}
      <ButtonCustom
        onClick={() => scrapePB(searchTitle, searchYear)}
        loading={loading}
        disabled={loading}
      >
        Scrape Pirate Bay
      </ButtonCustom>
      <div>
        <h1 className="font-bold">Movies Pirate Bay</h1>
        <ul key="movies-Pirate-Bay" className="flex flex-col">
          {moviesPB?.map((movie) => (
            <li key={movie.link} className="flex flex-row items-center">
              <p className="mt-2 text-center">{movie.title}</p>
              <p className="mt-2 text-center">{` -----> ${movie.size}`}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MovieProfile;
