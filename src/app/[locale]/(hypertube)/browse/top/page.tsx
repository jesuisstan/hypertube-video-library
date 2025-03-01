'use client';

import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import Loading from '@/app/loading';
import MovieThumbnail from '@/components/movie-cards/movie-thumbnail';
import ChipsGroup from '@/components/ui/chips/chips-group';
import SelectSingle from '@/components/ui/select-dropdown/select-single';
import Spinner from '@/components/ui/spinner';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { framerMotion, slideFromBottom } from '@/styles/motion-variants';
import { TMovieBasics } from '@/types/movies';

const BrowsePopular = () => {
  const category = 'top_rated';
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const localeActive = useLocale();
  const user = useUserStore((state) => state.user);
  const [moviesTMDB, setMoviesTMDB] = useState<TMovieBasics[]>([]);
  const [page, setPage] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const scrollPositionRef = React.useRef<number>(0);

  // sort filter states
  const getValueOfSearchFilter = useSearchStore((state) => state.getValueOfSearchFilter);
  const setValueOfSearchFilter = useSearchStore((state) => state.setValueOfSearchFilter);
  const getGenresListByLanguage = useSearchStore((state) => state.getGenresListByLanguage);
  const replaceAllItemsOfSearchFilter = useSearchStore(
    (state) => state.replaceAllItemsOfSearchFilter
  );
  const genresList = getGenresListByLanguage(locale);
  const sortBy = getValueOfSearchFilter('sort_by') as string;
  const selectedGenres = getValueOfSearchFilter('genres') as string[];
  const [year, setYear] = useState('');
  const [rating, setRating] = useState<[number, number]>([0, 10]);

  const handleSortChange = (value: string) => {
    setValueOfSearchFilter('sort_by', value);
  };
  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
    setValueOfSearchFilter('year', event.target.value);
  };
  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRating = [...rating] as [number, number];
    newRating[index] = Number(event.target.value);
    setRating(newRating);
    replaceAllItemsOfSearchFilter('rating', newRating);
  };

  const scrapeTMDB = async () => {
    try {
      setErrorMessage(null);
      setLoading(true);
      const response = await fetch(
        `/api/movies?category=${category}&lang=${localeActive}&page=${page}`
      );
      const data = await response.json();
      const results = data?.results;
      const error = data?.error;
      if (results) {
        setMoviesTMDB((prevMovies) => [...prevMovies, ...results]);
      }
      if (error) {
        setErrorMessage(error);
      }
    } catch (error) {
      setErrorMessage('error-fetching-movies');
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll, load more movies
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loading &&
      !isFetching
    ) {
      setIsFetching(true);
      scrollPositionRef.current = window.scrollY;
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Control the scroll event
  useEffect(() => {
    const debounceScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(handleScroll, 200);
    };

    window.addEventListener('scroll', debounceScroll);
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      window.removeEventListener('scroll', debounceScroll);
    };
  }, [loading, isFetching]);

  // Scrape TMDB on page load, when the category changes or when the page changes
  useEffect(() => {
    if (page > 500) {
      setErrorMessage('error-page-limit-reached');
      return;
    } // todo
    scrapeTMDB().finally(() => {
      setIsFetching(false);
      window.scrollTo(0, scrollPositionRef.current);
    });
  }, [page]);

  const sortOptions = [
    { value: 'title-asc', label: t('title-asc') },
    { value: 'title-desc', label: t('title-desc') },
    { value: 'popularity-asc', label: t('popularity-asc') },
    { value: 'popularity-desc', label: t('popularity-desc') },
    { value: 'rating-asc', label: t('rating-asc') },
    { value: 'rating-desc', label: t('rating-desc') },
    { value: 'release-asc', label: t('release-asc') },
    { value: 'release-desc', label: t('release-desc') },
  ];

  return !user ? (
    <Loading />
  ) : (
    <div className="flex flex-col items-start gap-5 smooth42transition xs:flex-row">
      {/* Sort and filter sector */}
      <div
        id="sort-filter-sector"
        className={clsx(
          'flex w-fit max-w-96 flex-col items-start gap-4 rounded-2xl bg-card p-5 shadow-md shadow-primary/20 xs:sticky xs:top-20'
        )}
      >
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="sort" className="text-2xl font-bold">
            {t('sort-by') + ':'}
          </label>
          <SelectSingle
            options={sortOptions}
            defaultValue="popularity-desc"
            selectedItem={sortBy}
            setSelectedItem={(value) => handleSortChange(value)}
          />
        </div>

        {/* Filter bar */}
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="filter" className="text-2xl font-bold">
            {t('filter-results') + ':'}
          </label>
          <div className="flex flex-col gap-4">
            <ChipsGroup
              name="genres"
              label={t('genres')}
              options={genresList.map((genre) => genre.name)}
              selectedChips={selectedGenres}
              setSelectedChips={(genres) => {
                //setSelectedTags(tags);
                replaceAllItemsOfSearchFilter('genres', genres);
              }}
            />

            <div className="flex flex-col gap-2">
              <label htmlFor="year" className="font-bold">
                {t('release')}
              </label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={handleYearChange}
                className="rounded border p-2"
                placeholder={t('enter-year')}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold">{t('rating')}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={rating[0]}
                  onChange={(e) => handleRatingChange(e, 0)}
                  className="rounded border p-2"
                  placeholder={t('min')}
                  min="0"
                  max="10"
                />
                <input
                  type="number"
                  value={rating[1]}
                  onChange={(e) => handleRatingChange(e, 1)}
                  className="rounded border p-2"
                  placeholder={t('max')}
                  min="0"
                  max="10"
                />
              </div>
            </div>
          </div>
        </div>
        {/*</div>*/}
      </div>

      {/* Movies sector */}
      <div className="w-full">
        <motion.div initial="hidden" animate="visible" variants={framerMotion}>
          <div
            key="moviesTMDB"
            className="flex flex-wrap items-center justify-center gap-5 align-middle smooth42transition"
          >
            {moviesTMDB?.map((movie, index) => (
              <motion.div
                variants={slideFromBottom}
                key={`${movie.id}-${index}`}
                className="flex justify-center self-center"
              >
                <MovieThumbnail movieBasics={movie} loading={false} />
              </motion.div>
            ))}
          </div>

          {loading && (
            <div className="flex flex-col items-center gap-5">
              <Spinner size={21} />
              <p className="animate-pulse text-base font-normal leading-[19px]">{t(`loading`)}</p>
            </div>
          )}

          {errorMessage && (
            <motion.div
              variants={slideFromBottom}
              className="flex w-fit min-w-96 flex-col items-center justify-center gap-5 rounded-2xl bg-card p-5 text-center shadow-md shadow-primary/20"
            >
              <p className="text-destructive">{t(errorMessage)}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BrowsePopular;
