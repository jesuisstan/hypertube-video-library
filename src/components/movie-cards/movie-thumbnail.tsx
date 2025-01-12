'use client';

import { FC } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import clsx from 'clsx';

import { SkeletonThumbnail } from '@/components/ui/skeletons/skeleton-thumbnail';
import { Link } from '@/i18n/routing';
import useSearchStore from '@/stores/search';
import { TMovieBasics } from '@/types/movies';
import { getGenresNames } from '@/utils/format-array';

type TMovieThumbnailProps = {
  movieBasics: TMovieBasics;
  loading?: boolean;
};

const MovieThumbnail: FC<TMovieThumbnailProps> = ({ movieBasics, loading }) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const { getGenresListByLanguage } = useSearchStore();
  const genresList = getGenresListByLanguage(locale);

  return loading ? (
    <SkeletonThumbnail />
  ) : (
    <Link href={`/movies/${movieBasics.id}`} passHref>
      <div
        id={'movie-thumbnail-' + movieBasics.id}
        key={movieBasics.id}
        className="relative flex max-w-72 cursor-pointer flex-col items-center gap-2 rounded-md bg-card p-2 shadow-md shadow-primary/20 smooth42transition hover:scale-105"
        title={movieBasics.overview}
      >
        <div className="relative">
          <Image
            src={`https://image.tmdb.org/t/p/w300${movieBasics.poster_path}`}
            blurDataURL={'/identity/logo-thumbnail.png'}
            alt={'poster'}
            width={200}
            height={300}
            className="rounded-md"
            priority
          />
          <div
            className={clsx(
              'absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border bg-primary font-bold text-primary-foreground shadow-md',
              movieBasics.vote_average > 7
                ? 'border-c42green shadow-c42green'
                : movieBasics.vote_average >= 6
                  ? 'border-amber-400 shadow-amber-400'
                  : 'border-destructive shadow-destructive'
            )}
            title={`${t('average-rating')}: ${movieBasics.vote_average}`}
          >
            {movieBasics.vote_average?.toFixed(1)}
          </div>
        </div>
        <p
          title={movieBasics.title}
          className="flex flex-row items-center justify-center text-center text-base font-bold"
        >
          {movieBasics.title}
        </p>
        <p className="flex flex-row items-center justify-center text-center text-sm">
          {`${t('release')}: ${movieBasics.release_date.split('-')[0] || '----'}`}
        </p>
        <p className="flex flex-row items-center justify-center text-center text-xs">
          {movieBasics.genre_ids ?? getGenresNames(movieBasics.genre_ids, genresList)}
        </p>
      </div>
    </Link>
  );
};

export default MovieThumbnail;
