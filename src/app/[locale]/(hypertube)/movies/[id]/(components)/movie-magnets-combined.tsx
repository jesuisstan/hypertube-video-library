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
import {
  TMagnetDataPirateBay,
  TTorrentDataRuTracker,
  TUnifiedMagnetData,
} from '@/types/torrent-magnet-data';

interface MovieMagnetsCombinedProps {
  movieData: TMovieBasics | null;
  setStream: (stream: TUnifiedMagnetData | null) => void;
}

const MovieMagnetsCombined = ({ movieData, setStream }: MovieMagnetsCombinedProps) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const [loadingPB, setLoadingPB] = useState(false);
  const [loadingRT, setLoadingRT] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [unifiedMagnets, setUnifiedMagnets] = useState<TUnifiedMagnetData[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null
  );

  const isLoading = loadingPB || loadingRT;

  // Helper function to parse size to bytes
  const parseSizeToBytes = (size: string): number => {
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

  // Helper function to format bytes to human readable
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to parse PirateBay date
  const parsePirateBayDate = (dateStr: string): Date => {
    try {
      // Format: "08-06 2021" -> "08-06-2021"
      const [monthDay, year] = dateStr.split(' ');
      const [month, day] = monthDay.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } catch {
      return new Date();
    }
  };

  const scrapePirateBay = async (searchText: string, searchYear: string) => {
    if (!searchText || !searchYear) return [];

    setLoadingPB(true);
    try {
      const response = await fetch(
        `/api/torrents/piratebay?title=${encodeURIComponent(searchText)}&year=${searchYear}`
      );
      const data: TMagnetDataPirateBay[] = await response.json();

      return data.map(
        (magnet, index): TUnifiedMagnetData => ({
          id: `pb-${index}-${magnet.link.slice(-10)}`,
          title: magnet.title,
          seeds: magnet.seeders,
          leeches: magnet.leechers,
          size: magnet.size,
          sizeBytes: parseSizeToBytes(magnet.size),
          uploaded: magnet.uploaded,
          uploadedDate: parsePirateBayDate(magnet.uploaded),
          magnetLink: magnet.link,
          source: 'PirateBay',
          uploader: magnet.uploader,
        })
      );
    } catch (error) {
      console.error('Error scraping PirateBay:', error);
      return [];
    } finally {
      setLoadingPB(false);
    }
  };

  const scrapeRuTracker = async (searchText: string, searchYear: string) => {
    if (!searchText || !searchYear) return [];

    setLoadingRT(true);
    try {
      const response = await fetch(
        `/api/torrents/rutracker?title=${encodeURIComponent(searchText)}&year=${searchYear}`
      );
      const responseData = await response.json();

      // Ensure data is an array before using array methods
      const data: TTorrentDataRuTracker[] = Array.isArray(responseData) ? responseData : [];

      return data
        .filter((torrent) => torrent.magnetLink) // Only include torrents with magnet links
        .map(
          (torrent): TUnifiedMagnetData => ({
            id: `rt-${torrent.id}`,
            title: torrent.title,
            seeds: torrent.seeds,
            leeches: torrent.leeches,
            size: formatBytes(torrent.size),
            sizeBytes: torrent.size,
            uploaded: new Date(torrent.registered).toLocaleDateString(locale),
            uploadedDate: new Date(torrent.registered),
            magnetLink: torrent.magnetLink!,
            source: 'Rutracker',
            uploader: torrent.author,
          })
        );
    } catch (error) {
      console.error('Error scraping RuTracker:', error);
      return [];
    } finally {
      setLoadingRT(false);
    }
  };

  const fetchAllMagnets = async (searchText: string, searchYear: string) => {
    if (!searchText || !searchYear) return;

    const [pirateBayResults, rutrackerResults] = await Promise.all([
      scrapePirateBay(searchText, searchYear),
      scrapeRuTracker(searchText, searchYear),
    ]);

    const combined = [...pirateBayResults, ...rutrackerResults];
    setUnifiedMagnets(combined);
  };

  useEffect(() => {
    if (movieData?.original_title && movieData?.release_date) {
      setSearchTitle(movieData?.original_title);
      setSearchYear(movieData?.release_date?.split('-')[0]);
    }
  }, [movieData]);

  useEffect(() => {
    if (searchTitle) {
      fetchAllMagnets(searchTitle, searchYear);
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
    if (!sortConfig || !Array.isArray(unifiedMagnets) || unifiedMagnets.length === 0)
      return unifiedMagnets;
    const key = sortConfig.key as keyof TUnifiedMagnetData;

    const sorted = [...unifiedMagnets];
    sorted.sort((a, b) => {
      let aValue: any = a[key];
      let bValue: any = b[key];

      if (key === 'sizeBytes' || key === 'seeds' || key === 'leeches') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (key === 'uploadedDate') {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
    return sorted;
  }, [unifiedMagnets, sortConfig]);

  // Only show component if we have at least one successful result
  if (!movieData || (!isLoading && unifiedMagnets.length === 0)) {
    return null;
  }

  console.log('unifiedMagnets', unifiedMagnets); // debug

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4">
      <div className="bg-card shadow-primary/20 w-full rounded-md border p-4 shadow-xs">
        <div className="mb-4 flex items-center gap-2 align-middle">
          <h3 className="text-xl font-semibold">{t('magnet-links')}</h3>
          <ButtonCustom
            variant="ghost"
            size="icon"
            title={t('refresh')}
            onClick={() => fetchAllMagnets(searchTitle, searchYear)}
            disabled={isLoading}
            className="smooth42transition hover:text-c42orange hover:bg-transparent"
          >
            {isLoading ? (
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
                onClick={() => handleSort('source')}
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1">
                  {t('source')}
                  {sortConfig?.key === 'source' ? (
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
              <TableHead
                onClick={() => handleSort('sizeBytes')}
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1">
                  {t('size')}
                  {sortConfig?.key === 'sizeBytes' ? (
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
                onClick={() => handleSort('uploadedDate')}
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1">
                  {t('uploaded')}
                  {sortConfig?.key === 'uploadedDate' ? (
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
            {isLoading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={`loading-${idx}`}>
                    <TableCell className="xs:max-w-2xl max-w-72 min-w-[200px]">
                      <div className="my-2">
                        <Spinner size={24} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Spinner size={16} />
                    </TableCell>
                    <TableCell>
                      <Spinner size={16} />
                    </TableCell>
                    <TableCell>
                      <Spinner size={16} />
                    </TableCell>
                    <TableCell>
                      <Spinner size={16} />
                    </TableCell>
                    <TableCell>
                      <Spinner size={16} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Spinner size={16} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Spinner size={16} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Spinner size={16} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : sortedMagnets.map((magnet, idx) => (
                  <TableRow key={magnet.id}>
                    <TableCell className="xs:max-w-2xl max-w-72 min-w-[200px]">
                      <div className="flex flex-col">
                        <span className="font-medium">{magnet.title}</span>
                        {magnet.uploader && (
                          <span className="text-muted-foreground text-xs">
                            {t('uploader')}: {magnet.uploader}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          magnet.source === 'Rutracker'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-[#f6f1ee] text-[#9e6940] dark:bg-[#9e6940] dark:text-[#f6f1ee]'
                        }`}
                      >
                        {magnet.source}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">{magnet.seeds}</TableCell>
                    <TableCell className="font-medium text-red-600">{magnet.leeches}</TableCell>
                    <TableCell className="font-medium">{magnet.size}</TableCell>
                    <TableCell className="text-sm">{magnet.uploaded}</TableCell>
                    <TableCell className="text-center">
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
                    </TableCell>
                    <TableCell className="text-center">
                      <ButtonCustom
                        size="icon"
                        variant="default"
                        title={t('copy-magnet-link')}
                        onClick={() => handleCopy(magnet.magnetLink, idx)}
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
        {!isLoading && unifiedMagnets.length === 0 && (
          <p className="text-muted-foreground mt-4 text-center text-sm">
            {t('no-magnet-links-available')}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieMagnetsCombined;
