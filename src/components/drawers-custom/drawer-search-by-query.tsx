import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

import MovieThumbnail from '@/components/movie-cards/movie-thumbnail';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import { Command, CommandInput } from '@/components/ui/command';
import DrawerBasic from '@/components/ui/drawer-template';
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
  const { getValueOfSearchFilter } = useSearchStore();
  const includeAdultContent = getValueOfSearchFilter('include_adult') as string;
  const [query, setQuery] = useState<string>('');
  const [moviesTMDBbyQuery, setMoviesTMDBbyQuery] = useState<TMovieBasics[]>([]);
  const [totalPagesAvailable, setTotalPagesAvailable] = useState<number>(42);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

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
        search: query,
        include_adult: includeAdultContent,
        lang: locale,
        page: '1',
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
  console.log('moviesTMDBbyQuery', moviesTMDBbyQuery); // debug
  console.log('query', query); // debug

  const handleSearch = () => {
    setMoviesTMDBbyQuery([]);
    setErrorMessage(null);
    scrapeTMDBbyQuery(true);
  };

  return (
    <DrawerBasic trigger={<Trigger />} title={title} side="right" size="1/2">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
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
          <ButtonCustom
            className="w-1/6"
            variant="default"
            onClick={handleSearch}
            disabled={isFetching || !query || loading}
            loading={isFetching || loading}
          >
            {t('search.search')}
          </ButtonCustom>
        </div>
        {/* Movies sector */}
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
        </motion.div>
      </div>
    </DrawerBasic>
  );
};

export default DrawerSearchByQuery;
