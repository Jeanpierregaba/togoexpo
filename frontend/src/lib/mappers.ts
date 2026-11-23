import type { Lang } from '@/i18n/lang';
import type { ActuItem, Edition, EditionDetail, FuturEdition } from './editions';
import { MOCK_FUTUR } from './editions';

// Formes brutes WPGraphQL (champs nullables par nature).
export type WPEditionFields = {
  annee?: number | null;
  ville?: string | null;
  pays?: string | null;
  theme?: string | null;
  dateDebut?: string | null;
  dateFin?: string | null;
  videoUrl?: string | null;
  estEvenementFutur?: boolean | null;
};

export type WPEditionNode = {
  slug: string;
  title?: string;
  content?: string;
  editionFields?: WPEditionFields | null;
  featuredImage?: { node?: WPImage | null } | null;
};

export type HomeQuery = {
  editions?: { nodes: WPEditionNode[] } | null;
  posts?: { nodes: WPPostNode[] } | null;
};

export type EditionsQuery = {
  editions?: { nodes: WPEditionNode[] } | null;
};

export type EditionQuery = {
  edition?: WPEditionNode | null;
};

export type WPImage = { sourceUrl?: string | null; altText?: string | null };

export type WPTerm = { name?: string | null; slug?: string | null };

export type WPPostNode = {
  slug: string;
  title: string;
  date?: string | null;
  excerpt?: string | null;
  content?: string | null;
  categories?: { nodes?: WPTerm[] | null } | null;
  featuredImage?: { node?: WPImage | null } | null;
  language?: { code?: string | null } | null;
};

export type PostsQuery = {
  posts?: { nodes: WPPostNode[] } | null;
};

export type PostQuery = {
  post?: WPPostNode | null;
};

export type PostCategory = { name: string; slug: string };

export type PostListItem = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  categories: PostCategory[];
  image?: { src: string; alt: string };
  readingMinutes: number;
};

/** `lang` : langue de rédaction (Polylang), en minuscules ; absente si inconnue. */
export type PostDetail = PostListItem & { content: string; lang?: string };

export function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[^;\s]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function readingMinutesOf(text: string): number {
  const words = stripTags(text).split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const DATE_LOCALES: Record<string, string> = { fr: 'fr-FR', en: 'en-US', ja: 'ja-JP', sr: 'sr-Cyrl-RS' };

/** Date longue dans la locale de la langue courante (fr par défaut). */
export function formatDate(iso: string, lang: Lang = 'fr'): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(DATE_LOCALES[lang] ?? 'fr-FR', { dateStyle: 'long' }).format(d);
}

/** Catégories exploitables : la catégorie technique « uncategorized » créée par
 *  WordPress à l'installation n'est jamais affichée. */
function toCategories(cats?: { nodes?: WPTerm[] | null } | null): PostCategory[] {
  return (cats?.nodes ?? []).flatMap((c) =>
    c?.name && c.slug && !c.slug.startsWith('uncategorized') ? [{ name: c.name, slug: c.slug }] : [],
  );
}

function toImage(img?: { node?: WPImage | null } | null, fallbackAlt = ''): { src: string; alt: string } | undefined {
  const src = img?.node?.sourceUrl;
  if (!src) return undefined;
  return { src, alt: img?.node?.altText || fallbackAlt };
}

export function toPosts(nodes: WPPostNode[] | undefined): PostListItem[] {
  return (nodes ?? [])
    .filter((p) => Boolean(p.slug))
    .map((p) => ({
      slug: p.slug,
      title: stripTags(p.title ?? ''),
      date: p.date ?? '',
      excerpt: stripTags(p.excerpt ?? '').slice(0, 200),
      categories: toCategories(p.categories),
      image: toImage(p.featuredImage, p.title),
      readingMinutes: readingMinutesOf(`${p.title ?? ''} ${p.excerpt ?? ''} ${p.content ?? ''}`),
    }));
}

export function mapPostDetail(p: WPPostNode): PostDetail | null {
  if (!p.slug) return null;
  return {
    slug: p.slug,
    title: stripTags(p.title ?? ''),
    date: p.date ?? '',
    excerpt: stripTags(p.excerpt ?? ''),
    categories: toCategories(p.categories),
    image: toImage(p.featuredImage, p.title),
    readingMinutes: readingMinutesOf(`${p.title ?? ''} ${p.content ?? ''}`),
    content: p.content ?? '',
    lang: p.language?.code?.toLowerCase() || undefined,
  };
}

export function mapEditionNode(n: WPEditionNode): Edition | null {
  const f = n.editionFields;
  if (!n.slug || !f || f.annee == null || !f.ville) return null;
  return {
    slug: n.slug,
    annee: f.annee,
    ville: f.ville,
    pays: f.pays ?? '',
    theme: f.theme ?? '',
  };
}

export function toEditions(nodes: WPEditionNode[] | undefined): Edition[] {
  return (nodes ?? [])
    .map(mapEditionNode)
    .filter((e): e is Edition => e !== null)
    .sort((a, b) => b.annee - a.annee);
}

export function toActus(nodes: { slug: string; title: string }[] | undefined): ActuItem[] {
  return (nodes ?? [])
    .filter((p) => Boolean(p.slug))
    .map((p) => ({ slug: p.slug, title: p.title }));
}

// Prochains rendez-vous : éditions marquées futures en CMS, triées par date d’ouverture.
export function toUpcoming(nodes: WPEditionNode[] | undefined): EditionDetail[] {
  return (nodes ?? [])
    .filter((n) => n.editionFields?.estEvenementFutur === true)
    .map((n) => mapEditionDetail(n.slug, n))
    .filter((e): e is EditionDetail => e !== null)
    .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut));
}

// Édition pilote : flag WP, sinon fallback mock documenté.
export function toFutur(nodes: WPEditionNode[] | undefined): FuturEdition {
  const n = (nodes ?? []).find((x) => x.editionFields?.estEvenementFutur === true);
  const f = n?.editionFields;
  if (n && f && f.ville && f.annee != null && f.dateFin) {
    return {
      ville: f.ville,
      pays: f.pays ?? '',
      annee: f.annee,
      theme: f.theme ?? '',
      dateDebut: f.dateDebut ?? undefined,
      dateFin: f.dateFin,
    };
  }
  return MOCK_FUTUR;
}

export function mapEditionDetail(slug: string, n: WPEditionNode): EditionDetail | null {
  const f = n.editionFields;
  if (!f || f.annee == null || !f.ville) return null;
  const src = n.featuredImage?.node?.sourceUrl;
  return {
    slug,
    annee: f.annee,
    ville: f.ville,
    pays: f.pays ?? '',
    theme: f.theme ?? '',
    dateDebut: f.dateDebut ?? '',
    dateFin: f.dateFin ?? '',
    pavillon: (n.content ?? '').trim(),
    videoUrl: f.videoUrl ?? undefined,
    image: src ? { src, alt: n.featuredImage?.node?.altText || `${f.ville} ${f.annee}` } : undefined,
  };
}
