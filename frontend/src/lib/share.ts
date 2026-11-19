import type { Metadata } from 'next';
import { getDictionary } from '@/i18n/dict';
import { LANGS, type Lang } from '@/i18n/lang';

type ShareImage = { src: string; alt: string };

/** Image d'aperçu par défaut (générée par `npm run og`). */
export function defaultShareImage(lang: Lang): ShareImage {
  return { src: `/og/togoexpo-${lang}.jpg`, alt: getDictionary(lang).meta.ogTitle };
}

/**
 * Ajoute à une page ce que lisent WhatsApp, Facebook, LinkedIn, X… quand on
 * partage son lien : titre, description, adresse et image (celle de la page,
 * sinon l'image TogoExpo). Sans cela, chaque page reprendrait l'aperçu de
 * l'accueil, défini dans le layout.
 */
export function withShare(
  lang: Lang,
  meta: Metadata,
  opts: { title?: string; description?: string; image?: ShareImage } = {},
): Metadata {
  const raw = typeof meta.title === 'string' ? meta.title : '';
  const title = opts.title ?? (raw.includes('TogoExpo') ? raw : `${raw} | TogoExpo`);
  const description = opts.description ?? meta.description ?? undefined;
  const url = typeof meta.alternates?.canonical === 'string' ? meta.alternates.canonical : undefined;
  const img = opts.image ?? defaultShareImage(lang);
  const images = [{ url: img.src, alt: img.alt, ...(opts.image ? {} : { width: 1200, height: 630 }) }];
  return {
    ...meta,
    openGraph: {
      type: 'website',
      siteName: 'TogoExpo',
      locale: LANGS.find((l) => l.code === lang)?.locale,
      title,
      description,
      url,
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}
