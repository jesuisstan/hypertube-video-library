'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Microscope, ScanSearch, UserRoundCog } from 'lucide-react';

import DashboardSkeleton from '@/components/ui/skeletons/dashboard-skeleton';
import { useRouter } from '@/navigation';
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
    </div>
  );
};

export default Dashboard;
