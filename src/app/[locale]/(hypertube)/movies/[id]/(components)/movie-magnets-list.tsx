'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { ArrowRight, BookCopy } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Link } from '@/i18n/routing';
import useUserStore from '@/stores/user';
import { TMovieBasics } from '@/types/movies';
import { TMagnetDataPirateBay } from '@/types/torrent-magnet-data';

const MovieMagnetsList = ({ movieData }: { movieData: TMovieBasics | null }) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const preferedContentLanguage = user?.preferred_language || locale; // todo: use to set video or subtitle language
  const [loadingPB, setLoadingPB] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [magnetsPB, setMagnetsPB] = useState<TMagnetDataPirateBay[]>([]);

  const scrapePB = async (searchText: string, searchYear: string) => {
    if (!searchText || !searchYear) return;

    setLoadingPB(true);
    try {
      const response = await fetch(
        `/api/torrents/piratebay?title=${searchText}&year=${searchYear}`
      );
      const data = await response.json();
      setMagnetsPB(data);
    } catch (error) {
      console.error('Error scraping PirateBay:', error);
    } finally {
      setLoadingPB(false);
    }
  };

  // Set search title and year for further torrents search based on movie data
  useEffect(() => {
    if (movieData?.original_title && movieData?.release_date) {
      setSearchTitle(movieData?.original_title);
      setSearchYear(movieData?.release_date?.split('-')[0]);
    }
  }, [movieData]);

  // Scrape PirateBay when search title is set
  useEffect(() => {
    if (searchTitle) {
      scrapePB(searchTitle, searchYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle]);

  console.log('PirateBay magnetsPB', magnetsPB); // debug

  return !movieData ? null : (
    <div className="bg-card shadow-primary/20 mx-auto w-full max-w-screen-2xl rounded-md border px-4 shadow-xs">
      <h1 className="mt-6 font-bold">Magnets from Pirate Bay:</h1>
      <ul className="flex flex-col gap-2">
        {magnetsPB?.map((movie) => (
          <li key={movie.link} className="flex items-center gap-2">
            <p>{movie.title}</p>
            <ArrowRight className="h-4 w-4" />
            <p>{movie.size}</p>
            <ArrowRight className="h-4 w-4" />
            <ButtonCustom size="icon" variant="default" title="Copy magnet">
              <Link href={movie.link}>
                <BookCopy className="h-4 w-4" />
              </Link>
            </ButtonCustom>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieMagnetsList;
