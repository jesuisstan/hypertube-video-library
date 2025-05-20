'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import SkeletonDate from '@/components/skeletons/skeleton-date';
import { formatApiDateLastUpdate } from '@/utils/format-date';

const LastModificationWrapper = ({ date }: { date: string | null | undefined }) => {
  const t = useTranslations();
  const formatedLastActionDate = formatApiDateLastUpdate(date!);

  return (
    <div className="bg-card shadow-primary/20 relative rounded-md border p-5 shadow-xs">
      <div className="flex flex-col justify-start">
        <h3 className="text-base font-bold">{t(`last-modification`)}</h3>
        <div className="mt-4">
          <div className="flex items-center text-sm">
            {!date || formatedLastActionDate === t('invalid-date') ? (
              <SkeletonDate />
            ) : (
              <span className="flex items-center" title={formatedLastActionDate}>
                {formatedLastActionDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastModificationWrapper;
