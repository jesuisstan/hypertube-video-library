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
import { TTorrentDataRuTracker } from '@/types/torrent-magnet-data';

interface MovieRutrackerListProps {
  movieData: TMovieBasics | null;
  setStream: (stream: TTorrentDataRuTracker | null) => void;
}

const MovieRutrackerList = ({ movieData, setStream }: MovieRutrackerListProps) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const preferedContentLanguage = user?.preferred_language || locale;
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [magnets, setMagnets] = useState<TTorrentDataRuTracker[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null
  );

  const scrapeRuTracker = async (searchText: string, searchYear: string) => {
    if (!searchText || !searchYear) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/torrents/rutracker?title=${encodeURIComponent(searchText)}&year=${searchYear}`
      );
      const data = await response.json();
      setMagnets(data);
    } catch (error) {
      console.error('Error scraping RuTracker:', error);
    } finally {
      setLoading(false);
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
      scrapeRuTracker(searchTitle, searchYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle]);

  const handleCopy = async (link: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (e) {
      console.error('Failed to copy to clipboard:', e);
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
    if (!sortConfig || !Array.isArray(magnets) || magnets.length === 0) return magnets;
    const key = sortConfig.key as keyof TTorrentDataRuTracker;
    if (!magnets.every((item) => Object.prototype.hasOwnProperty.call(item, key))) {
      return magnets;
    }
    const sorted = [...magnets];
    sorted.sort((a, b) => {
      let aValue: any = a[key];
      let bValue: any = b[key];

      if (key === 'size') {
        // Size is already in bytes, so we can compare directly
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (key === 'registered') {
        // Handle uploaded date comparison
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
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
  }, [magnets, sortConfig]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(locale);
  };

  // console.log('Rutracker magnets', magnets); //debug

  return !movieData ? null : (
    <div className="mx-auto w-full max-w-screen-2xl px-4">
      <div className="bg-card shadow-primary/20 w-full rounded-md border p-4 shadow-xs">
        <div className="mb-4 flex items-center gap-2 align-middle">
          <h3 className="text-xl font-semibold">{t('rutracker-magnets')}</h3>
          <ButtonCustom
            variant="ghost"
            size="icon"
            title={t('refresh')}
            onClick={() => scrapeRuTracker(searchTitle, searchYear)}
            disabled={loading}
            className="smooth42transition hover:text-c42orange hover:bg-transparent"
          >
            {loading ? (
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
              <TableHead onClick={() => handleSort('seeds')} className="cursor-pointer select-none">
                <span className="inline-flex items-center gap-1">
                  {t('seeds')}
                  {sortConfig?.key === 'seeds' ? (
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
                onClick={() => handleSort('leeches')}
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1">
                  {t('leechers')}
                  {sortConfig?.key === 'leeches' ? (
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
              <TableHead
                onClick={() => handleSort('registered')}
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1">
                  {t('uploaded')}
                  {sortConfig?.key === 'registered' ? (
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
            {loading
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
                  <TableRow key={magnet.id}>
                    <TableCell className="xs:max-w-2xl max-w-72 min-w-[200px]">
                      <div className="flex flex-col">
                        <span className="font-medium">{magnet.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{magnet.seeds}</TableCell>
                    <TableCell className="font-medium">{magnet.leeches}</TableCell>
                    <TableCell className="font-medium">{magnet.size}</TableCell>
                    <TableCell className="text-sm">{formatDate(magnet.registered)}</TableCell>
                    <TableCell className="text-center">
                      {magnet.magnetLink ? (
                        <ButtonCustom
                          size="icon"
                          variant="default"
                          title={t('open-magnet-link')}
                          asChild
                        >
                          <Link href={magnet.magnetLink}>
                            <Magnet className="h-4 w-4" />
                          </Link>
                        </ButtonCustom>
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {magnet.magnetLink ? (
                        <ButtonCustom
                          size="icon"
                          variant="default"
                          title={t('copy-magnet-link')}
                          onClick={() => handleCopy(magnet.magnetLink!, idx)}
                        >
                          {copiedIdx === idx ? (
                            <CopyCheck className="text-positive smooth42transition h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </ButtonCustom>
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {magnet.magnetLink ? (
                        <ButtonCustom
                          size="icon"
                          variant="default"
                          title={t('start-streaming')}
                          onClick={() => setStream(magnet)}
                        >
                          <Play className="h-4 w-4" />
                        </ButtonCustom>
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!loading && magnets.length === 0 && (
          <p className="text-muted-foreground mt-4 text-center text-sm">
            {t('no-magnet-links-available')}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieRutrackerList;
