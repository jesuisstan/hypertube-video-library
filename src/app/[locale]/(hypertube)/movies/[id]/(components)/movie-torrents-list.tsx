'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Download, Play } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import {
  Table,
  TableBody,
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
  const preferedContentLanguage = user?.preferred_language || locale;
  const [loadingYTS, setLoadingYTS] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [torrentsYTS, setTorrentsYTS] = useState<TTorrentDataYTS[]>([]);

  const scrapeYTS = async (searchText: string, searchYear: string) => {
    if (!searchText || !searchYear) return;

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

  useEffect(() => {
    if (movieData?.original_title && movieData?.release_date) {
      setSearchTitle(movieData?.original_title);
      setSearchYear(movieData?.release_date?.split('-')[0]);
    }
  }, [movieData]);

  useEffect(() => {
    if (searchTitle) {
      scrapeYTS(searchTitle, searchYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle]);

  console.log('YTS torrentsYTS', torrentsYTS); // debug

  return !movieData ? null : (
    <div className="bg-card shadow-primary/20 mx-auto w-full max-w-screen-2xl rounded-md border px-4 shadow-xs">
      <h1 className="mt-6 font-bold">Torrents from YTS:</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Quality</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Seeds</TableHead>
            <TableHead>Peers</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-center">Download</TableHead>
            <TableHead className="text-center">Stream</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {torrentsYTS.map((torrent, idx) => (
            <TableRow key={idx}>
              <TableCell>{movieData.title}</TableCell>
              <TableCell>{torrent.quality}</TableCell>
              <TableCell>{torrent.type}</TableCell>
              <TableCell>{torrent.seeds}</TableCell>
              <TableCell>{torrent.peers}</TableCell>
              <TableCell>{torrent.size}</TableCell>
              <TableCell className="text-center">
                <ButtonCustom size="icon" variant="default" title="Download torrent">
                  <Link href={torrent.url}>
                    <Download className="h-4 w-4" />
                  </Link>
                </ButtonCustom>
              </TableCell>
              <TableCell className="text-center">
                <ButtonCustom size="icon" variant="default" title="Stream (coming soon)">
                  <Play className="h-4 w-4" />
                </ButtonCustom>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MovieTorrentsList;
