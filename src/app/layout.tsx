import React from 'react';
import type { Metadata } from 'next';
import { Exo_2 as GFont } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { Analytics } from '@vercel/analytics/next';
import clsx from 'clsx';

import '@/styles/globals.css';
import NextAuthProvider from '@/components/providers/next-auth-provider';
import ThemeProvider from '@/components/providers/theme-provider';
import { Locale, routing } from '@/i18n/routing';

const font = GFont({
  subsets: ['latin', 'cyrillic'],
  weight: ['500'],
  style: ['normal'],
  //preload: false,
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

/* (!) To avoid hydration warnings, add suppressHydrationWarning to <html>, because next-themes updates that element.
    This property only applies one level deep, so it won't block hydration warnings on other elements. */
const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) => {
  const { locale } = await params;
  //if (!routing.locales.includes(locale as Locale)) {
  //  notFound();
  //}

  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={locale}>
      {/* dev tool to control rerendering the elements */}
      {process.env.NODE_ENV === 'development' && (
        <head>
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
        </head>
      )}
      <body className={clsx(font.className, 'flex min-h-screen flex-col')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
              <Analytics />
            </NextIntlClientProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
