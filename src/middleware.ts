import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr', 'ru'],
  localePrefix: 'always',
  defaultLocale: 'en',
});

export async function middleware(req: NextRequest) {
  // Extract the token
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    raw: true, // Ensure raw token
  });

  // Normalize the pathname to exclude the locale prefix
  const normalizedPath = req.nextUrl.pathname.replace(/^\/(en|fr|ru)/, '');

  // Define public pages (excluding locale prefix)
  const isPublicPage = ['/authentication', '/email-confirmation', '/password-reset'].some((path) =>
    normalizedPath.startsWith(path)
  );

  // Redirect if token is missing and page is not public
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL('/authentication', req.url));
  }

  // Pass the request through the intlMiddleware
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
