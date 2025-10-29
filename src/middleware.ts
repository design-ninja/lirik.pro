import { defineMiddleware } from 'astro:middleware';
import { DEFAULT_LOCALE, getLocalizedPath, isSupportedLocale, parseAcceptLanguage, type Locale } from './utils/i18n';

const ASSET_PREFIXES = ['/_astro', '/_image', '/assets', '/favicon', '/robots', '/sitemap', '/rss', '/manifest'];

function shouldBypass(pathname: string) {
  if (pathname === '/' || pathname === '') {
    return false;
  }
  if (ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }
  return pathname.includes('.') && !pathname.endsWith('.html');
}

function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && isSupportedLocale(first)) {
    return first;
  }
  return null;
}

const acceptLanguageRedirect = defineMiddleware(async (context, next) => {
  const { request, url } = context;
  const { pathname } = url;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return next();
  }

  if (shouldBypass(pathname)) {
    return next();
  }

  const requestedLocale = getLocaleFromPath(pathname);
  if (requestedLocale) {
    return next();
  }

  const preferredLocale = parseAcceptLanguage(request.headers.get('accept-language'));

  if (preferredLocale && preferredLocale !== DEFAULT_LOCALE) {
    const redirectUrl = new URL(url);
    redirectUrl.pathname = getLocalizedPath(pathname, preferredLocale);
    return Response.redirect(redirectUrl.toString(), 302);
  }

  return next();
});

export const onRequest = acceptLanguageRedirect;
