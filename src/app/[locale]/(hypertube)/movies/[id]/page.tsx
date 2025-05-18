'use client';

import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import * as Avatar from '@radix-ui/react-avatar';
import clsx from 'clsx';
import { ArrowRight, BookCopy, BookmarkIcon, Download, Eye } from 'lucide-react';

import Loading from '@/app/loading';
import DrawerCredits from '@/components/drawers-custom/drawer-credits';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Separator } from '@/components/ui/separator';
import TooltipBasic from '@/components/ui/tooltip/tooltip-basic';
import { allLanguagesOptions, TLanguageOption } from '@/constants/all-languages-ISO-639-1';
import { Link } from '@/i18n/routing';
import { fetchMoviesByTitle } from '@/lib/yts-api';
import useUserStore from '@/stores/user';
import { TMagnetDataPirateBay } from '@/types/magnet-data-piratebay';
import { TMovieBasics, TMovieCredits } from '@/types/movies';
import { TTorrentDataYTS } from '@/types/torrent-data-yts';
import { formatDateThumbnail } from '@/utils/format-date';
import { capitalize } from '@/utils/format-string';

const MovieProfile = () => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const { id: movieId } = useParams(); // Grab the id from the dynamic route
  const [loading, setLoading] = useState(false);
  const [loadingYTS, setLoadingYTS] = useState(false);
  const [loadingPB, setLoadingPB] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [loadingWatched, setLoadingWatched] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [movieData, setMovieData] = useState<TMovieBasics | null>(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [magnetsPB, setMagnetsPB] = useState<TMagnetDataPirateBay[]>([]);
  const [torrentsYTS, setTorrentsYTS] = useState<TTorrentDataYTS[]>([]);
  const [creditsData, setCreditsData] = useState<TMovieCredits | null>(null);

  const scrapeTMDB = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/movies/${movieId}/?lang=${locale}`); // todo fetch EN data to avoid torrent-scraping issues coused by original titles
      const data = await response.json();
      setMovieData(data);
    } catch (error) {
      console.error('Error scraping TMDB:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchCredits = async () => {
    try {
      const response = await fetch(`/api/movies/${movieId}/credits?lang=${locale}`);
      const data: TMovieCredits = await response.json();
      setCreditsData(data);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const handleBookmarkClick = async () => {
    try {
      setLoadingBookmarks(true);
      const queryParams = new URLSearchParams({
        user_id: user?.id || '',
        poster_path: movieData?.poster_path || '',
        release_date: movieData?.release_date || '',
        title: movieData?.original_title || movieData?.title || '',
        vote_average: String(movieData?.vote_average) || '',
      });
      const response = await fetch(`/api/movies/${movieId}/bookmarks?${queryParams.toString()}`, {
        method: isBookmarked ? 'DELETE' : 'PUT',
        body: JSON.stringify({ isBookmarked: !isBookmarked }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setIsBookmarked((prev) => !prev);
    } catch (error) {
      console.error('Error updating bookmark:', error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const handleWatchlistClick = async () => {
    try {
      setLoadingWatched(true);
      const queryParams = new URLSearchParams({
        user_id: user?.id || '',
        poster_path: movieData?.poster_path || '',
        release_date: movieData?.release_date || '',
        title: movieData?.original_title || movieData?.title || '',
        vote_average: String(movieData?.vote_average) || '',
      });
      const response = await fetch(`/api/movies/${movieId}/watched?${queryParams.toString()}`, {
        method: isInWatchlist ? 'DELETE' : 'PUT',
        body: JSON.stringify({ isInWatchlist: !isInWatchlist }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setIsInWatchlist((prev) => !prev);
    } catch (error) {
      console.error('Error updating watched:', error);
    } finally {
      setLoadingWatched(false);
    }
  };

  const checkBookmark = async () => {
    if (!user?.id || !movieId) return;
    try {
      setLoadingBookmarks(true);
      const res = await fetch(`/api/movies/${movieId}/bookmarks?user_id=${user.id}`);
      const data = await res.json();
      setIsBookmarked(Boolean(data.isBookmarked));
    } catch (error) {
      console.error('Error checking bookmark:', error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const checkWatchlist = async () => {
    if (!user?.id || !movieId) return;
    try {
      setLoadingWatched(true);
      const res = await fetch(`/api/movies/${movieId}/watched?user_id=${user.id}`);
      const data = await res.json();
      setIsInWatchlist(Boolean(data.isInWatchlist));
    } catch (error) {
      console.error('Error checking watched:', error);
    } finally {
      setLoadingWatched(false);
    }
  };

  // Fetch movie data and credits on component mount
  useEffect(() => {
    scrapeTMDB();
    fetchCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if the movie is bookmarked or in watched when user changes
  useEffect(() => {
    checkBookmark();
    checkWatchlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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

  console.log('TMBB movieData', movieData); // debug
  console.log('YTS torrents', torrentsYTS); // debug
  console.log('PirateBay magnetsPB', magnetsPB); // debug

  return loading || !movieData || !creditsData ? (
    <Loading />
  ) : (
    <div className="w-full space-y-5">
      {/* Main content with backdrop */}
      <div className="relative mx-auto grid max-w-screen grid-cols-1 gap-10 px-6 py-10 md:grid-cols-[300px_1fr]">
        <div className="shadow-primary/40 absolute inset-0 -z-10 overflow-hidden rounded-md shadow-md">
          <Image
            src={
              movieData?.backdrop_path
                ? `https://image.tmdb.org/t/p/w780${movieData.backdrop_path}`
                : '/icons/logo-title-only.png'
            }
            alt="backdrop"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="from-primary/40 to-primary/90 absolute inset-0 bg-gradient-to-b" />
        </div>
        {/* Poster */}
        <div className="flex items-center justify-center overflow-hidden rounded-md align-middle">
          <Image
            src={
              movieData?.poster_path
                ? `https://image.tmdb.org/t/p/w300${movieData.poster_path}`
                : '/identity/logo-thumbnail.png'
            }
            alt="poster"
            width={0}
            height={0}
            sizes="100vw"
            className="h-[450px] w-[300px] rounded-md object-cover shadow-md"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-8">
          {/* Left column: title, subtitle, overview */}
          <div className="flex flex-col justify-center gap-4 md:w-2/3">
            {/* Title */}
            <h1 className="text-primary-foreground text-3xl font-bold">
              {movieData?.title}{' '}
              <span className="text-secondary font-normal">
                {movieData?.release_date && `(${new Date(movieData.release_date).getFullYear()})`}
              </span>
            </h1>
            <div className="flex flex-row items-center gap-4">
              {/* Rating */}
              <div
                className={clsx(
                  'bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full border font-bold shadow-md',
                  movieData?.vote_average! > 7
                    ? 'border-positive shadow-positive'
                    : movieData?.vote_average! >= 6
                      ? 'border-amber-400 shadow-amber-400'
                      : 'border-destructive shadow-destructive'
                )}
                title={`${t('average-rating')}: ${movieData?.vote_average}`}
              >
                {movieData?.vote_average?.toFixed(1)}
              </div>

              <Separator orientation="vertical" />

              {/* Bookmarks button */}
              <TooltipBasic
                trigger={
                  <button
                    className={clsx(
                      'bg-primary group relative z-40 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-2 rounded-full border align-middle font-bold shadow-md',
                      isBookmarked
                        ? 'border-amber-400 text-amber-400 shadow-amber-400'
                        : 'text-card border-card shadow-card'
                    )}
                    onClick={handleBookmarkClick}
                    disabled={loadingBookmarks}
                  >
                    {loadingBookmarks ? (
                      <span className="animate-pulse">?</span>
                    ) : (
                      <BookmarkIcon className="smooth42transition h-5 w-5" />
                    )}
                  </button>
                }
              >
                {isBookmarked ? t('remove-from-bookmarks') : t('add-to-bookmarks')}
              </TooltipBasic>

              {/* Watched list button */}
              <TooltipBasic
                trigger={
                  <button
                    className={clsx(
                      'bg-primary group relative z-40 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-2 rounded-full border align-middle font-bold shadow-md',
                      isInWatchlist
                        ? 'border-amber-400 text-amber-400 shadow-amber-400'
                        : 'text-card border-card shadow-card'
                    )}
                    onClick={handleWatchlistClick}
                    disabled={loadingWatched}
                  >
                    {loadingWatched ? (
                      <span className="animate-pulse">?</span>
                    ) : (
                      <Eye className="smooth42transition h-5 w-5" />
                    )}
                  </button>
                }
              >
                {isInWatchlist ? t('set-unwatched') : t('set-watched')}
              </TooltipBasic>
            </div>
            {/* Original title */}
            <p className="text-secondary text-lg">
              {movieData?.original_title && (
                <span className="flex flex-row flex-wrap items-center gap-2">
                  <span className="font-bold">{t('original-title')}:</span>
                  <span className="italic">{movieData?.original_title}</span>
                </span>
              )}
            </p>
            {/* Tagline */}
            <p className="text-c42orange text-lg italic">
              {movieData?.tagline && movieData.tagline}
            </p>
            {/* Overview */}
            <p className="text-secondary mt-2 max-w-5xl text-lg leading-relaxed">
              {movieData?.overview}
            </p>
          </div>

          {/* Right column: metadata */}
          <div className="flex flex-col justify-center gap-2 md:w-1/3">
            <p className="text-secondary">
              <span className="flex flex-row flex-wrap items-center gap-2">
                <span className="font-bold">{t('release')}:</span>
                <span className="italic">{formatDateThumbnail(movieData?.release_date)}</span>
              </span>
            </p>

            {movieData?.production_countries && movieData?.production_countries?.length > 0 ? (
              <div className="text-secondary flex flex-row flex-wrap items-center gap-2">
                <span className="font-bold">{t('production-countries')}:</span>
                <div className="flex flex-wrap items-center gap-1">
                  {movieData.production_countries.map((country, index) => (
                    <Fragment key={index}>
                      <div className="flex flex-row items-center gap-1">
                        <Avatar.Root
                          className={
                            'border-foreground bg-foreground inline-flex items-center justify-center overflow-hidden rounded-full border-2 align-middle select-none'
                          }
                        >
                          <Avatar.Image
                            className="h-4 w-4 rounded-[inherit] object-cover"
                            src={`/country-flags/${country.iso_3166_1.toLowerCase()}.svg`}
                            alt={`${country.name}-flag`}
                          />
                        </Avatar.Root>
                        <span className="italic">{country.name}</span>
                      </div>
                      {movieData?.production_countries?.length &&
                        index < movieData.production_countries.length - 1 && (
                          <span className="text-secondary italic">|</span>
                        )}
                    </Fragment>
                  ))}
                </div>
              </div>
            ) : null}

            {movieData?.original_language ? (
              <div className="text-secondary flex flex-row flex-wrap items-center gap-2">
                <span className="font-bold">{t('original-language')}:</span>
                <span className="italic">
                  {allLanguagesOptions.find(
                    (lang: TLanguageOption) => lang.value === movieData.original_language
                  )?.[`label${locale.toUpperCase()}` as keyof TLanguageOption] ||
                    movieData.original_language}
                </span>
              </div>
            ) : null}

            <p className="text-muted">
              <span className="flex flex-row flex-wrap items-center gap-2">
                <span className="font-bold">{t('genres')}:</span>
                <span className="italic">
                  {movieData?.genres?.map((genre) => capitalize(genre.name)).join(' | ')}
                </span>
              </span>
            </p>

            {movieData?.budget && movieData?.budget > 0 ? (
              <p className="text-muted">
                <span className="flex flex-row flex-wrap items-center gap-2">
                  <span className="font-bold">{t('budget')}:</span>
                  <span className="italic">{movieData.budget.toLocaleString()}</span>
                </span>
              </p>
            ) : null}

            {movieData?.revenue && movieData?.revenue > 0 ? (
              <p className="text-muted">
                <span className="flex flex-row flex-wrap items-center gap-2">
                  <span className="font-bold">{t('revenue')}:</span>
                  <span className="italic">{movieData.revenue.toLocaleString()}</span>
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Cast */}
      <div className="bg-card shadow-primary/20 max-w-full rounded-md p-5 shadow-md">
        <h3 className="mb-4 text-xl font-semibold">
          {t('top-billed-cast')}
          {':'}
        </h3>
        {creditsData?.cast?.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 align-middle md:justify-start">
            {creditsData?.cast?.slice(0, 10).map((actor, index) => (
              <div key={index} className="flex w-32 flex-col">
                <div className="bg-muted flex justify-center overflow-hidden rounded-md align-middle">
                  <Image
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : '/icons/person.png'
                    }
                    alt={actor.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-[192px] w-[128px] rounded-md object-cover"
                  />
                </div>
                <p className="mt-2 text-center text-sm font-semibold">{actor.name}</p>
                <p className="text-muted-foreground text-center text-xs">{actor.character}</p>
              </div>
            ))}
            {creditsData?.cast && (
              <DrawerCredits
                title={movieData?.title ? movieData?.title : ''}
                description={t('top-billed-cast')}
                data={creditsData?.cast}
              />
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-center text-sm">{t('no-info-available')}</p>
        )}
      </div>

      {/* Crew */}
      <div className="bg-card shadow-primary/20 max-w-full rounded-md p-5 shadow-md">
        <h3 className="mb-4 text-xl font-semibold">
          {t('crew')}
          {':'}
        </h3>
        {creditsData?.crew.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 align-middle md:justify-start">
            {creditsData?.crew?.slice(0, 10).map((crewMember, index) => (
              <div key={index} className="flex w-32 flex-col">
                <div className="bg-muted flex justify-center overflow-hidden rounded-md align-middle">
                  <Image
                    src={
                      crewMember.profile_path
                        ? `https://image.tmdb.org/t/p/w200${crewMember.profile_path}`
                        : '/icons/person.png'
                    }
                    alt={crewMember.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-[192px] w-[128px] rounded-md object-cover"
                  />
                </div>
                <p className="mt-2 text-center text-sm font-semibold">{crewMember.name}</p>
                <p className="text-muted-foreground text-center text-xs">{crewMember.job}</p>
              </div>
            ))}
            {creditsData?.crew && (
              <DrawerCredits
                title={movieData?.title ? movieData?.title : ''}
                description={t('crew')}
                data={creditsData?.crew}
              />
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-center text-sm">{t('no-info-available')}</p>
        )}
      </div>

      {/* scraping torrents */}
      <div className="bg-card shadow-primary/20 relative z-10 mx-auto max-w-screen p-5 shadow-md">
        <ButtonCustom
          onClick={() => scrapeYTS(searchTitle, searchYear)}
          loading={loadingYTS}
          disabled={loading || loadingYTS}
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
          disabled={loading || loadingPB}
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
    </div>
  );
};

export default MovieProfile;
