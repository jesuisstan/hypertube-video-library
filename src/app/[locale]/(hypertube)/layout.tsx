'use client';

import React, { useEffect } from 'react';

import clsx from 'clsx';

import Footer from '@/components/footer';
import Menu from '@/components/menu/menu';
import useSearchStore from '@/stores/search';

const HypertubeLayout = ({ children }: { children: React.ReactNode }) => {
  const { getGenresList, setGenresList } = useSearchStore();

  const scrapeGenresList = async () => {
    try {
      const response = await fetch(`/api/genres`);
      const data = await response.json();
      setGenresList(data);
    } catch (error) {
      console.error('Error scraping TMDB:', error);
    }
  };

  useEffect(() => {
    const genresList = getGenresList();
    if (!genresList.en.length || !genresList.fr.length || !genresList.ru.length) {
      scrapeGenresList();
    }
  }, []);

  return (
    <div className={clsx('relative flex min-h-screen w-full flex-col lg:flex-row')}>
      <Menu />
      <div className="flex w-full flex-grow flex-col items-center justify-between">
        <main
          id="main-content"
          role="main"
          className={clsx('mb-auto w-full items-center p-4')}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default HypertubeLayout;
