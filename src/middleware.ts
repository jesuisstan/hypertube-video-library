import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "fr", "ru"],
  localePrefix: "always",
  defaultLocale: "en",
});

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  console.log("!!!!!!!!!!!!! token", token); // debug
  const isPublicPage = ["/", "/authentication", "/email-confirmation", "/password-reset", "/dashboard"].some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL("/authentication", req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
