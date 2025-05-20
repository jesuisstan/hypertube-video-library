'use client';

import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import * as Avatar from '@radix-ui/react-avatar';
import clsx from 'clsx';
import { BookmarkIcon, Eye } from 'lucide-react';

import TooltipBasic from '@/components/tooltips-custom/tooltip-basic';
import { Separator } from '@/components/ui/separator';
import Spinner from '@/components/ui/spinner';
import { allLanguagesOptions, TLanguageOption } from '@/constants/all-languages-ISO-639-1';
import useUserStore from '@/stores/user';
import { TMovieBasics } from '@/types/movies';
import { formatDateThumbnail } from '@/utils/format-date';
import { capitalize } from '@/utils/format-string';

const MovieHeader = ({ movieData }: { movieData: TMovieBasics | null }) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [loadingWatched, setLoadingWatched] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const handleBookmarkClick = async () => {
    try {
      setLoadingBookmarks(true);
      const queryParams = new URLSearchParams({
        user_id: user?.id || '',
        poster_path: movieData?.poster_path || '',
        release_date: movieData?.release_date || '',
        title: movieData?.original_title || movieData?.title || '',
        vote_average: String(movieData?.vote_average) || '',
      });
      const response = await fetch(
        `/api/movies/${movieData?.id}/bookmarks?${queryParams.toString()}`,
        {
          method: isBookmarked ? 'DELETE' : 'PUT',
          body: JSON.stringify({ isBookmarked: !isBookmarked }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status !== 200) {
        console.error('Error updating bookmark:', response.statusText);
        return;
      }
      setIsBookmarked((prev) => !prev); // Toggle the watched status if the request was successful
    } catch (error) {
      console.error('Error updating bookmark:', error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const handleWatchlistClick = async () => {
    try {
      setLoadingWatched(true);
      const queryParams = new URLSearchParams({
        user_id: user?.id || '',
        poster_path: movieData?.poster_path || '',
        release_date: movieData?.release_date || '',
        title: movieData?.original_title || movieData?.title || '',
        vote_average: String(movieData?.vote_average) || '',
      });
      const response = await fetch(
        `/api/movies/${movieData?.id}/watched?${queryParams.toString()}`,
        {
          method: isInWatchlist ? 'DELETE' : 'PUT',
          body: JSON.stringify({ isInWatchlist: !isInWatchlist }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status !== 200) {
        console.error('Error updating watched:', response.statusText);
        return;
      }
      setIsInWatchlist((prev) => !prev); // Toggle the watched status if the request was successful
    } catch (error) {
      console.error('Error updating watched:', error);
    } finally {
      setLoadingWatched(false);
    }
  };

  const checkBookmark = async () => {
    if (!user?.id || !movieData?.id) return;
    try {
      setLoadingBookmarks(true);
      const res = await fetch(`/api/movies/${movieData?.id}/bookmarks?user_id=${user.id}`);
      const data = await res.json();
      setIsBookmarked(Boolean(data.isBookmarked));
    } catch (error) {
      console.error('Error checking bookmark:', error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const checkWatchlist = async () => {
    if (!user?.id || !movieData?.id) return;
    try {
      setLoadingWatched(true);
      const res = await fetch(`/api/movies/${movieData?.id}/watched?user_id=${user.id}`);
      const data = await res.json();
      setIsInWatchlist(Boolean(data.isInWatchlist));
    } catch (error) {
      console.error('Error checking watched:', error);
    } finally {
      setLoadingWatched(false);
    }
  };

  // Check if the movie is bookmarked or in watched when user changes
  useEffect(() => {
    checkBookmark();
    checkWatchlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <div className="relative mx-auto grid min-h-fit max-w-screen-2xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-[300px_1fr]">
      <div className="shadow-primary/40 absolute inset-0 -z-10 overflow-hidden shadow-md">
        <Image
          src={
            movieData?.backdrop_path
              ? `https://image.tmdb.org/t/p/w780${movieData.backdrop_path}`
              : '/icons/logo-title-only.png'
          }
          alt="backdrop"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="from-primary/40 to-primary/90 absolute inset-0 bg-gradient-to-b" />
      </div>
      {/* Poster */}
      <div className="flex items-center justify-center overflow-hidden rounded-md align-middle">
        <Image
          src={
            movieData?.poster_path
              ? `https://image.tmdb.org/t/p/w300${movieData.poster_path}`
              : '/identity/logo-thumbnail.png'
          }
          alt="poster"
          width={0}
          height={0}
          sizes="100vw"
          className="h-[450px] w-[300px] rounded-md object-cover shadow-md"
          priority
          placeholder="blur"
          blurDataURL="/identity/logo-thumbnail.png"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-8">
        {/* Left column: title, subtitle, overview */}
        <div className="flex flex-col justify-center gap-4 md:w-2/3">
          {/* Title */}
          <h1 className="text-primary-foreground text-3xl font-bold">
            {movieData?.title}{' '}
            <span className="text-secondary font-normal">
              {movieData?.release_date && `(${new Date(movieData.release_date).getFullYear()})`}
            </span>
          </h1>
          <div className="flex flex-row items-center gap-4">
            {/* Rating */}
            <TooltipBasic
              trigger={
                <div
                  className={clsx(
                    'bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full border font-bold shadow-md',
                    movieData?.vote_average! > 7
                      ? 'border-positive shadow-positive'
                      : movieData?.vote_average! >= 6
                        ? 'border-amber-400 shadow-amber-400'
                        : 'border-destructive shadow-destructive'
                  )}
                >
                  {movieData?.vote_average?.toFixed(1)}
                </div>
              }
            >
              {`${t('average-rating')}: ${movieData?.vote_average}`}
            </TooltipBasic>

            <Separator orientation="vertical" />

            {/* Bookmarks button */}
            <TooltipBasic
              trigger={
                <button
                  className={clsx(
                    'bg-primary group relative z-40 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-2 rounded-full border align-middle font-bold shadow-md',
                    isBookmarked
                      ? 'border-amber-400 text-amber-400 shadow-amber-400'
                      : 'text-card border-card shadow-card',
                    loadingBookmarks && 'animate-pulse'
                  )}
                  onClick={handleBookmarkClick}
                  disabled={loadingBookmarks}
                >
                  {loadingBookmarks ? (
                    <Spinner color="amber-400" />
                  ) : (
                    <BookmarkIcon className="smooth42transition h-5 w-5" />
                  )}
                </button>
              }
            >
              {isBookmarked ? t('remove-from-bookmarks') : t('add-to-bookmarks')}
            </TooltipBasic>

            {/* Watched list button */}
            <TooltipBasic
              trigger={
                <button
                  className={clsx(
                    'bg-primary group relative z-40 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-2 rounded-full border align-middle font-bold shadow-md',
                    isInWatchlist
                      ? 'border-amber-400 text-amber-400 shadow-amber-400'
                      : 'text-card border-card shadow-card',
                    loadingWatched && 'animate-pulse'
                  )}
                  onClick={handleWatchlistClick}
                  disabled={loadingWatched}
                >
                  {loadingWatched ? (
                    <Spinner color="amber-400" />
                  ) : (
                    <Eye className="smooth42transition h-5 w-5" />
                  )}
                </button>
              }
            >
              {isInWatchlist ? t('set-unwatched') : t('set-watched')}
            </TooltipBasic>
          </div>
          {/* Original title */}
          <p className="text-secondary text-lg">
            {movieData?.original_title && (
              <span className="flex flex-row flex-wrap items-center gap-2">
                <span className="font-bold">{t('original-title')}:</span>
                <span className="italic">{movieData?.original_title}</span>
              </span>
            )}
          </p>
          {/* Tagline */}
          <p className="text-c42orange text-lg italic">{movieData?.tagline && movieData.tagline}</p>
          {/* Overview */}
          <p className="text-secondary mt-2 max-w-5xl text-lg leading-relaxed">
            {movieData?.overview}
          </p>
        </div>

        {/* Right column: metadata */}
        <div className="flex flex-col justify-center gap-2 md:w-1/3">
          <p className="text-secondary">
            <span className="flex flex-row flex-wrap items-center gap-2">
              <span className="font-bold">{t('release')}:</span>
              <span className="italic">{formatDateThumbnail(movieData?.release_date)}</span>
            </span>
          </p>

          {movieData?.production_countries && movieData?.production_countries?.length > 0 ? (
            <div className="text-secondary flex flex-row flex-wrap items-center gap-2">
              <span className="font-bold">{t('production-countries')}:</span>
              <div className="flex flex-wrap items-center gap-1">
                {movieData.production_countries.map((country, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-row items-center gap-1">
                      <Avatar.Root
                        className={
                          'border-foreground bg-foreground inline-flex items-center justify-center overflow-hidden rounded-full border-2 align-middle select-none'
                        }
                      >
                        <Avatar.Image
                          className="h-4 w-4 rounded-[inherit] object-cover"
                          src={`/country-flags/${country.iso_3166_1.toLowerCase()}.svg`}
                          alt={`${country.name}-flag`}
                        />
                      </Avatar.Root>
                      <span className="italic">{country.name}</span>
                    </div>
                    {movieData?.production_countries?.length &&
                      index < movieData.production_countries.length - 1 && (
                        <span className="text-secondary italic">|</span>
                      )}
                  </Fragment>
                ))}
              </div>
            </div>
          ) : null}

          {movieData?.original_language ? (
            <div className="text-secondary flex flex-row flex-wrap items-center gap-2">
              <span className="font-bold">{t('original-language')}:</span>
              <span className="italic">
                {allLanguagesOptions.find(
                  (lang: TLanguageOption) => lang.value === movieData.original_language
                )?.[`label${locale.toUpperCase()}` as keyof TLanguageOption] ||
                  movieData.original_language}
              </span>
            </div>
          ) : null}

          <p className="text-muted">
            <span className="flex flex-row flex-wrap items-center gap-2">
              <span className="font-bold">{t('genres')}:</span>
              <span className="italic">
                {movieData?.genres?.map((genre) => capitalize(genre.name)).join(' | ')}
              </span>
            </span>
          </p>

          {movieData?.budget && movieData?.budget > 0 ? (
            <p className="text-muted">
              <span className="flex flex-row flex-wrap items-center gap-2">
                <span className="font-bold">{t('budget')}:</span>
                <span className="italic">{movieData.budget.toLocaleString()}</span>
              </span>
            </p>
          ) : null}

          {movieData?.revenue && movieData?.revenue > 0 ? (
            <p className="text-muted">
              <span className="flex flex-row flex-wrap items-center gap-2">
                <span className="font-bold">{t('revenue')}:</span>
                <span className="italic">{movieData.revenue.toLocaleString()}</span>
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MovieHeader;
