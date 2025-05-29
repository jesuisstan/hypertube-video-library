'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  CircleDashed,
  Copy,
  CopyCheck,
  Magnet,
  Play,
  RefreshCw,
} from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import Spinner from '@/components/ui/spinner';
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

interface MovieTorrentsList {
  movieData: TMovieBasics | null;
  setStream: (stream: TMagnetDataPirateBay | null) => void;
}

const MovieMagnetsList = ({ movieData, setStream }: MovieTorrentsList) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const preferedContentLanguage = user?.preferred_language || locale;
  const [loadingPB, setLoadingPB] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [magnetsPB, setMagnetsPB] = useState<TMagnetDataPirateBay[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null
  );

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

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedMagnets = useMemo(() => {
    if (!sortConfig || !Array.isArray(magnetsPB) || magnetsPB.length === 0) return magnetsPB;
    const key = sortConfig.key as keyof TMagnetDataPirateBay;
    if (!magnetsPB.every((item) => Object.prototype.hasOwnProperty.call(item, key))) {
      return magnetsPB;
    }
    const sorted = [...magnetsPB];
    sorted.sort((a, b) => {
      let aValue: any = a[key];
      let bValue: any = b[key];
      if (key === 'size') {
        // Try to parse size to bytes for sorting, fallback to string
        const parseSize = (size: string) => {
          if (!size) return 0;
          const match = size.match(/([\d.]+)\s*(GB|GiB|MB|MiB|KB|KiB)/i);
          if (!match) return parseFloat(size) || 0;
          const num = parseFloat(match[1]);
          const unit = match[2].toUpperCase();
          switch (unit) {
            case 'GB':
            case 'GIB':
              return num * 1024 * 1024 * 1024;
            case 'MB':
            case 'MIB':
              return num * 1024 * 1024;
            case 'KB':
            case 'KIB':
              return num * 1024;
            default:
              return num;
          }
        };
        aValue = parseSize(a.size);
        bValue = parseSize(b.size);
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
    return sorted;
  }, [magnetsPB, sortConfig]);

  console.log('Sorted Magnets:', sortedMagnets); // debug

  return !movieData ? null : (
    <div className="mx-auto w-full max-w-screen-2xl px-4">
      <div className="bg-card shadow-primary/20 w-full rounded-md border p-4 shadow-xs">
        <div className="mb-4 flex items-center gap-2 align-middle">
          <h3 className="text-xl font-semibold">{t('magnet-links')}</h3>
          <ButtonCustom
            variant="ghost"
            size="icon"
            title={t('refresh')}
            onClick={() => scrapePB(searchTitle, searchYear)}
            disabled={loadingPB}
            className="smooth42transition hover:text-c42orange hover:bg-transparent"
          >
            {loadingPB ? (
              <CircleDashed className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </ButtonCustom>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="xs:max-w-2xl w-1/2 max-w-72 min-w-[200px]">
                {t('title')}
              </TableHead>
              <TableHead
                onClick={() => handleSort('seeders')}
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1">
                  {t('seeds')}
                  {sortConfig?.key === 'seeders' ? (
                    sortConfig.direction === 'asc' ? (
                      <ArrowUpNarrowWide className="text-primary inline h-4 w-4" />
                    ) : (
                      <ArrowDownWideNarrow className="text-primary inline h-4 w-4" />
                    )
                  ) : (
                    <ArrowDownUp className="text-muted-foreground inline h-4 w-4 opacity-60" />
                  )}
                </span>
              </TableHead>
              <TableHead
                onClick={() => handleSort('leechers')}
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1">
                  {t('leechers')}
                  {sortConfig?.key === 'leechers' ? (
                    sortConfig.direction === 'asc' ? (
                      <ArrowUpNarrowWide className="text-primary inline h-4 w-4" />
                    ) : (
                      <ArrowDownWideNarrow className="text-primary inline h-4 w-4" />
                    )
                  ) : (
                    <ArrowDownUp className="text-muted-foreground inline h-4 w-4 opacity-60" />
                  )}
                </span>
              </TableHead>
              <TableHead onClick={() => handleSort('size')} className="cursor-pointer select-none">
                <span className="inline-flex items-center gap-1">
                  {t('size')}
                  {sortConfig?.key === 'size' ? (
                    sortConfig.direction === 'asc' ? (
                      <ArrowUpNarrowWide className="text-primary inline h-4 w-4" />
                    ) : (
                      <ArrowDownWideNarrow className="text-primary inline h-4 w-4" />
                    )
                  ) : (
                    <ArrowDownUp className="text-muted-foreground inline h-4 w-4 opacity-60" />
                  )}
                </span>
              </TableHead>
              <TableHead className="text-center">{t('latch')}</TableHead>
              <TableHead className="text-center">{t('copy')}</TableHead>
              <TableHead className="text-center">{t('stream')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingPB
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={`loading-${idx}`}>
                    <TableCell className="xs:max-w-2xl max-w-72 min-w-[200px]">
                      <div className="my-2">
                        <Spinner size={24} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : sortedMagnets.map((magnet, idx) => (
                  <TableRow key={magnet.link}>
                    <TableCell className="xs:max-w-2xl max-w-72 min-w-[200px]">
                      {magnet.title}
                    </TableCell>
                    <TableCell>{magnet.seeders}</TableCell>
                    <TableCell>{magnet.leechers}</TableCell>
                    <TableCell>{magnet.size}</TableCell>
                    <TableCell className="text-center">
                      <ButtonCustom size="icon" variant="default" title={t('open-magnet-link')}>
                        <Link href={magnet.link}>
                          <Magnet className="h-4 w-4" />
                        </Link>
                      </ButtonCustom>
                    </TableCell>
                    <TableCell className="text-center">
                      <ButtonCustom
                        size="icon"
                        variant="default"
                        title={t('copy-magnet-link')}
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
                      <ButtonCustom
                        size="icon"
                        variant="default"
                        title={t('start-streaming')}
                        onClick={() => setStream(magnet)}
                      >
                        <Play className="h-4 w-4" />
                      </ButtonCustom>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!loadingPB && magnetsPB.length === 0 && (
          <p className="text-muted-foreground mt-4 text-center text-sm">
            {t('no-magnet-links-available')}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieMagnetsList;
