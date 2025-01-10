'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import DateSkeleton from '@/components/ui/skeletons/date-skeleton';
import { formatApiDateLastUpdate } from '@/utils/format-date';

const LastActionWrapper = ({ date }: { date: string | null | undefined }) => {
  const t = useTranslations();
  const formatedLastActionDate = formatApiDateLastUpdate(date!);

  return (
    <div className="relative rounded-2xl bg-card p-5 shadow-md shadow-primary/20">
      <div className="flex flex-col justify-start">
        <h3 className="text-xl font-bold">{t(`last-action`)}</h3>
        <div className="mt-4">
          <div className="flex items-center">
            {!date || formatedLastActionDate === t('invalid-date') ? (
              <DateSkeleton />
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

export default LastActionWrapper;
