'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import FilledOrNot from '@/components/ui/filled-or-not';

const LocationWrapper = ({
  address,
  modifiable,
  onModify,
}: {
  address: string | null | undefined;
  modifiable?: boolean;
  onModify?: () => void;
}) => {
  const t = useTranslations();

  return (
    <div className="bg-card shadow-primary/20 relative rounded-md border p-5 shadow-xs">
      <div className="flex flex-col justify-start">
        <h3 className="text-base font-bold">{t(`location`)}</h3>
        <div className="mt-4">
          <div className="flex items-center text-sm">
            <div className={clsx(modifiable && 'cursor-pointer')} onClick={onModify}>
              {address ? (
                <span className="flex items-center gap-2">{address}</span>
              ) : (
                <p className="italic">{t('data-incomplete')}</p>
              )}
            </div>

            {modifiable && (
              <div className="absolute top-2 right-2 flex cursor-pointer gap-1" onClick={onModify}>
                <FilledOrNot size={15} filled={!!address} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationWrapper;
