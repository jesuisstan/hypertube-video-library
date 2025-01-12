'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { CalendarArrowUp, ScanSearch, Star } from 'lucide-react';

import Loading from '@/app/loading';
import MovieThumbnail from '@/components/movie-cards/movie-thumbnail';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import CategoryToggleWrapper from '@/components/wrappers/category-toggle-wrapper';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { framerMotion, slideFromBottom } from '@/styles/motion-variants';

const Browse = () => {
  const t = useTranslations();
  const localeActive = useLocale();
  const user = useUserStore((state) => state.user);
  const [moviesTMDB, setMoviesTMDB] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [list, setList] = useState('popular');

  const [loading, setLoading] = useState(false);
  const { getValueOfSearchFilter, setValueOfSearchFilter } = useSearchStore();
  // Retrieve the current layout
  //const list = (getValueOfSearchFilter('category') || 'popular') as string;

  const tabs = [
    { id: 'top_rated', label: t(`top-rated`), Icon: Star },
    { id: 'popular', label: t(`popular`), Icon: CalendarArrowUp },
    { id: 'custom', label: t(`custom-search`), Icon: ScanSearch },
  ];

  // Handle tab changes
  const handleTabChange = (id: string) => {
    setValueOfSearchFilter('category', id);
  };

  const scrapeTMDB = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/movies?list=${list}&lang=${localeActive}&page=${page}`);
      const data = await response.json();
      setMoviesTMDB(data.results);
    } catch (error) {
      console.error('Error scraping TMDB:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (list === 'custom') return; // todo
    scrapeTMDB();
  }, [list, page]);

  console.log('moviesTMDB:', moviesTMDB); // debug

  return !user ? (
    <Loading />
  ) : (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={framerMotion}
      className="flex flex-col items-center gap-5"
    >
      <CategoryToggleWrapper tabs={tabs} category={list} setCategory={setList} />
      {/* scraping TMDB */}
      {/*<ButtonCustom
        type="button"
        variant={'default'}
        size={'default'}
        onClick={scrapeTMDB}
        loading={loading}
        disabled={loading}
      >
        Scrape TMDB
      </ButtonCustom>*/}

      <div
        key="moviesTMDB"
        className="grid grid-cols-2 items-center gap-5 align-middle smooth42transition sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
      >
        {moviesTMDB ? (
          moviesTMDB.map((movie) => (
            <motion.div
              variants={slideFromBottom}
              key={movie.id}
              className="flex justify-center self-center"
            >
              <MovieThumbnail movieBasics={movie} loading={loading} />
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-5">
            <Loading />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Browse;
