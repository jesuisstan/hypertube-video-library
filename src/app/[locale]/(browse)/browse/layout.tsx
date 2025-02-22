'use client';

import React, { useState } from 'react';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import { CalendarArrowUp, ScanSearch, Star } from 'lucide-react';

import CategoryToggleWrapper from '@/components/wrappers/category-toggle-wrapper';
import { usePathname } from '@/i18n/routing';

//export const metadata: Metadata = {
//  title: 'Browse Hypertube',
//};

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const [category, setCategory] = useState(pathname.split('/browse/')[1] ?? 'popular');

  const tabs = [
    { id: 'top', label: t(`top-rated`), Icon: CalendarArrowUp },
    { id: 'popular', label: t(`popular`), Icon: Star },
    { id: 'custom', label: t(`custom-search`), Icon: ScanSearch },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center">
        <CategoryToggleWrapper tabs={tabs} category={category} setCategory={setCategory} />
      </div>
      {children}
    </div>
  );
};

export default BrowseLayout;
