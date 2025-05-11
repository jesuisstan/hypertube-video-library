'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import Loading from '@/app/loading';
import DatesRangePicker from '@/components/dates-range-picker';
import DrawerSearchByQuery from '@/components/drawers-custom/drawer-search-by-query';
import { KeywordMultiSelect } from '@/components/keyword-multi-select';
import MovieThumbnail from '@/components/movie-cards/movie-thumbnail';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import ChipsGroup from '@/components/ui/chips/chips-group';
import RadioGroup from '@/components/ui/radio/radio-group';
import SelectSingle from '@/components/ui/select-dropdown/select-single';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import Spinner from '@/components/ui/spinner';
import ToastNotification from '@/components/ui/toast-notification';
import useSortOptions from '@/hooks/useSortOptions';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { framerMotion, slideFromBottom } from '@/styles/motion-variants';
import { TKeyword } from '@/types/general';
import { TMovieBasics } from '@/types/movies';

const BrowsePage = () => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const sortOptions = useSortOptions() as any[];
  const [moviesTMDB, setMoviesTMDB] = useState<TMovieBasics[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPagesAvailable, setTotalPagesAvailable] = useState<number>(42);

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
  const includeAdultContent = getValueOfSearchFilter('include_adult') as string;
  const selectedGenres = getValueOfSearchFilter('genres') as string[];
  const rating = getValueOfSearchFilter('rating') as number[];
  const releaseDateMin = getValueOfSearchFilter('release_date_min') as Date;
  const releaseDateMax = getValueOfSearchFilter('release_date_max') as Date;
  const selectedKeywords = getValueOfSearchFilter('keywords') as TKeyword[];
  const selectedKeywordsCodes = selectedKeywords.map((keyword) => keyword.id).join(' '); // TMDB api preferes space separated values for keywords
  const minVotes = getValueOfSearchFilter('min_votes') as number;

  const handleReleaseDateMinChange = (date: Date) => {
    setValueOfSearchFilter('release_date_min', date);
  };
  const handleReleaseDateMaxChange = (date: Date) => {
    setValueOfSearchFilter('release_date_max', date);
  };
  const handleSortChange = (value: string) => {
    setValueOfSearchFilter('sort_by', value);
  };
  const handleRatingChange = (values: number[]) => {
    const [start, end] = values;
    replaceAllItemsOfSearchFilter('rating', [start, end]);
  };
  const handleAdultContentChange = (value: string) => {
    setValueOfSearchFilter('include_adult', value);
  };
  const handleMinVotes = (value: number[]) => {
    setValueOfSearchFilter('min_votes', value[0]);
  };

  const scrapeTMDB = async (reset = false) => {
    try {
      setErrorMessage(null);
      setLoading(true);

      const queryParams = new URLSearchParams({
        total_pages_available: totalPagesAvailable.toString(),
        category: 'discover',
        sort_by: sortBy,
        include_adult: includeAdultContent,
        rating_min: rating[0].toString(),
        rating_max: rating[1].toString(),
        min_votes: minVotes >= 300 ? minVotes.toString() : '142',
        release_date_min: new Date(releaseDateMin).toISOString().split('T')[0],
        release_date_max: new Date(releaseDateMax).toISOString().split('T')[0],
        with_genres: selectedGenres.join(','),
        with_keywords: selectedKeywordsCodes,
        lang: locale,
        page: page <= totalPagesAvailable ? page.toString() : '1',
      });

      const response = await fetch(`/api/movies?${queryParams.toString()}`);

      const data = await response.json();
      const results = data?.results;
      const error = data?.error;
      const totalPages = data?.total_pages || 1;
      setTotalPagesAvailable(totalPages); // Set the total pages available for pagination for the current request parameters

      if (results) {
        const newMovies = reset ? results : [...moviesTMDB, ...results];
        const uniqueMovies = Array.from(
          new Set(newMovies.map((movie: TMovieBasics) => movie.id))
        ).map((id) => newMovies.find((movie: TMovieBasics) => movie.id === id));
        setMoviesTMDB(uniqueMovies);
      }
      if (error) {
        setErrorMessage(t(error));
      }
    } catch (error) {
      setErrorMessage(t('error-fetching-movies'));
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

  const fetchMoreMovies = () => {
    if (
      page >= totalPagesAvailable &&
      page !== 1 &&
      !loading &&
      !isFetching &&
      totalPagesAvailable > 5
    ) {
      setErrorMessage(t('error-page-limit-reached'));
      return;
    }
    //setPage((prevPage) => prevPage + 1); // original logic (todo: uncomment after 42 evaluation, delete all below)
    setValueOfSearchFilter('sort_by', 'title.asc');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isFetching]);

  // Scrape TMDB on page load, when the category changes or when the page changes
  useEffect(() => {
    setPage(1);
    setMoviesTMDB([]);
    scrapeTMDB(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Scrape TMDB when the page changes (user scrolls down)
  useEffect(() => {
    if (
      page > totalPagesAvailable &&
      page !== 1 &&
      !loading &&
      !isFetching &&
      totalPagesAvailable > 5
    ) {
      setErrorMessage(t('error-page-limit-reached'));
      return;
    }
    // no reset of results on page change
    scrapeTMDB().finally(() => {
      window.scrollTo(0, scrollPositionRef.current);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Scrape TMDB when the sort or filter changes
  useEffect(() => {
    setMoviesTMDB([]);
    // reset the page to 1
    setPage(1);
    // reset the scroll position
    scrollPositionRef.current = 0;
    // reset the loading state
    setLoading(false);
    // reset the error message
    setErrorMessage(null);
    // scrape TMDB with the new filters
    if (
      releaseDateMin &&
      releaseDateMax &&
      new Date(releaseDateMin).getTime() <= new Date(releaseDateMax).getTime()
    ) {
      scrapeTMDB(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sortBy,
    selectedGenres,
    rating,
    releaseDateMin,
    releaseDateMax,
    includeAdultContent,
    selectedKeywordsCodes,
    minVotes,
  ]);

  const rangeWarning = useMemo(() => {
    const formattedStartDate = new Date(releaseDateMin).toISOString().split('T')[0];
    const formattedEndDate = new Date(releaseDateMax).toISOString().split('T')[0];
    if (!loading && moviesTMDB.length > 0 && formattedStartDate > formattedEndDate) {
      return t('range-warning');
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moviesTMDB, releaseDateMin, releaseDateMax]);

  return !user ? (
    <Loading />
  ) : (
    <>
      {rangeWarning && <ToastNotification title={t('warning')} isOpen={true} text={rangeWarning} />}
      {errorMessage && (
        <ToastNotification isOpen={true} title={t('attention')} text={errorMessage} />
      )}
      <div className="smooth42transition xs:flex-row flex flex-col items-start gap-5">
        {/* Search by query */}
        <DrawerSearchByQuery />
        {/* Sort and filter sector */}
        <div
          id="sort-filter-sector"
          className={clsx(
            'bg-card shadow-primary/20 xs:sticky xs:max-w-80 xs:overflow-x-hidden top-0 flex max-h-screen w-full flex-col items-start gap-4 overflow-x-auto overflow-y-auto rounded-md p-5 shadow-md'
          )}
        >
          <div className="flex w-full flex-col justify-center gap-2">
            <label htmlFor="browse" className="text-2xl font-bold">
              {t('browsing-the-library')}
            </label>
            <Separator />

            <label htmlFor="sort" className="font-bold">
              {t('sort-by') + ':'}
            </label>
            <SelectSingle
              options={sortOptions}
              defaultValue="popularity-desc"
              selectedItem={sortBy}
              setSelectedItem={(value) => handleSortChange(value)}
            />
          </div>

          <Separator />

          <KeywordMultiSelect />

          <Separator />

          {/* Filter bar */}
          <div className="flex flex-col justify-center gap-2">
            {/*<label htmlFor="filter" className="text-xl font-bold">
              {t('filter-results') + ':'}
            </label>*/}
            <div className="flex flex-col gap-4">
              <ChipsGroup
                name="genres"
                label={t('genres')}
                options={genresList}
                selectedChips={selectedGenres}
                setSelectedChips={(genres) => {
                  replaceAllItemsOfSearchFilter('genres', genres);
                }}
              />

              {/*<Separator />*/}

              <div className="flex flex-col gap-2">
                <label htmlFor="year" className="font-bold">
                  {t('release')}
                </label>
                <DatesRangePicker
                  startDate={releaseDateMin}
                  setStartDate={handleReleaseDateMinChange}
                  endDate={releaseDateMax}
                  setEndDate={handleReleaseDateMaxChange}
                />
              </div>

              {/*<Separator />*/}

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
                <div className="text-foreground mt-2 flex justify-between text-xs">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                    <span
                      key={item}
                      className={clsx(
                        {
                          'smooth42transition font-bold':
                            item >= Number(rating[0]) && item <= Number(rating[1]),
                        },
                        'cursor-pointer'
                      )}
                      onClick={() => {
                        if (item < rating[0]) {
                          // If the clicked item is less than the current min, update the min
                          handleRatingChange([item, rating[1]]);
                        } else if (item > rating[1]) {
                          // If the clicked item is greater than the current max, update the max
                          handleRatingChange([rating[0], item]);
                        } else {
                          // If the clicked item is within the range, adjust the closest boundary
                          const distanceToMin = Math.abs(item - rating[0]);
                          const distanceToMax = Math.abs(item - rating[1]);
                          if (distanceToMin < distanceToMax) {
                            handleRatingChange([item, rating[1]]);
                          } else {
                            handleRatingChange([rating[0], item]);
                          }
                        }
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* min-votes slider */}
              <div className="flex flex-col gap-2">
                <label className="font-bold">{t('min-votes')}</label>
                <Slider
                  min={0}
                  max={1500}
                  step={300}
                  value={[minVotes]} // Ensure it's an array with a single value
                  onValueChange={(value) => handleMinVotes(value)} // Handle slider value change
                />
                <div className="text-foreground mt-2 flex items-end justify-between text-xs">
                  {[0, 300, 600, 900, 1200, 1500].map((item) => (
                    <span
                      key={item}
                      className={clsx(
                        {
                          'smooth42transition font-bold':
                            item === getValueOfSearchFilter('min_votes'),
                        },
                        'cursor-pointer'
                      )}
                      onClick={() => {
                        handleMinVotes([item]); // Set the min votes to the clicked value
                      }}
                    >
                      {item >= 300 ? item : t('any')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold">{t('include-adult-content')}</label>
                <RadioGroup
                  options={[
                    { value: 'true', label: t('yes') },
                    { value: 'false', label: t('no') },
                  ]}
                  selectedItem={getValueOfSearchFilter('include_adult') as string}
                  onSelectItem={(args_0) => handleAdultContentChange(args_0)}
                  defaultValue="false"
                />
              </div>

              <Separator />

              {/* Results display */}
              <p className="text-xs font-semibold">
                {t('total-results') + ': ' + moviesTMDB.length}
              </p>

              {/* Fetch button */}
              <ButtonCustom onClick={fetchMoreMovies} variant="default">
                {/* replace with {t('fetch-more')} after 42 evaluation */}
                {t('browse')}
              </ButtonCustom>
            </div>
          </div>
        </div>

        {/* Movies sector */}
        <div className="w-full">
          <motion.div initial="hidden" animate="visible" variants={framerMotion}>
            <div
              key="moviesTMDB"
              className="smooth42transition flex flex-wrap items-center justify-center gap-5 align-middle"
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
                <p className="animate-pulse text-base leading-[19px] font-normal">{t(`loading`)}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BrowsePage;
