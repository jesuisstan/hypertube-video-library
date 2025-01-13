'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { CalendarArrowUp, ScanSearch, Star } from 'lucide-react';

import Loading from '@/app/loading';
import FilterSortBar from '@/components/filter-sort-bar';
import MovieThumbnail from '@/components/movie-cards/movie-thumbnail';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import Spinner from '@/components/ui/spinner';
import CategoryToggleWrapper from '@/components/wrappers/category-toggle-wrapper';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { framerMotion, slideFromBottom } from '@/styles/motion-variants';
import { TMovieBasics } from '@/types/movies';

const Browse = () => {
  const t = useTranslations();
  const localeActive = useLocale();
  const user = useUserStore((state) => state.user);
  const [moviesTMDB, setMoviesTMDB] = useState<{ [key: string]: TMovieBasics[] }>({});
  const [pages, setPages] = useState<{ [key: string]: number }>({
    top_rated: 1,
    popular: 1,
    custom: 1,
  });
  const [category, setCategory] = useState('popular');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { getValueOfSearchFilter, setValueOfSearchFilter } = useSearchStore();
  const [isFetching, setIsFetching] = useState(false);

  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const scrollPositionRef = React.useRef<number>(0);

  const tabs = [
    { id: 'top_rated', label: t(`top-rated`), Icon: Star },
    { id: 'popular', label: t(`popular`), Icon: CalendarArrowUp },
    { id: 'custom', label: t(`custom-search`), Icon: ScanSearch },
  ];

  const [headerHeight, setHeaderHeight] = useState(221);
  const headerRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);
  console.log('headerHeight:', headerHeight); // debug
  // Handle tab changes
  const handleTabChange = (id: string) => {
    setValueOfSearchFilter('category', id);
  };

  const scrapeTMDB = async () => {
    try {
      if (category === 'custom') {
        return;
      } else {
        setErrorMessage(null);
        setLoading(true);
        const response = await fetch(
          `/api/movies?category=${category}&lang=${localeActive}&page=${pages[category]}`
        );
        const data = await response.json();
        const results = data?.results;
        const error = data?.error;
        if (results) {
          setMoviesTMDB((prevMovies) => ({
            ...prevMovies,
            [category]: [...(prevMovies[category] || []), ...results],
          }));
        }
        if (error) {
          setErrorMessage(error);
        }
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
      setPages((prevPages) => ({
        ...prevPages,
        [category]: prevPages[category] + 1,
      }));
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
    if (category === 'custom') return; // todo
    if (pages[category] > 500) {
      setErrorMessage('error-page-limit-reached');
      return;
    } // todo
    scrapeTMDB().finally(() => {
      setIsFetching(false);
      window.scrollTo(0, scrollPositionRef.current);
    });
  }, [category, pages[category]]);

  useEffect(() => {
    if (pages[category] === 1) return;
    setPages((prevPages) => ({
      ...prevPages,
      [category]: 1,
    }));
  }, [category]);

  //console.log('moviesTMDB:', moviesTMDB); // debug
  console.log('pages:', pages); // debug
  return !user ? (
    <Loading />
  ) : (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={framerMotion}
      className="flex flex-col items-center gap-5"
    >
      <div
        ref={headerRef}
        className="fixed z-10 flex w-full flex-col items-center gap-2 bg-background/70 p-2"
      >
        <CategoryToggleWrapper tabs={tabs} category={category} setCategory={setCategory} />
        <FilterSortBar />
      </div>
      <div className="flex w-full flex-col items-center gap-5" style={{ marginTop: headerHeight }}>
        <div
          key="moviesTMDB"
          className="grid grid-cols-2 items-center gap-5 align-middle smooth42transition sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
        >
          {moviesTMDB[category]?.map((movie, index) => (
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
      </div>
    </motion.div>
  );
};

export default Browse;
