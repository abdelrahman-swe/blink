import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";

const locales = ["en", "ar"] as const;
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  // 1) Cookie wins if valid
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // 2) Otherwise detect from Accept-Language
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  try {
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    // Filter out '*' because @formatjs/intl-localematcher crashes on it
    const filteredLanguages = languages.filter(lang => lang !== '*');
    
    if (filteredLanguages.length === 0) {
      return defaultLocale;
    }

    return match(filteredLanguages, locales as unknown as string[], defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore Next.js internals, API routes, and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // If URL already has locale, persist cookie and continue
  if (pathnameHasLocale) {
    const localeInPath = pathname.split("/")[1];

    // Protected Routes Logic
    const protectedPaths = ['/profile', '/favorite', '/favourite'];
    const pathWithoutLocale = '/' + pathname.split('/').slice(2).join('/');
    
    // Check if the current path is protected (matches exactly or is a sub-path)
    const isProtected = protectedPaths.some(path => 
      pathWithoutLocale === path || pathWithoutLocale.startsWith(path + '/')
    );
    
    const token = request.cookies.get('token')?.value;

    if (isProtected && !token) {
      const loginUrl = new URL(`/${localeInPath}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // If they are on login/register but already have a token, redirect to home
    const authPaths = ['/login', '/register'];
    const isAuthPath = authPaths.some(path => 
      pathWithoutLocale === path || pathWithoutLocale.startsWith(path + '/')
    );
    if (isAuthPath && token) {
      return NextResponse.redirect(new URL(`/${localeInPath}/home`, request.url));
    }

    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", localeInPath, {
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  }

  // Otherwise detect locale and redirect to /{locale}/home
  const locale = getLocale(request);
  const response = NextResponse.redirect(
    new URL(`/${locale}/home`, request.url)
  );

  response.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Files with extensions (.png, .jpg, .svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
