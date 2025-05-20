'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Copy, CopyCheck, Magnet, Play } from 'lucide-react';

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
import useUserStore from '@/stores/user';
import { TMovieBasics } from '@/types/movies';
import { TMagnetDataPirateBay } from '@/types/torrent-magnet-data';

const MovieMagnetsList = ({ movieData }: { movieData: TMovieBasics | null }) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const preferedContentLanguage = user?.preferred_language || locale;
  const [loadingPB, setLoadingPB] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [magnetsPB, setMagnetsPB] = useState<TMagnetDataPirateBay[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

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

  useEffect(() => {
    if (movieData?.original_title && movieData?.release_date) {
      setSearchTitle(movieData?.original_title);
      setSearchYear(movieData?.release_date?.split('-')[0]);
    }
  }, [movieData]);

  useEffect(() => {
    if (searchTitle) {
      scrapePB(searchTitle, searchYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle]);

  const handleCopy = async (link: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000); // 2 секунды
    } catch (e) {
      // handle error if needed
    }
  };

  return !movieData ? null : (
    <div className="bg-card shadow-primary/20 mx-auto w-full max-w-screen-2xl rounded-md border px-4 shadow-xs">
      <h1 className="mt-6 font-bold">Magnets from Pirate Bay:</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Seeders</TableHead>
            <TableHead>Leechers</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-center">Magnet</TableHead>
            <TableHead className="text-center">Copy Magnet</TableHead>
            <TableHead className="text-center">Stream</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {magnetsPB.map((magnet, idx) => (
            <TableRow key={magnet.link}>
              <TableCell>{magnet.title}</TableCell>
              <TableCell>{magnet.seeders}</TableCell>
              <TableCell>{magnet.leechers}</TableCell>
              <TableCell>{magnet.size}</TableCell>
              <TableCell className="text-center">
                <ButtonCustom size="icon" variant="default" title="Open magnet link">
                  <Link href={magnet.link}>
                    <Magnet className="h-4 w-4" />
                  </Link>
                </ButtonCustom>
              </TableCell>
              <TableCell className="text-center">
                <ButtonCustom
                  size="icon"
                  variant="default"
                  title="Copy magnet link"
                  onClick={() => handleCopy(magnet.link, idx)}
                >
                  {copiedIdx === idx ? (
                    <CopyCheck className="text-positive smooth42transition h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
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

export default MovieMagnetsList;
