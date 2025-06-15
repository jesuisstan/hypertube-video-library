'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import * as Avatar from '@radix-ui/react-avatar';
import clsx from 'clsx';

import FilledOrNot from '@/components/ui/filled-or-not';
import { getFlag } from '@/constants/popular-languages';
import { capitalize } from '@/utils/format-string';
import { getLanguageName } from '@/utils/language';

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
  const locale = useLocale() as 'en' | 'ru' | 'fr';

  return (
    <div className="bg-card shadow-primary/20 relative rounded-md border p-5 shadow-xs">
      <div className="flex flex-col justify-start">
        <h3 className="text-base font-bold">{t(`prefered-content-language`)}</h3>
        <div className="mt-4">
          <div className="flex items-center text-sm">
            {lang ? (
              <div
                className={clsx('flex flex-row items-center gap-2', modifiable && 'cursor-pointer')}
                onClick={onModify}
              >
                <Avatar.Root
                  className={
                    'border-foreground bg-foreground inline-flex items-center justify-center overflow-hidden rounded-full border-2 align-middle select-none'
                  }
                >
                  <Avatar.Image
                    className="h-5 w-5 rounded-[inherit] object-cover"
                    src={`/country-flags/${getFlag(getLanguageName(lang, locale), locale)?.toLowerCase()}.svg`}
                    alt="national-flag"
                  />
                </Avatar.Root>
                <span className="flex items-center">
                  {capitalize(getLanguageName(lang, locale))}
                </span>
              </div>
            ) : (
              <p className="italic">{t('data-incomplete')}</p>
            )}

            {modifiable && (
              <div className="absolute top-2 right-2 cursor-pointer" onClick={onModify}>
                <FilledOrNot size={15} filled={!!lang} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrefLangWrapper;
