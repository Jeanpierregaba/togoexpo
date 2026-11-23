import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEDICATED_EDITIONS, DEFAULT_LANG, LANGS } from '@/i18n/lang';

// Emplacement imposé : avec un dossier `src/`, Next ne compile que `src/middleware.ts`.
// À la racine de `frontend/`, le fichier est ignoré sans erreur et `/` tombe en 404.
const CODES: string[] = LANGS.map((l) => l.code);

// La page /archives a été remplacée par /editions (spec 12), /comite par
// /a-propos (spec 35). On garde les anciennes URL en 308 pour ne pas casser les liens entrants et le SEO.
const MOVED: Record<string, string> = {
  '/archives': '/editions',
  '/comite': '/a-propos',
};

export function middleware(req: NextRequest) {
  const seg = req.nextUrl.pathname.split('/')[1];
  if (CODES.includes(seg)) {
    const rest = req.nextUrl.pathname.slice(seg.length + 1) || '/';
    const moved = MOVED[rest.replace(/\/+$/, '') || '/'];
    if (moved) {
      const url = req.nextUrl.clone();
      url.pathname = `/${seg}${moved}`;
      return NextResponse.redirect(url, 308);
    }
    // Belgrade et Yokohama ont une page dédiée, à la même adresse dans les trois
    // langues : l'ancienne forme suffixée (`belgrade-2027-en`) y renvoie.
    const ed = /^\/editions\/([a-z0-9-]+)-(?:en|ja|sr)\/?$/.exec(rest);
    if (ed && (DEDICATED_EDITIONS as readonly string[]).includes(ed[1])) {
      const url = req.nextUrl.clone();
      url.pathname = `/${seg}/editions/${ed[1]}`;
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname =
    req.nextUrl.pathname === '/' ? `/${DEFAULT_LANG}` : `/${DEFAULT_LANG}${req.nextUrl.pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|opengraph-image|.*\\..*).*)'],
};
