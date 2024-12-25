'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import DashboardSkeleton from '@/components/ui/skeletons/dashboard-skeleton';
import { useRouter } from '@/i18n/routing';
import useUserStore from '@/stores/user';

const Dashboard = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  return !user ? <DashboardSkeleton /> : <div>CONTENT</div>;
};

export default Dashboard;
