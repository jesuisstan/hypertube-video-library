'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { BookmarkIcon, Eye, LucideIcon } from 'lucide-react';

import Loading from '@/app/loading';
import DialogProfileModify from '@/components/dialogs-custom/dialog-profile-modify';
import TProfileCompleteLayout from '@/components/dialogs-custom/dialog-profile-modify';
import MovieThumbnail from '@/components/movie-cards/movie-thumbnail';
import CategoryToggler from '@/components/tabs-custom/category-toggler';
import Spinner from '@/components/ui/spinner';
import DescriptionWrapper from '@/components/wrappers/description-wrapper';
import HeaderWrapper from '@/components/wrappers/header-wrapper';
import PrefLangWrapper from '@/components/wrappers/lang-wrapper';
import LastModificationWrapper from '@/components/wrappers/last-modification-wrapper';
import LocationWrapper from '@/components/wrappers/location-wrapper';
import StatusWrapper from '@/components/wrappers/status-wrapper';
import useUserStore from '@/stores/user';
import { framerMotion, slideFromBottom } from '@/styles/motion-variants';
import { TMovieBasics } from '@/types/movies';

const ProfilePage = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const globalLoading = useUserStore((state) => state.globalLoading);

  const [category, setCategory] = useState<'bookmarks' | 'watched'>('bookmarks');
  const [loading, setLoading] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [loadingWatched, setLoadingWatched] = useState(false);
  const [bookmarksData, setBookmarksData] = useState<TMovieBasics[]>([]);
  const [watchedData, setWatchedData] = useState<TMovieBasics[]>([]);
  const [showProfileCompleteModal, setShowProfileCompleteModal] = useState(false);
  const [profileCompleteModalLayout, setProfileCompleteModalLayout] = useState('basics');

  const categoriesTabs: { id: 'bookmarks' | 'watched'; label: string; Icon?: LucideIcon }[] = [
    { id: 'bookmarks', label: t('bookmarks'), Icon: BookmarkIcon },
    { id: 'watched', label: t('watched'), Icon: Eye },
  ];

  const handleModifyClick = (layout: keyof typeof TProfileCompleteLayout) => {
    setProfileCompleteModalLayout(layout);
    setShowProfileCompleteModal(true);
  };

  const fetchBookmarks = async () => {
    setLoadingBookmarks(true);
    try {
      const response = await fetch(`/api/users/${user?.id}/bookmarks`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      const data = await response.json();
      setBookmarksData(data.bookmarks);
    } catch (error) {
      // console.error('Error fetching bookmarks:', error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const fetchWatched = async () => {
    setLoadingWatched(true);
    try {
      const response = await fetch(`/api/users/${user?.id}/watched`);
      if (!response.ok) {
        throw new Error('Failed to fetch watched movies');
      }
      const data = await response.json();
      setWatchedData(data.watched);
    } catch (error) {
      // console.error('Error fetching watched movies:', error);
    } finally {
      setLoadingWatched(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookmarks();
      fetchWatched();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return loading || globalLoading || !user ? (
    <Loading />
  ) : (
    <div className="bg-card shadow-primary/20 m-4 rounded-md border p-4 shadow-xs">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={framerMotion}
        className="flex flex-col items-stretch space-y-4"
      >
        <DialogProfileModify
          show={showProfileCompleteModal}
          setShow={setShowProfileCompleteModal}
          startLayout={profileCompleteModalLayout as keyof typeof TProfileCompleteLayout}
        />

        {/* PROFILE GRID */}
        <motion.div
          variants={slideFromBottom}
          className={clsx(
            'grid gap-4',
            'auto-rows-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          )}
        >
          {/* HEADER */}
          <div>
            <HeaderWrapper
              photoURL={user?.photos[0]}
              nickname={user?.nickname ?? '???'}
              firstName={user?.firstname ?? '???'}
              lastName={user?.lastname ?? '???'}
              loading={false}
              modifiable
              onModify={handleModifyClick}
            />
          </div>
          {/* DESCRIPTION */}
          <div>
            <DescriptionWrapper
              text={user?.biography}
              modifiable
              onModify={() =>
                handleModifyClick('description' as keyof typeof TProfileCompleteLayout)
              }
            />
          </div>

          {/* LOCATION & LANG */}
          <div className="flex flex-col gap-4">
            <LocationWrapper
              address={user?.address}
              modifiable
              onModify={() => handleModifyClick('location' as keyof typeof TProfileCompleteLayout)}
            />
            <PrefLangWrapper
              lang={user?.preferred_language}
              modifiable
              onModify={() =>
                handleModifyClick('preferred_language' as keyof typeof TProfileCompleteLayout)
              }
            />
          </div>

          {/* STATUS */}
          <div className="flex flex-col justify-between gap-4 lg:flex-row xl:flex-col xl:justify-start">
            <StatusWrapper confirmed={user?.confirmed} />
            <LastModificationWrapper date={user?.last_action} />
          </div>
        </motion.div>

        {/* Bookmarks & Watchlist */}
        <motion.div variants={slideFromBottom} className={'flex flex-col'}>
          <CategoryToggler tabs={categoriesTabs} category={category} setCategory={setCategory} />
          {/* Movies sector */}
          <div className="w-full">
            <div
              key={category}
              className="smooth42transition flex flex-wrap items-center justify-center gap-5 pt-4 align-middle"
            >
              {(category === 'bookmarks' ? bookmarksData : watchedData)?.length === 0 &&
                !(loading || (category === 'bookmarks' ? loadingBookmarks : loadingWatched)) && (
                  <div className="text-muted-foreground w-full py-10 text-center text-lg font-medium">
                    {category === 'bookmarks'
                      ? t('no-bookmarks-available')
                      : t('no-watched-available')}
                  </div>
                )}

              {(category === 'bookmarks' ? bookmarksData : watchedData)?.map((movie, index) => (
                <motion.div
                  variants={slideFromBottom}
                  key={`${movie.id}-${index}`}
                  className="flex justify-center self-center"
                >
                  <MovieThumbnail movieBasics={movie} loading={false} />
                </motion.div>
              ))}
            </div>

            {(loading || (category === 'bookmarks' ? loadingBookmarks : loadingWatched)) && (
              <div className="m-5 flex flex-col items-center gap-5">
                <Spinner size={21} />
                <p className="animate-pulse text-base leading-[19px] font-normal">{t(`loading`)}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
