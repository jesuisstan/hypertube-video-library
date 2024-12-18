//'use strict';

import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Exo_2 as GFont } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import clsx from 'clsx';

import '@/styles/globals.css';
import ThemeProvider from '@/components/providers/theme-provider';
import { Locale, routing } from '@/i18n/routing';

//const ThemeProvider = dynamic(() => import('@/components/providers/theme-provider'), {
//  ssr: false,
//});

const font = GFont({
  subsets: ['latin', 'cyrillic'],
  weight: ['500'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: 'Hypertube',
  description: 'Your video library',
  icons: {
    icon: ['/favicon.ico'],
    apple: ['/apple-touch-icon.png'],
    shortcut: ['/apple-touch-icon.png'],
  },
};

/* Note! To avoid hydration warnings, add suppressHydrationWarning to <html>, because next-themes updates that element.
    This property only applies one level deep, so it won't block hydration warnings on other elements. */
const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) => {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={locale}>
      <body className={clsx(font.className, 'flex min-h-screen flex-col')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
