'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import AutoCarousel from '@/components/ui/carousel/auto-carousel';
import DashboardSkeleton from '@/components/ui/skeletons/dashboard-skeleton';
import { useRouter } from '@/i18n/routing';
import useUserStore from '@/stores/user';
import { slides } from '../../authentication/(components)/logos-slides';

const Dashboard = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);

  return !user ? (
    <DashboardSkeleton />
  ) : (
    <div>
      CONTENT
      {/*<AutoCarousel data={slides} direction="vertical" interval={1000} />*/}
      <AutoCarousel
        title={'Example Carousel'}
        direction="vertical"
        interval={2000}
        items={slides}
      />
    </div>
  );
};

export default Dashboard;
