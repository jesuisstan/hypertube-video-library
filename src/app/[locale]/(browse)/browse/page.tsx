'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';

import clsx from 'clsx';

import MovieThumbnail from '@/components/movie-cards/movie-thumbnail';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import BrowseSkeleton from '@/components/ui/skeletons/browse-skeleton';
import CategoryToggleWrapper from '@/components/wrappers/category-toggle-wrapper';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';

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
    { id: 'top_rated', label: t(`top-rated`) },
    { id: 'popular', label: t(`popular`) },
    { id: 'custom', label: t(`custom-search`) },
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
    if (list === 'custom') return;
    scrapeTMDB();
  }, [list, page]);

  console.log('moviesTMDB:', moviesTMDB); // debug
  //console.log('moviesPB:', moviesPB); // debug

  return !user ? (
    <BrowseSkeleton />
  ) : (
    <div className="flex flex-col items-center gap-5">
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
        className="grid grid-cols-1 items-center gap-5 align-middle smooth42transition sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {moviesTMDB?.map((movie) => (
          <div key={movie.id} className="flex justify-center self-center">
            <MovieThumbnail movieBasics={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Browse;
