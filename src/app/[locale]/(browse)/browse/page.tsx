'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import BrowseSkeleton from '@/components/ui/skeletons/browse-skeleton';
import useUserStore from '@/stores/user';

const Browse = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);

  return !user ? (
    <BrowseSkeleton />
  ) : (
    <div className="flex flex-col items-center gap-10">
      CONTENT
    </div>
  );
};

export default Browse;
