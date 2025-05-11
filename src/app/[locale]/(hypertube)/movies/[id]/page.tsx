'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import * as Avatar from '@radix-ui/react-avatar';
import clsx from 'clsx';
import { ArrowRight, BookCopy, CircleCheck, Download, Heart } from 'lucide-react';

import Loading from '@/app/loading';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import {
  popularLanguagesOptionsEN,
  popularLanguagesOptionsFR,
  popularLanguagesOptionsRU,
} from '@/constants/popular-languages';
import { Link } from '@/i18n/routing';
import { fetchMoviesByTitle } from '@/lib/yts-api';
import { TMagnetDataPirateBay } from '@/types/magnet-data-piratebay';
import { TMovieBasics } from '@/types/movies';
import { TTorrentDataYTS } from '@/types/torrent-data-yts';
import { formatDateThumbnail } from '@/utils/format-date';
import { capitalize } from '@/utils/format-string';

const MovieProfile = () => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
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
      const response = await fetch(`/api/movies/${movieId}/?lang=${locale}`); // todo fetch EN data to avoid torrent-scraping issues coused by original titles
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

  // Determine the correct language options array based on the locale
  const languageOptions =
    locale === 'en'
      ? popularLanguagesOptionsEN
      : locale === 'fr'
        ? popularLanguagesOptionsFR
        : popularLanguagesOptionsRU;

  useEffect(() => {
    if (movieData?.original_title && movieData?.release_date) {
      setSearchTitle(movieData?.original_title);
      setSearchYear(movieData?.release_date?.split('-')[0]);
    }
  }, [movieData]);

  useEffect(() => {
    if (searchTitle) {
      scrapeYTS(searchTitle, searchYear);
      scrapePB(searchTitle, searchYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle]);

  console.log('TMBB movieData', movieData); // debug
  console.log('YTS torrents', torrentsYTS); // debug
  console.log('PirateBay magnetsPB', magnetsPB); // debug

  return loading ? (
    <Loading />
  ) : (
    <div className="w-full">
      {/* Main content with backdrop */}
      <div className="relative mx-auto grid max-w-screen grid-cols-1 gap-10 px-6 py-10 md:grid-cols-[200px_1fr]">
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-md">
          <Image
            src={
              movieData?.backdrop_path
                ? `https://image.tmdb.org/t/p/w780${movieData.backdrop_path}`
                : '/identity/logo-title-only.png'
            }
            alt="backdrop"
            fill
            className="object-cover opacity-30"
          />
          <div className="from-primary/40 to-primary/90 absolute inset-0 bg-gradient-to-b" />
        </div>
        {/* Poster */}
        <div>
          <Image
            src={
              movieData?.poster_path
                ? `https://image.tmdb.org/t/p/w300${movieData.poster_path}`
                : '/identity/logo-thumbnail.png'
            }
            alt="poster"
            width={200}
            height={300}
            className="rounded-md shadow-md"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-8">
          {/* Left column: title, subtitle, overview */}
          <div className="flex flex-col gap-2 md:w-2/3">
            <div className="flex flex-row flex-wrap items-center justify-start gap-4">
              <h1 className="text-primary-foreground text-3xl font-bold">{movieData?.title}</h1>
              <div className="flex flex-row flex-wrap items-center gap-4">
                <div
                  className={clsx(
                    'bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full border font-bold shadow-md',
                    movieData?.vote_average! > 7
                      ? 'border-positive shadow-positive'
                      : movieData?.vote_average! >= 6
                        ? 'border-amber-400 shadow-amber-400'
                        : 'border-destructive shadow-destructive'
                  )}
                  title={`${t('average-rating')}: ${movieData?.vote_average}`}
                >
                  {movieData?.vote_average?.toFixed(1)}
                </div>

                <div
                  className={clsx(
                    'bg-primary text-primary-foreground border-card shadow-card flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border font-bold shadow-md'
                  )}
                >
                  <Heart className="smooth42transition hover:scale-110" />
                </div>
                <div
                  className={clsx(
                    'bg-primary text-primary-foreground border-card shadow-card flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border font-bold shadow-md'
                  )}
                >
                  <CircleCheck className="smooth42transition hover:scale-110" />
                </div>
              </div>
            </div>

            <p className="text-secondary italic">
              {movieData?.original_title !== movieData?.title && (
                <>
                  <span className="font-bold">{t('original-title')}:</span>{' '}
                  {movieData?.original_title}
                </>
              )}
            </p>
            <p className="text-secondary italic">{movieData?.tagline && movieData.tagline}</p>
            <p className="text-secondary mt-2 max-w-2xl leading-relaxed">{movieData?.overview}</p>
          </div>

          {/* Right column: metadata */}
          <div className="flex flex-col gap-2 text-[18px] md:w-1/3">
            <p className="text-secondary">
              <span className="font-bold">
                {t('release')}
                {': '}
              </span>
              <span className="italic">{formatDateThumbnail(movieData?.release_date)}</span>
            </p>

            {movieData?.original_language ? (
              <div className="text-secondary flex flex-row flex-wrap items-center gap-2">
                <span className="font-bold">
                  {t('original-language')}
                  {': '}
                </span>
                <>
                  <Avatar.Root
                    className={
                      'border-foreground bg-foreground inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 align-middle select-none'
                    }
                  >
                    <Avatar.Image
                      className="h-4 w-4 rounded-[inherit] object-cover"
                      src={`/country-flags/${movieData?.original_language?.toLowerCase()}.svg`}
                      alt="national-flag"
                    />
                  </Avatar.Root>
                  <span className="italic">
                    {
                      languageOptions.find(
                        (option) =>
                          option.value.toLowerCase() === movieData?.original_language?.toLowerCase()
                      )?.label
                    }
                  </span>
                </>
              </div>
            ) : null}

            <p className="text-muted">
              <span className="font-bold">
                {t('genre')}
                {': '}
              </span>
              <span className="italic">
                {movieData?.genres?.map((genre) => capitalize(genre.name)).join(', ')}
              </span>
            </p>

            {movieData?.budget && movieData?.budget > 0 ? (
              <p className="text-muted">
                <span className="font-bold">
                  {t('budget')}
                  {': '}
                </span>
                <span className="italic">{movieData.budget.toLocaleString()}</span>
              </p>
            ) : null}

            {movieData?.revenue && movieData?.revenue > 0 ? (
              <p className="text-muted">
                <span className="font-bold">
                  {t('revenue')}
                  {': '}
                </span>
                <span className="italic">{movieData.revenue.toLocaleString()}</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Cast and Crew */}
      <div className="relative z-10 mx-auto max-w-screen px-6 py-10">
        <h2 className="mb-4 text-2xl font-bold">Top Billed Cast</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {/* Dummy map — replace with actual cast from movieData if available */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-32 flex-shrink-0">
              <div className="aspect-[2/3] w-full rounded-md bg-gray-700" />
              <p className="mt-2 text-sm font-semibold">Actor Name</p>
              <p className="text-xs text-gray-400">Character</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preserve scraping UI below this */}
      <div className="relative z-10 mx-auto max-w-screen px-6 py-10">
        <ButtonCustom
          onClick={() => scrapeYTS(searchTitle, searchYear)}
          loading={loading}
          disabled={loading}
          className="w-60"
        >
          Scrape YTS base
        </ButtonCustom>

        <h1 className="mt-6 font-bold">Torrents from YTS:</h1>
        <ul className="flex flex-col gap-2">
          {torrentsYTS?.map((movie, index) => (
            <li key={index} className="flex items-center gap-2">
              <p>{movie.quality}</p>
              <ArrowRight className="h-4 w-4" />
              <p>{movie.size}</p>
              <ArrowRight className="h-4 w-4" />
              <ButtonCustom size="icon" variant="default" title="Download torrent">
                <Link href={movie.url}>
                  <Download className="h-4 w-4" />
                </Link>
              </ButtonCustom>
            </li>
          ))}
        </ul>

        <ButtonCustom
          onClick={() => scrapePB(searchTitle, searchYear)}
          loading={loading}
          disabled={loading}
          className="mt-6 w-60"
        >
          Scrape Pirate Bay
        </ButtonCustom>

        <h1 className="mt-6 font-bold">Magnets from Pirate Bay:</h1>
        <ul className="flex flex-col gap-2">
          {magnetsPB?.map((movie) => (
            <li key={movie.link} className="flex items-center gap-2">
              <p>{movie.title}</p>
              <ArrowRight className="h-4 w-4" />
              <p>{movie.size}</p>
              <ArrowRight className="h-4 w-4" />
              <ButtonCustom size="icon" variant="default" title="Copy magnet">
                <Link href={movie.link}>
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
