'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { ArrowRight, BookCopy, Download } from 'lucide-react';

import Loading from '@/app/loading';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Link } from '@/i18n/routing';
import { fetchMoviesByTitle } from '@/lib/yts-api';
import useUserStore from '@/stores/user';
import { TMagnetDataPirateBay } from '@/types/magnet-data-piratebay';
import { TMovieBasics, TMovieCredits } from '@/types/movies';
import { TTorrentDataYTS } from '@/types/torrent-data-yts';

const MovieTorrentsList = ({ movieData }: { movieData: TMovieBasics | null }) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const [loadingYTS, setLoadingYTS] = useState(false);
  const [loadingPB, setLoadingPB] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [magnetsPB, setMagnetsPB] = useState<TMagnetDataPirateBay[]>([]);
  const [torrentsYTS, setTorrentsYTS] = useState<TTorrentDataYTS[]>([]);

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

  const scrapeYTS = async (searchText: string, searchYear: string) => {
    if (!searchText || !searchYear) return;

    // if we have imdb_id, use it for search. Otherwise, use title and year
    const searchQuery = movieData?.imdb_id ? movieData.imdb_id : `${searchText} ${searchYear}`;
    setLoadingYTS(true);
    try {
      const data = await fetchMoviesByTitle(searchQuery);
      setTorrentsYTS(data?.data?.movies?.[0].torrents || []);
    } catch (error) {
      console.error('Error scraping YTS:', error);
    } finally {
      setLoadingYTS(false);
    }
  };

  // Set search title and year for further torrents search based on movie data
  useEffect(() => {
    if (movieData?.original_title && movieData?.release_date) {
      setSearchTitle(movieData?.original_title);
      setSearchYear(movieData?.release_date?.split('-')[0]);
    }
  }, [movieData]);

  // Scrape torrents from YTS and PirateBay when search title is set
  useEffect(() => {
    if (searchTitle) {
      scrapeYTS(searchTitle, searchYear);
      scrapePB(searchTitle, searchYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle]);

  //console.log('YTS torrents', torrentsYTS); // debug
  //console.log('PirateBay magnetsPB', magnetsPB); // debug

  return !movieData ? null : (
    <div className="bg-card shadow-primary/20 relative z-10 mx-auto max-w-screen border p-5 shadow-xs">
      <ButtonCustom
        onClick={() => scrapeYTS(searchTitle, searchYear)}
        loading={loadingYTS}
        disabled={loadingYTS}
        className="w-60"
      >
        Scrape YTS base
      </ButtonCustom>

      <h1 className="mt-6 font-bold">Torrents from YTS:</h1>
      <ul className="flex flex-col gap-2">
        {torrentsYTS?.map((movie, index) => (
          <li key={index} className="flex items-center gap-2">
            <p>{movie.quality}</p>
            <ArrowRight className="h-4 w-4" />
            <p>{movie.size}</p>
            <ArrowRight className="h-4 w-4" />
            <ButtonCustom size="icon" variant="default" title="Download torrent">
              <Link href={movie.url}>
                <Download className="h-4 w-4" />
              </Link>
            </ButtonCustom>
          </li>
        ))}
      </ul>

      <ButtonCustom
        onClick={() => scrapePB(searchTitle, searchYear)}
        loading={loadingPB}
        disabled={loadingPB}
        className="mt-6 w-60"
      >
        Scrape Pirate Bay
      </ButtonCustom>

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

export default MovieTorrentsList;
