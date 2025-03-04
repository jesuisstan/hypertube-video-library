'use client';

import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

import Loading from '@/app/loading';
import FilterDrawer from '@/components/filter-sort/filter-drawer';
import MovieThumbnail from '@/components/movie-cards/movie-thumbnail';
import SelectSingle from '@/components/ui/select-dropdown/select-single';
import { Separator } from '@/components/ui/separator';
import Spinner from '@/components/ui/spinner';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { framerMotion, slideFromBottom } from '@/styles/motion-variants';
import { TMovieBasics } from '@/types/movies';

const BrowseCustom = () => {
  const category = 'custom';
  const t = useTranslations();
  const localeActive = useLocale();
  const user = useUserStore((state) => state.user);

  return !user ? <Loading /> : <div className="">Custom search</div>;
};

export default BrowseCustom;
