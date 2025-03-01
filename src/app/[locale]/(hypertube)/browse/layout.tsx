'use client';

import React, { useState } from 'react';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import { CalendarArrowUp, ScanSearch, Star } from 'lucide-react';

import CategoryToggleWrapper from '@/components/wrappers/category-toggle-wrapper';
import { usePathname } from '@/i18n/routing';
import useUserStore from '@/stores/user';

//export const metadata: Metadata = {
//  title: 'Browse Hypertube',
//};

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const [category, setCategory] = useState(pathname.split('/browse/')[1] ?? 'popular');

  const tabs = [
    { id: 'top', label: t(`top-rated`), Icon: CalendarArrowUp },
    { id: 'popular', label: t(`popular`), Icon: Star },
    { id: 'custom', label: t(`custom-search`), Icon: ScanSearch },
  ];

  return (
    <div className="flex w-full flex-col">
      {user && (
        <div className="sticky top-0 z-10 flex items-center justify-center bg-background/90 p-4">
          <CategoryToggleWrapper tabs={tabs} category={category} setCategory={setCategory} />
        </div>
      )}
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default BrowseLayout;
