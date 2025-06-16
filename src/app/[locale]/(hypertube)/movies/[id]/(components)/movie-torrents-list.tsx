'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  CircleDashed,
  Download,
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
import { fetchMoviesByTitle } from '@/lib/yts-api';
import useUserStore from '@/stores/user';
import { TMovieBasics } from '@/types/movies';
import { TTorrentDataYTS } from '@/types/torrent-magnet-data';

interface MovieTorrentsList {
  movieData: TMovieBasics | null;
  setStream: (stream: TTorrentDataYTS | null) => void;
}

const MovieTorrentsList = ({ movieData, setStream }: MovieTorrentsList) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const preferedContentLanguage = user?.preferred_language || locale;
  const [loadingYTS, setLoadingYTS] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [torrentsYTS, setTorrentsYTS] = useState<TTorrentDataYTS[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null
  );

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

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedTorrents = useMemo(() => {
    if (!sortConfig || !Array.isArray(torrentsYTS) || torrentsYTS.length === 0) return torrentsYTS;
    // Check if all items have the field to sort by
    const key = sortConfig.key as keyof TTorrentDataYTS;
    if (!torrentsYTS.every((item) => Object.prototype.hasOwnProperty.call(item, key))) {
      return torrentsYTS;
    }
    const sorted = [...torrentsYTS];
    sorted.sort((a, b) => {
      let aValue: any = a[key];
      let bValue: any = b[key];
      // For size, try to use size_bytes if available, else fallback to string
      if (key === 'size') {
        aValue = a.size_bytes ?? a.size;
        bValue = b.size_bytes ?? b.size;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [torrentsYTS, sortConfig, movieData?.title]);

  return !movieData ? null : (
    <div className="mx-auto w-full max-w-screen-2xl px-4">
      <div className="bg-card shadow-primary/20 w-full rounded-md border p-4 shadow-xs">
        <div className="mb-4 flex items-center gap-2 align-middle">
          <h3 className="text-xl font-semibold">{t('torrent-files')}</h3>
          <ButtonCustom
            variant="ghost"
            size="icon"
            title={t('refresh')}
            onClick={() => scrapeYTS(searchTitle, searchYear)}
            disabled={loadingYTS}
            className="smooth42transition hover:text-c42orange hover:bg-transparent"
          >
            {loadingYTS ? (
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
                {t('content')}
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
              <TableHead onClick={() => handleSort('peers')} className="cursor-pointer select-none">
                <span className="inline-flex items-center gap-1">
                  {t('peers')}
                  {sortConfig?.key === 'peers' ? (
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
              <TableHead className="text-center">{t('download')}</TableHead>
              <TableHead className="text-center">{t('stream')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingYTS
              ? //Array.from({ length: 3 }).map((_, idx) => (
                //    <TableRow key={`loading-${idx}`}>
                //      <TableCell className="xs:max-w-2xl max-w-72 min-w-[200px]">
                //        <div className="my-2">
                //          <Spinner size={24} />
                //        </div>
                //      </TableCell>
                //    </TableRow>
                //  ))
                Array.from({ length: 5 }).map((_, idx) => (
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
              : sortedTorrents.map((torrent, idx) => (
                  <TableRow key={idx}>
                    <TableCell
                      className="xs:max-w-2xl max-w-72 min-w-[200px]"
                      title={movieData?.title}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{movieData?.title}</span>
                        <span className="muted-foreground text-xs">
                          {movieData?.release_date?.split('-')[0]}
                          {torrent.quality && ` • ${torrent.quality}`}
                          {torrent.type && ` • ${torrent.type}`}
                          {torrent.audio_channels && ` • ${torrent.audio_channels}ch`}
                          {torrent.video_codec && ` • ${torrent.video_codec}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{torrent.seeds}</TableCell>
                    <TableCell>{torrent.peers}</TableCell>
                    <TableCell>{torrent.size}</TableCell>
                    <TableCell className="text-center">
                      <ButtonCustom
                        size="icon"
                        variant="default"
                        title={t('download') + ' ' + t('torrent')}
                      >
                        <Link href={torrent.url}>
                          <Download className="h-4 w-4" />
                        </Link>
                      </ButtonCustom>
                    </TableCell>
                    <TableCell className="text-center">
                      <ButtonCustom
                        size="icon"
                        variant="default"
                        title={t('start-streaming')}
                        onClick={() => setStream(torrent)}
                      >
                        <Play className="h-4 w-4" />
                      </ButtonCustom>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!loadingYTS && torrentsYTS.length === 0 && (
          <p className="text-muted-foreground mt-4 text-center text-sm">
            {t('no-torrents-available')}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieTorrentsList;
