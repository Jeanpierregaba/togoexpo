import { siteUrl } from '@/lib/site';

// Module serveur ET client : pas de 'use client' ici, sinon `LANGS`/`isLang`
// deviennent des références client et `generateStaticParams` casse au build.
// Le hook `useLang` vit dans `./useLang` (client).

export const LANGS = [
  { code: 'fr', label: 'Français', short: 'FR', locale: 'fr_FR', dateLocale: 'fr-FR', htmlLang: 'fr-FR' },
  { code: 'en', label: 'English', short: 'EN', locale: 'en_US', dateLocale: 'en-US', htmlLang: 'en-US' },
  { code: 'ja', label: '日本語', short: 'JA', locale: 'ja_JP', dateLocale: 'ja-JP', htmlLang: 'ja-JP' },
] as const;

export type Lang = (typeof LANGS)[number]['code'];
export const DEFAULT_LANG: Lang = 'fr';

export function isLang(s: string | undefined): s is Lang {
  return s === 'fr' || s === 'en' || s === 'ja';
}

/** Langue sûre depuis un paramètre de route (`params.lang`). */
export function toLang(s: string | undefined): Lang {
  return isLang(s) ? s : DEFAULT_LANG;
}

/** Code attendu par WPGraphQL/Polylang (`LanguageCodeFilterEnum`). */
export function wpLanguage(lang: Lang): 'FR' | 'EN' | 'JA' {
  return lang.toUpperCase() as 'FR' | 'EN' | 'JA';
}

/** Slug de référence FR d'un contenu traduit (`osaka-2025-en` -> `osaka-2025`). */
export function baseSlug(slug: string): string {
  return slug.replace(/-(en|ja)$/, '');
}

/** Slug Polylang d'un contenu dans une langue (`osaka-2025` + en -> `osaka-2025-en`). */
export function langSlug(slug: string, lang: Lang): string {
  const base = baseSlug(slug);
  return lang === DEFAULT_LANG ? base : `${base}-${lang}`;
}

function splitHash(path: string): [string, string] {
  const i = path.indexOf('#');
  return i >= 0 ? [path.slice(0, i), path.slice(i)] : [path, ''];
}

/** Préfixe les liens internes avec la langue. Externes et ancres pures inchangés. */
export function localizePath(path: string, lang: Lang): string {
  if (/^(https?:|mailto:|tel:)/.test(path) || path.startsWith('#')) return path;
  const [base, hash] = splitHash(path);
  const clean = base === '' ? '/' : base;
  return `/${lang}${clean === '/' ? '' : clean}${hash}`;
}

/** Bascule de langue en conservant la page (mappe les slugs -en/-ja). */
export function switchPath(pathname: string, target: Lang): string {
  const [base, hash] = splitHash(pathname);
  const segs = base.split('/').filter(Boolean);
  if (segs.length > 0 && isLang(segs[0])) segs.shift();
  const mapped = segs.map((s) => langSlug(s, target));
  return `/${target}${mapped.length > 0 ? `/${mapped.join('/')}` : ''}${hash}`;
}

/** Préfixe simple pour les composants serveur connaissant déjà la langue. */
export function lz(path: string, lang: Lang): string {
  return localizePath(path, lang);
}

/** Canonical + hreflang pour les metadata (pages serveur). */
export function langAlternates(path: string, lang: Lang): { canonical: string; languages: Record<string, string> } {
  const base = siteUrl();
  const clean = path === '/' ? '' : path;
  const languages: Record<string, string> = {};
  for (const l of LANGS) languages[l.code] = `${base}/${l.code}${clean}`;
  languages['x-default'] = `${base}/${DEFAULT_LANG}${clean}`;
  return { canonical: `${base}/${lang}${clean}`, languages };
}

/**
 * Canonical + hreflang d'un contenu traduit : chaque langue pointe vers SON slug.
 * `prefix` = '/editions' ou '/actualites', `slug` = slug courant (toute langue).
 */
export function slugAlternates(
  prefix: string,
  slug: string,
  lang: Lang,
): { canonical: string; languages: Record<string, string> } {
  const base = siteUrl();
  const languages: Record<string, string> = {};
  for (const l of LANGS) languages[l.code] = `${base}/${l.code}${prefix}/${langSlug(slug, l.code)}`;
  languages['x-default'] = `${base}/${DEFAULT_LANG}${prefix}/${langSlug(slug, DEFAULT_LANG)}`;
  return { canonical: `${base}/${lang}${prefix}/${langSlug(slug, lang)}`, languages };
}
