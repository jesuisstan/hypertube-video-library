'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { ButtonHypertube } from '@/components/ui/buttons/button-hypertube';
import DashboardSkeleton from '@/components/ui/skeletons/dashboard-skeleton';
import { useRouter } from '@/i18n/routing';
import useUserStore from '@/stores/user';

const Dashboard = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  return !user ? (
    <DashboardSkeleton />
  ) : (
    <div>
      FUTURE CONTENT
      <ButtonHypertube onClick={() => router.push('/profile')} variant="default">
        {t('profile')}
      </ButtonHypertube>
    </div>
  );
};

export default Dashboard;
