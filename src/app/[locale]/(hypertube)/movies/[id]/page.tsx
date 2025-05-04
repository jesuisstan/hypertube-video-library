'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { ArrowRight, BookCopy, Download } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Link } from '@/i18n/routing';
import { fetchMoviesByTitle } from '@/lib/yts-api';
import { TMagnetDataPirateBay } from '@/types/magnet-data-piratebay';
import { TMovieBasics } from '@/types/movies';
import { TTorrentDataYTS } from '@/types/torrent-data-yts';

const MovieProfile = () => {
  const t = useTranslations();
  const localeActive = useLocale();
  const { id: movieId } = useParams(); // Grab the id from the dynamic route
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState<TMovieBasics | null>(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [magnetsPB, setMagnetsPB] = useState<TMagnetDataPirateBay[]>([]);
  const [torrentsYTS, setTorrentsYTS] = useState<TTorrentDataYTS[]>([]);

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
    if (!searchText || !searchYear) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/torrents/piratebay?title=${searchText}&year=${searchYear}`
      );
      const data = await response.json();
      console.log('PB data', data); // debug
      setMagnetsPB(data);
    } catch (error) {
      console.error('Error scraping PirateBay:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrapeYTS = async (searchText: string, searchYear: string) => {
    if (!searchText || !searchYear) return;

    // if we have imdb_id, use it for search. Otherwise, use title and year
    const searchQuery = movieData?.imdb_id ? movieData.imdb_id : `${searchText} ${searchYear}`;
    setLoading(true);
    try {
      const data = await fetchMoviesByTitle(searchQuery);
      setTorrentsYTS(data?.data?.movies?.[0].torrents || []);
      console.log('YTS data', data?.data); // debug
    } catch (error) {
      console.error('Error scraping YTS:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieData?.title && movieData?.release_date) {
      setSearchTitle(movieData?.title);
      setSearchYear(movieData?.release_date?.split('-')[0]);
    }
  }, [movieData]);

  useEffect(() => {
    if (searchTitle) {
      scrapeYTS(searchTitle, searchYear);
      scrapePB(searchTitle, searchYear);
    }
  }, [searchTitle]);

  //console.log('TMBB movieData', movieData); // debug
  //console.log('searchTitle:', searchTitle); // debug
  //console.log('PirateBay magnetsPB', magnetsPB); // debug
  console.log('YTS torrents', torrentsYTS); // debug

  return (
    <div className="flex flex-col gap-5">
      <h1>Movie Profile Page</h1>
      <div>
        <Image
          src={
            movieData?.poster_path
              ? `https://image.tmdb.org/t/p/w300${movieData?.poster_path}`
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
        onClick={() => scrapeYTS(searchTitle, searchYear)}
        loading={loading}
        disabled={loading}
        className="w-60"
      >
        Scrape YTS base
      </ButtonCustom>
      <div>
        <h1 className="font-bold">Torrents from YTS:</h1>
        <p>{searchTitle}</p>
        <ul key="movies-Pirate-Bay" className="flex flex-col">
          {torrentsYTS?.map((movie, index) => (
            <li key={index} className="flex flex-row items-center gap-2 align-middle">
              <p className="mt-2 text-center">{movie.quality}</p>
              <ArrowRight className="h-4 w-4" />
              <p className="mt-2 text-center">{movie.size}</p>
              <ArrowRight className="h-4 w-4" />
              <p className="mt-2 text-center">{t('download') + ' torrent'}</p>
              <ButtonCustom size={'icon'} variant={'default'} title={t('download') + ' torrent'}>
                <Link href={`${movie.url}`}>
                  <Download className="h-4 w-4" />
                </Link>
              </ButtonCustom>
            </li>
          ))}
        </ul>
      </div>

      {/* scraping PirateBay */}
      <ButtonCustom
        onClick={() => scrapePB(searchTitle, searchYear)}
        loading={loading}
        disabled={loading}
        className="w-60"
      >
        Scrape Pirate Bay
      </ButtonCustom>
      <div>
        <h1 className="font-bold">Magnets from Pirate Bay:</h1>
        <ul key="movies-Pirate-Bay" className="flex flex-col">
          {magnetsPB?.map((movie) => (
            <li key={movie.link} className="flex flex-row items-center gap-2 align-middle">
              <p className="mt-2 text-center">{movie.title}</p>
              <ArrowRight className="h-4 w-4" />
              <p className="mt-2 text-center">{movie.size}</p>
              <ArrowRight className="h-4 w-4" />
              <p className="mt-2 text-center">{t('copy') + ' magnet'}</p>
              <ButtonCustom size={'icon'} variant={'default'} title={t('copy') + ' magnet'}>
                <Link href={`${movie.link}`}>
                  <BookCopy className="h-4 w-4" />
                </Link>
              </ButtonCustom>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MovieProfile;
