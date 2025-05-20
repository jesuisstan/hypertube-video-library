'use client';

import { ReactNode, useEffect } from 'react';

import clsx from 'clsx';

import Footer from '@/components/footer';
import { AppSidebar } from '@/components/menu/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import useSearchStore from '@/stores/search';

const HypertubeLayout = ({ children }: { children: ReactNode }) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-grow flex-col items-center justify-between">
        <main id="main-content" role="main" className={clsx('w-full items-center')}>
          <SidebarTrigger />
          {children}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default HypertubeLayout;
