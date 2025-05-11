'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import * as Avatar from '@radix-ui/react-avatar';

import FilledOrNot from '@/components/ui/filled-or-not';
import {
  popularLanguagesOptionsEN,
  popularLanguagesOptionsFR,
  popularLanguagesOptionsRU,
} from '@/constants/popular-languages';

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

  // Determine the correct language options array based on the locale
  const languageOptions =
    locale === 'en'
      ? popularLanguagesOptionsEN
      : locale === 'fr'
        ? popularLanguagesOptionsFR
        : popularLanguagesOptionsRU;

  // Find the label for the current lang
  const languageLabel =
    languageOptions.find((option) => option.value.toLowerCase() === lang)?.label || lang;

  return (
    <div className="bg-card shadow-primary/20 relative rounded-md p-5 shadow-md">
      <div className="flex flex-col justify-start">
        <h3 className="text-base font-bold">{t(`prefered-content-language`)}</h3>
        <div className="mt-4">
          <div className="flex items-center text-sm">
            {lang ? (
              <div className="flex cursor-pointer flex-row items-center gap-2" onClick={onModify}>
                <Avatar.Root
                  className={
                    'border-foreground bg-foreground inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 align-middle select-none'
                  }
                >
                  <Avatar.Image
                    className="h-5 w-5 rounded-[inherit] object-cover"
                    src={`/country-flags/${lang?.toLowerCase()}.svg`}
                    alt="national-flag"
                  />
                </Avatar.Root>
                <span className="flex items-center">{languageLabel}</span>
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
