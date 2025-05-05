'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { PencilLine } from 'lucide-react';

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
    <div className="bg-card shadow-primary/20 relative rounded-2xl p-5 shadow-md">
      <div className="flex flex-col justify-start">
        <h3 className="text-base font-bold">{t(`location`)}</h3>
        <div className="mt-4">
          <div className="flex items-center text-sm">
            {address ? (
              <span className="flex items-center gap-2">{address}</span>
            ) : (
              <p className="italic">{t('data-incomplete')}</p>
            )}

            {modifiable && (
              <div className={'absolute top-2 right-2 flex gap-1'}>
                <FilledOrNot size={15} filled={!!address} />
                <div
                  className={'text-foreground smooth42transition opacity-60 hover:opacity-100'}
                  title={t('click-to-modify')}
                >
                  <PencilLine size={15} onClick={onModify} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationWrapper;
