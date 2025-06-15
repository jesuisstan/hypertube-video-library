'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User } from 'next-auth';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { BookmarkIcon, Eye, LucideIcon } from 'lucide-react';

import Loading from '@/app/loading';
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

const UserPage = () => {
  const t = useTranslations();
  const { id: userProfileId } = useParams(); // Grab the id from the dynamic route
  const currentUser = useUserStore((state) => state.user);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const globalLoading = useUserStore((state) => state.globalLoading);
  const [category, setCategory] = useState<'bookmarks' | 'watched'>('bookmarks');
  const [loading, setLoading] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [loadingWatched, setLoadingWatched] = useState(false);
  const [bookmarksData, setBookmarksData] = useState<TMovieBasics[]>([]);
  const [watchedData, setWatchedData] = useState<TMovieBasics[]>([]);

  const categoriesTabs: { id: 'bookmarks' | 'watched'; label: string; Icon?: LucideIcon }[] = [
    { id: 'bookmarks', label: t('bookmarks'), Icon: BookmarkIcon },
    { id: 'watched', label: t('watched'), Icon: Eye },
  ];

  const fetchBookmarks = async () => {
    setLoadingBookmarks(true);
    try {
      const response = await fetch(`/api/users/${userProfileId}/bookmarks`);
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
      const response = await fetch(`/api/users/${userProfileId}/watched`);
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

  const fetchUserProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userProfileId}`);
      const data = await response.json();
      // console.log('User profile data:', data); // debug
      setUserProfile(data);
    } catch (error) {
      // console.error('Error getting user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile data on component mount
  useEffect(() => {
    if (userProfileId) {
      fetchUserProfileData();
      fetchBookmarks();
      fetchWatched();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading || globalLoading || !userProfileId || !userProfile ? (
    <Loading />
  ) : (
    <div className="bg-card shadow-primary/20 m-4 rounded-md border p-4 shadow-xs">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={framerMotion}
        className="flex flex-col items-stretch space-y-4"
      >
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
              photoURL={userProfile?.photos[0]}
              nickname={userProfile?.nickname ?? '???'}
              firstName={userProfile?.firstname ?? '???'}
              lastName={userProfile?.lastname ?? '???'}
              loading={false}
            />
          </div>
          {/* DESCRIPTION */}
          <div>
            <DescriptionWrapper text={userProfile?.biography} />
          </div>

          {/* LOCATION & LANG */}
          <div className="flex flex-col gap-4">
            <LocationWrapper address={userProfile?.address} />
            <PrefLangWrapper lang={userProfile?.preferred_language} />
          </div>

          {/* STATUS */}
          <div className="flex flex-col justify-between gap-4 lg:flex-row xl:flex-col xl:justify-start">
            <StatusWrapper confirmed={userProfile?.confirmed} />
            <LastModificationWrapper date={userProfile?.last_action} />
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

export default UserPage;
