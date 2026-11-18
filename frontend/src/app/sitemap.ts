import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';
import { wpQuery } from '@/lib/wp';
import { GET_EDITIONS, GET_POSTS } from '@/graphql/queries';
import type { EditionsQuery, PostsQuery } from '@/lib/mappers';
import { LANGS, wpLanguage, type Lang } from '@/i18n/lang';

export const revalidate = 300;

const STATIC_PATHS = ['/', '/togo', '/a-propos', '/editions', '/editions/yokohama-2027', '/editions/belgrade-2027', '/actualites', '/mediatheque', '/contact', '/mentions-legales'];

/** Entrées statiques d'une langue, avec les équivalents hreflang. */
function staticsFor(base: string, lang: Lang): MetadataRoute.Sitemap {
  return STATIC_PATHS.map((p) => {
    const clean = p === '/' ? '' : p;
    return {
      url: `${base}/${lang}${clean}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      alternates: {
        languages: Object.fromEntries(LANGS.map((l) => [l.code, `${base}/${l.code}${clean}`])),
      },
    };
  });
}

/** Contenus CMS d'une langue (slugs Polylang propres à chaque langue). */
async function cmsFor(base: string, lang: Lang): Promise<MetadataRoute.Sitemap> {
  try {
    const [e, p] = await Promise.all([
      wpQuery<EditionsQuery>(GET_EDITIONS, { language: wpLanguage(lang) }),
      wpQuery<PostsQuery>(GET_POSTS, { first: 100, language: wpLanguage(lang) }),
    ]);
    const editions: MetadataRoute.Sitemap = (e.editions?.nodes ?? [])
      .filter((n) => Boolean(n.slug))
      .map((n) => ({
        url: `${base}/${lang}/editions/${n.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
      }));
    const posts: MetadataRoute.Sitemap = (p.posts?.nodes ?? [])
      .filter((n) => Boolean(n.slug))
      .map((n) => ({
        url: `${base}/${lang}/actualites/${n.slug}`,
        lastModified: n.date ? new Date(n.date) : new Date(),
        changeFrequency: 'monthly' as const,
      }));
    return [...editions, ...posts];
  } catch {
    // CMS injoignable : on publie au moins les pages statiques.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const perLang = await Promise.all(
    LANGS.map(async (l) => [...staticsFor(base, l.code), ...(await cmsFor(base, l.code))]),
  );
  return perLang.flat();
}
