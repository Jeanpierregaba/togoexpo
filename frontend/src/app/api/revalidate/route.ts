import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { LANGS } from '@/i18n/lang';

// Webhook appelé par WordPress à chaque publication (ou manuellement) :
// POST /api/revalidate?secret=XXX  avec REVALIDATE_SECRET côté front.
// Sans ce webhook, les contenus WP arrivent via ISR (300s max).
// Le secret peut aussi venir de l'en-tête `x-revalidate-secret` (préférable :
// il n'apparaît pas dans les journaux d'accès). Le corps JSON optionnel
// `{ "slug": "..." }` purge en plus la page de l'article modifié.
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = req.headers.get('x-revalidate-secret') ?? searchParams.get('secret');
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'Secret invalide.' }, { status: 401 });
  }
  // Chaque langue a ses propres pages statiques : on purge les trois.
  const paths = LANGS.flatMap((l) => [
    `/${l.code}`,
    `/${l.code}/editions`,
    `/${l.code}/actualites`,
    `/${l.code}/mediatheque`,
  ]);
  let slug = '';
  try {
    const body = (await req.json()) as { slug?: unknown };
    if (typeof body.slug === 'string' && /^[a-z0-9-]{1,200}$/.test(body.slug)) slug = body.slug;
  } catch {
    // Corps absent ou non JSON : purge des listes seulement.
  }
  const posts = slug ? LANGS.map((l) => `/${l.code}/actualites/${slug}`) : [];
  for (const path of [...paths, ...posts]) revalidatePath(path);
  revalidatePath('/sitemap.xml');
  return NextResponse.json({ ok: true, revalidated: [...paths, ...posts, '/sitemap.xml'] });
}
