'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { PencilLine } from 'lucide-react';

import FilledOrNot from '@/components/ui/filled-or-not';

const PrefLangWrapper = ({
  lang,
  modifiable,
  onModify,
}: {
  lang: string | null | undefined;
  modifiable?: boolean;
  onModify?: () => void;
}) => {
  const t = useTranslations();

  return (
    <div className="relative rounded-2xl bg-card p-5 shadow-md">
      <div className="flex flex-col justify-start">
        <h3 className="text-xl font-bold">{t(`prefered-content-language`)}</h3>
        <div className="mt-4">
          <div className="flex items-center">
            {lang ? (
              <span className="flex items-center gap-2">{lang}</span>
            ) : (
              <p className="italic">{t('data-incomplete')}</p>
            )}

            {modifiable && (
              <div className={'absolute right-2 top-2 flex gap-1'}>
                <FilledOrNot size={15} filled={!!lang} />
                <div
                  className={'text-foreground opacity-60 smooth42transition hover:opacity-100'}
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

export default PrefLangWrapper;
