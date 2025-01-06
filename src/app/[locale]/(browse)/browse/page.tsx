'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { piratebay } from 'piratebay-scraper';

import MovieList from '@/components/movie-list';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import BrowseSkeleton from '@/components/ui/skeletons/browse-skeleton';
import { useRouter } from '@/i18n/routing';
import useUserStore from '@/stores/user';

const Browse = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const [moviesPB, setMoviesPB] = useState<any[]>([]);

  const scrapePB = async () => {
    try {
      const response = await fetch('/api/piratebay?query=Gladiator');
      const data = await response.json();
      console.log(data);
      setMoviesPB(data);
    } catch (error) {
      console.error('Error scraping PirateBay:', error);
    }
  };

  const { data: session, status } = useSession(); // Get session data
  return !user ? (
    <BrowseSkeleton />
  ) : (
    <div className="flex flex-col items-center gap-10">
      <ButtonCustom onClick={scrapePB}>Scrape PB</ButtonCustom>
      <div>
        <h1 className="font-bold">Movies PirateBase</h1>
        <ul>
          {moviesPB.map((movie) => (
            <li key={movie.link}>{movie.title}</li>
          ))}
        </ul>
      </div>
      <MovieList />
    </div>
  );
};

export default Browse;
