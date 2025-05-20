import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';

import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

import MovieThumbnail from '@/components/movie-cards/movie-thumbnail';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Command, CommandInput } from '@/components/ui/command';
import DrawerBasic from '@/components/ui/drawer-template';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import RadioGroup from '@/components/ui/radio/radio-group';
import { Separator } from '@/components/ui/separator';
import Spinner from '@/components/ui/spinner';
import useSearchStore from '@/stores/search';
import { framerMotion, slideFromBottom } from '@/styles/motion-variants';
import { TMovieBasics } from '@/types/movies';

const Trigger = () => {
  const t = useTranslations();

  const triggerButton = (
    <div className="animate-fade-up-down fixed top-2 right-2 z-50">
      <ButtonCustom variant="default" className="rounded-full shadow-lg">
        <div className="flex flex-row items-center justify-center gap-2 align-middle">
          <Search width={18} height={18} />
          <p>{t('search.search-by-phrase')}</p>
        </div>
      </ButtonCustom>
    </div>
  );

  // Render outside parent hierarchy using portal
  return typeof window !== 'undefined' ? createPortal(triggerButton, document.body) : null;
};

const DrawerSearchByQuery = () => {
  const t = useTranslations();
  const title = t('search.search-by-phrase');
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const { getValueOfSearchFilter, setValueOfSearchFilter } = useSearchStore();
  const includeAdultContent = getValueOfSearchFilter('include_adult') as string;
  const [query, setQuery] = useState<string>('');
  const [moviesTMDBbyQuery, setMoviesTMDBbyQuery] = useState<TMovieBasics[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPagesAvailable, setTotalPagesAvailable] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const moviesContainerRef = useRef<HTMLDivElement>(null);

  const scrapeTMDBbyQuery = async (reset = false) => {
    if (!query) {
      setMoviesTMDBbyQuery([]);
      setErrorMessage(null);
      return;
    }

    try {
      setErrorMessage(null);
      setLoading(true);

      const queryParams = new URLSearchParams({
        category: 'search',
        total_pages_available: totalPagesAvailable.toString(),
        search: query,
        include_adult: includeAdultContent,
        lang: locale,
        page: page.toString(),
      });
      const response = await fetch(`/api/movies?${queryParams.toString()}`);
      const data = await response.json();
      const results = data?.results;
      const error = data?.error;
      const totalPages = data?.total_pages || 1;
      setTotalPagesAvailable(totalPages); // Set the total pages available for pagination for the current request parameters

      if (results) {
        const newMovies = reset ? results : [...moviesTMDBbyQuery, ...results];
        const uniqueMovies = Array.from(
          new Set(newMovies.map((movie: TMovieBasics) => movie.id))
        ).map((id) => newMovies.find((movie: TMovieBasics) => movie.id === id));
        setMoviesTMDBbyQuery(uniqueMovies);
      }
      if (error) {
        setErrorMessage(t(error));
      }
    } catch (error) {
      setErrorMessage(t('error-fetching-movies'));
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const handleSearch = () => {
    setMoviesTMDBbyQuery([]);
    setPage(1);
    setErrorMessage(null);
    scrapeTMDBbyQuery(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPagesAvailable) return;
    setPage(newPage);
  };

  const handleAdultContentChange = (value: string) => {
    setValueOfSearchFilter('include_adult', value);
  };

  useEffect(() => {
    scrapeTMDBbyQuery(true);

    // Scroll to the top of movies container
    moviesContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, includeAdultContent]);

  return (
    <DrawerBasic trigger={<Trigger />} title={title} side="left" size="1/2">
      <div ref={moviesContainerRef} className="flex w-full flex-col gap-4 p-2">
        <div className="xs:flex-row flex flex-col items-center justify-center gap-4">
          <div className="flex w-full max-w-32 flex-col gap-2 self-center">
            <label className="font-bold">18+</label>
            <RadioGroup
              options={[
                { value: 'true', label: t('yes') },
                { value: 'false', label: t('no') },
              ]}
              selectedItem={getValueOfSearchFilter('include_adult') as string}
              onSelectItem={(args_0) => handleAdultContentChange(args_0)}
              defaultValue="false"
            />
          </div>
          <div className="flex w-full items-center gap-2">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={t('search.enter-request')}
                value={query}
                onValueChange={setQuery}
                className="h-9"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </Command>
            <X className="size-4 shrink-0 cursor-pointer opacity-50" onClick={() => setQuery('')} />
          </div>
          <ButtonCustom
            className="w-1/6 min-w-16"
            variant="default"
            onClick={handleSearch}
            disabled={isFetching || !query || loading}
            loading={isFetching || loading}
          >
            {t('search.search')}
          </ButtonCustom>
        </div>
        {/* Movies sector */}
        {!moviesTMDBbyQuery.length && !loading && (
          <p className="text-center">{t('no-results-found')}</p>
        )}
        <motion.div initial="hidden" animate="visible" variants={framerMotion}>
          <div
            key="moviesTMDB"
            className="smooth42transition flex flex-wrap items-center justify-center gap-5 align-middle"
          >
            {moviesTMDBbyQuery?.map((movie, index) => (
              <motion.div
                variants={slideFromBottom}
                key={`${movie.id}-${index}`}
                className="flex justify-center self-center"
              >
                <MovieThumbnail movieBasics={movie} loading={false} />
              </motion.div>
            ))}
          </div>

          {loading && (
            <div className="m-5 flex flex-col items-center gap-5">
              <Spinner size={21} />
              <p className="animate-pulse text-base leading-[19px] font-normal">{t(`loading`)}</p>
            </div>
          )}
          {errorMessage && (
            <p className="text-destructive m-5 animate-pulse text-center text-base font-normal">
              {errorMessage}
            </p>
          )}
          {/* Pagination */}
          {moviesTMDBbyQuery?.length > 0 && totalPagesAvailable > 1 && (
            <>
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      text={t('search.previous')}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page - 1);
                      }}
                    />
                  </PaginationItem>

                  {[...Array(Math.min(totalPagesAvailable, 2))].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={page === pageNumber}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPagesAvailable > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem key={totalPagesAvailable}>
                    <PaginationLink
                      href="#"
                      isActive={page === totalPagesAvailable}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPagesAvailable);
                      }}
                    >
                      {totalPagesAvailable}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      text={t('search.next')}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <p className="text-muted-foreground mt-2 text-center text-sm">
                {t('page')} {page} {t('of')} {totalPagesAvailable}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </DrawerBasic>
  );
};

export default DrawerSearchByQuery;
