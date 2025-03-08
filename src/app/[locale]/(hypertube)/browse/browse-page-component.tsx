'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import DatesRangePicker from '@/components/filter-sort/dates-range-picker';
import MovieThumbnail from '@/components/movie-cards/movie-thumbnail';
import ChipsGroup from '@/components/ui/chips/chips-group';
import SelectSingle from '@/components/ui/select-dropdown/select-single';
import { Slider } from '@/components/ui/slider';
import Spinner from '@/components/ui/spinner';
import ToastNotification from '@/components/ui/toast-notification';
import useSortOptions from '@/hooks/useSortOptions';
import useSearchStore from '@/stores/search';
import { framerMotion, slideFromBottom } from '@/styles/motion-variants';
import { TMovieBasics } from '@/types/movies';

const BrowsePageComponent = ({ category }: { category: string }) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const localeActive = useLocale();
  const sortOptions = useSortOptions() as any[];
  const [moviesTMDB, setMoviesTMDB] = useState<TMovieBasics[]>([]);
  const [page, setPage] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollPositionRef = useRef<number>(0);

  // sort filter states
  const {
    getValueOfSearchFilter,
    setValueOfSearchFilter,
    getGenresListByLanguage,
    replaceAllItemsOfSearchFilter,
  } = useSearchStore();

  const genresList = getGenresListByLanguage(locale);
  const sortBy = getValueOfSearchFilter('sort_by') as string;
  const selectedGenres = getValueOfSearchFilter('genres') as string[];
  const rating = getValueOfSearchFilter('rating') as number[];
  const startDate = getValueOfSearchFilter('start_date') as Date;
  const endDate = getValueOfSearchFilter('end_date') as Date;

  const handleStartDateChange = (date: Date) => {
    setValueOfSearchFilter('start_date', date);
  };
  const handleEndDateChange = (date: Date) => {
    setValueOfSearchFilter('end_date', date);
  };

  const handleSortChange = (value: string) => {
    setValueOfSearchFilter('sort_by', value);
  };

  const handleRatingChange = (values: number[]) => {
    const [start, end] = values;
    replaceAllItemsOfSearchFilter('rating', [start, end]);
  };

  const scrapeTMDB = async (reset = false) => {
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
        setMoviesTMDB((prevMovies) => {
          const newMovies = reset ? results : [...prevMovies, ...results];
          return Array.from(new Set(newMovies.map((movie: TMovieBasics) => movie.id))).map((id) =>
            newMovies.find((movie: TMovieBasics) => movie.id === id)
          );
        });
      }
      if (error) {
        setErrorMessage(error);
      }
    } catch (error) {
      setErrorMessage('error-fetching-movies');
    } finally {
      setLoading(false);
      setIsFetching(false);
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
    setPage(1);
    setMoviesTMDB([]);
    scrapeTMDB(true);
  }, [category, localeActive]);

  useEffect(() => {
    if (page > 2) {
      setErrorMessage(t('error-page-limit-reached'));
      return;
    }
    scrapeTMDB().finally(() => {
      window.scrollTo(0, scrollPositionRef.current);
    });
  }, [page]);

  console.log(
    'startDate > endDate ???',
    startDate > endDate,
    'startDate',
    startDate,
    'endDate',
    endDate
  );
  const rangeWarning = useMemo(() => {
    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
    if (!loading && moviesTMDB.length > 0 && formattedStartDate > formattedEndDate) {
      return t('range-warning');
    }
    return;
  }, [moviesTMDB, startDate, endDate]);

  return (
    <div>
      {rangeWarning && <ToastNotification isOpen={true} text={rangeWarning} />}
      {errorMessage && <ToastNotification isOpen={true} title={t('error')} text={errorMessage} />}
      <div className="flex flex-col items-start gap-5 smooth42transition xs:flex-row">
        {/* Sort and filter sector */}
        <div
          id="sort-filter-sector"
          className={clsx(
            'flex w-full flex-col items-start gap-4 overflow-x-auto rounded-2xl bg-card p-5 shadow-md shadow-primary/20 xs:sticky xs:top-20 xs:max-w-72 xs:overflow-x-hidden'
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
                <DatesRangePicker
                  startDate={startDate}
                  setStartDate={handleStartDateChange}
                  endDate={endDate}
                  setEndDate={handleEndDateChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold">{t('rating')}</label>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  defaultValue={[0, 10]}
                  value={rating}
                  onValueChange={handleRatingChange}
                />
                <div className="mt-2 flex justify-between text-xs text-foreground">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                    <span
                      key={item}
                      className={clsx({
                        'font-bold smooth42transition':
                          item >= Number(rating[0]) && item <= Number(rating[1]),
                      })}
                    >
                      {item}
                    </span>
                  ))}
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
              <div className="m-5 flex flex-col items-center gap-5">
                <Spinner size={21} />
                <p className="animate-pulse text-base font-normal leading-[19px]">{t(`loading`)}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePageComponent;
