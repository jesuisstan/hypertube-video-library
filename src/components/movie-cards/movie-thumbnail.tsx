'use client';

import { FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import { Link } from '@/i18n/routing';
import { formatDateThumbnail } from '@/utils/format-date';

type TMovieThumbnailProps = {
  movieBasics: any; // todo
};

const MovieThumbnail: FC<TMovieThumbnailProps> = ({ movieBasics }) => {
  const t = useTranslations();

  return (
    <Link href={`/movies/${movieBasics.id}`} passHref>
      <div
        id={'movie-thumbnail-' + movieBasics.id}
        key={movieBasics.id}
        className="relative flex w-fit max-w-80 cursor-pointer flex-col items-center gap-2 rounded-md bg-card p-2 shadow-md shadow-primary/20 smooth42transition hover:scale-105"
        title={movieBasics.overview}
      >
        <div className="relative">
          <Image
            src={`https://image.tmdb.org/t/p/w300${movieBasics.poster_path}`}
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
          className="mx-2 flex flex-row items-center justify-center text-center text-base font-bold"
        >
          {movieBasics.title}
        </p>
        <p className="mx-2 flex flex-row items-center justify-center text-center text-sm">
          {formatDateThumbnail(movieBasics.release_date)}
        </p>
      </div>
    </Link>
  );
};

export default MovieThumbnail;
