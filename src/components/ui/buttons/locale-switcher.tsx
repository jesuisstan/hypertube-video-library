'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';

import clsx from 'clsx';

import { usePathname } from '@/i18n/routing';

const LocaleSwitcher = () => {
  const [isPending, startTransition] = useTransition();
  const localeActive = useLocale();
  const pathname = usePathname();

  const handleLocaleChange = (locale: string) => {
    if (localeActive === locale || isPending) return;

    startTransition(() => {
      window.location.href = `/${locale}${pathname}`;
    });
  };

  return (
    <div className="flex space-x-4 self-center align-middle">
      <div
        className={clsx(
          `smooth42transition flex cursor-pointer items-center justify-center rounded-full border-[1px] px-[2px] py-[2px]`,
          `hover:border-c42orange`,
          localeActive === 'fr' ? 'border-foreground border-[1px]' : 'bg-card'
        )}
        title="Français"
        onClick={() => handleLocaleChange('fr')}
      >
        <div className="overflow-hidden rounded-full bg-transparent">
          <Image
            src={`/country-flags/fr.svg`}
            alt="national-flag"
            width={0}
            height={0}
            className={clsx(
              'h-5 w-5 object-cover',
              localeActive === 'fr' ? 'opacity-100' : 'opacity-70',
              `hover:opacity-100`
            )}
          />
        </div>
      </div>

      <div
        className={clsx(
          `smooth42transition flex cursor-pointer items-center justify-center rounded-full border-[1px] px-[2px] py-[2px]`,
          `hover:border-c42orange`,
          localeActive === 'en' ? 'border-foreground border-[1px]' : 'bg-card'
        )}
        title="English"
        onClick={() => handleLocaleChange('en')}
      >
        <div className="overflow-hidden rounded-full bg-transparent">
          <Image
            src={`/country-flags/gb.svg`}
            alt="national-flag"
            width={0}
            height={0}
            className={clsx(
              'h-5 w-5 object-cover',
              localeActive === 'en' ? 'opacity-100' : 'opacity-70',
              `hover:opacity-100`
            )}
          />
        </div>
      </div>

      <div
        className={clsx(
          `smooth42transition flex cursor-pointer items-center justify-center rounded-full border-[1px] px-[2px] py-[2px]`,
          `hover:border-c42orange`,
          localeActive === 'ru' ? 'border-foreground border-[1px]' : 'bg-card'
        )}
        title="Русский"
        onClick={() => handleLocaleChange('ru')}
      >
        <div className="overflow-hidden rounded-full bg-transparent">
          <Image
            src={`/country-flags/ru.svg`}
            alt="national-flag"
            width={0}
            height={0}
            className={clsx(
              'h-5 w-5 object-cover',
              localeActive === 'ru' ? 'opacity-100' : 'opacity-70',
              `hover:opacity-100`
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default LocaleSwitcher;
