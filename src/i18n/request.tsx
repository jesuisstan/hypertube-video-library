import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

// Can be imported from a shared config
export const locales = ['en', 'ru', 'fr'] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default,
  };
});
