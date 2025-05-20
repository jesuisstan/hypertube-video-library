'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { ArrowRight, Download } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { fetchMoviesByTitle } from '@/lib/yts-api';
import useUserStore from '@/stores/user';
import { TMovieBasics } from '@/types/movies';
import { TTorrentDataYTS } from '@/types/torrent-magnet-data';

const MovieTorrentsList = ({ movieData }: { movieData: TMovieBasics | null }) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const preferedContentLanguage = user?.preferred_language || locale; // todo: use to set video or subtitle language
  const [loadingYTS, setLoadingYTS] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [torrentsYTS, setTorrentsYTS] = useState<TTorrentDataYTS[]>([]);

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

  // Scrape torrents from YTS when search title is set
  useEffect(() => {
    if (searchTitle) {
      scrapeYTS(searchTitle, searchYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle]);

  console.log('YTS torrents', torrentsYTS); // debug
  console.log('PREFERED CONTENT LANGUAGE', preferedContentLanguage); // debug

  return !movieData ? null : (
    <div className="bg-card shadow-primary/20 mx-auto w-full max-w-screen-2xl rounded-md border px-4 shadow-xs">
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
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ul>
    </div>
  );
};

export default MovieTorrentsList;
