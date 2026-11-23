import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MOCK_EDITIONS, MOCK_EDITIONS_EN, MOCK_EDITIONS_JA, MOCK_EDITIONS_SR, getMockEditionDetailLang } from '@/lib/editions';
import { EDITION_CREDITS, EDITION_DETAILS } from '@/lib/design';
import { formatDate, mapEditionDetail, stripTags, type EditionQuery, type EditionsQuery } from '@/lib/mappers';
import { wpQuery } from '@/lib/wp';
import { GET_EDITION, GET_EDITIONS } from '@/graphql/queries';
import { siteUrl } from '@/lib/site';
import { getDictionary } from '@/i18n/dict';
import { LANGS, baseSlug, isCmsLang, isLang, lz, slugAlternates, toLang, wpLanguage, type Lang } from '@/i18n/lang';
import { JsonLd } from '@/components/JsonLd';
import { ArchiveEdition } from '@/components/ArchiveEdition';
import { ARCHIVES, archiveContent, isArchiveSlug } from '@/lib/archives';
import { Reveal } from '@/components/Reveal';
import { fixedIn } from '@/i18n/fixed';
import { withShare } from '@/lib/share';

export const revalidate = 300;

const MOCK_BY_LANG: Record<Lang, typeof MOCK_EDITIONS> = {
  fr: MOCK_EDITIONS,
  en: MOCK_EDITIONS_EN,
  ja: MOCK_EDITIONS_JA,
  sr: MOCK_EDITIONS_SR,
};

// Appelé une fois par langue du segment parent : les slugs Polylang diffèrent par langue.
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const lang = toLang(params.lang);
  try {
    if (!isCmsLang(lang)) throw new Error('langue hors CMS');
    const res = await wpQuery<EditionsQuery>(GET_EDITIONS, { language: wpLanguage(lang) });
    const slugs = (res.editions?.nodes ?? []).map((n) => n.slug).filter(Boolean);
    if (slugs.length > 0) return slugs.map((slug) => ({ slug }));
  } catch {
    // CMS injoignable au build : fallback mock.
  }
  return MOCK_BY_LANG[lang].map((e) => ({ slug: e.slug }));
}

type Props = { params: { lang: string; slug: string } };

async function getEdition(slug: string, lang: Lang) {
  try {
    // Le slug est unique toutes langues confondues : pas de filtre `language` utile ici.
    const res = await wpQuery<EditionQuery>(GET_EDITION, { slug });
    if (res.edition) {
      const mapped = mapEditionDetail(slug, res.edition);
      if (mapped && mapped.pavillon) {
        // Pas d’image mise en avant en CMS : visuel vitrine statique (indexé sur le slug FR).
        if (!mapped.image) {
          const d = EDITION_DETAILS[baseSlug(slug)];
          if (d?.image) mapped.image = { src: d.image, alt: d.imageAlt ? fixedIn(d.imageAlt, lang) : `${mapped.ville} ${mapped.annee}` };
        }
        return mapped;
      }
    }
  } catch {
    // CMS injoignable : fallback mock ci-dessous.
  }
  return getMockEditionDetailLang(slug, lang);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang(params.lang);
  const t = getDictionary(lang);
  // Les quatre participations racontées (Dubaï, Milan, Shanghai, Hanovre) ont
  // leur propre récit : il sert aussi de titre et de description.
  const archive = baseSlug(params.slug);
  if (isArchiveSlug(archive)) {
    const c = archiveContent(archive, lang);
    return withShare(lang, {
      title: `${c.city} ${ARCHIVES[archive].year}`,
      description: c.lead,
      alternates: slugAlternates('/editions', params.slug, lang),
    }, { image: { src: ARCHIVES[archive].image, alt: fixedIn(ARCHIVES[archive].imageAlt, lang) } });
  }
  const edition = await getEdition(params.slug, lang);
  if (!edition) return { title: t.notFound.h1 };
  return withShare(lang, {
    title: `${edition.ville} ${edition.annee}`,
    description: `${edition.theme} — ${t.editionDetail.leadPrefix}${edition.ville} (${edition.pays}).`,
    alternates: slugAlternates('/editions', params.slug, lang),
  });
}

export default async function EditionPage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const t = getDictionary(lang);
  // Participations racontées : page dédiée, servie pour les trois langues et
  // pour les deux formes de slug (`milan-2015`, `milan-2015-en`).
  const archive = baseSlug(params.slug);
  if (isArchiveSlug(archive)) return <ArchiveEdition slug={archive} lang={lang} />;
  const edition = await getEdition(params.slug, lang);
  if (!edition) notFound();
  const credit = EDITION_CREDITS[baseSlug(params.slug)];
  const canonicalUrl = `${siteUrl()}/${lang}/editions/${params.slug}`;
  return (
    <article>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: `${t.media.pavillonOf}${edition.ville} ${edition.annee}`,
          description: edition.theme,
          inLanguage: LANGS.find((l) => l.code === lang)?.htmlLang,
          startDate: edition.dateDebut || undefined,
          endDate: edition.dateFin || undefined,
          location: { '@type': 'Place', name: `${edition.ville}, ${edition.pays}` },
          organizer: { '@type': 'Organization', name: 'TogoExpo', url: siteUrl() },
          url: canonicalUrl,
        }}
      />
      <section aria-labelledby="edition-title" className="bg-ink px-5 pb-14 pt-36 text-cream sm:px-8 lg:px-14">
        <div className="hero-in mx-auto max-w-[1360px]">
          <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-cream/75">
            <a href={lz('/', lang)} className="transition hover:text-cream">{t.nav[0].label}</a> <span aria-hidden="true">/</span>{' '}
            <a href={lz('/editions', lang)} className="transition hover:text-cream">{t.editionsIdx.h1}</a> <span aria-hidden="true">/</span>{' '}
            {edition.ville} {edition.annee}
          </p>
          <p className="mb-6 mt-10 font-mono text-xs uppercase tracking-[0.1em] text-sun">
            ● {edition.pays} · {edition.dateDebut ? formatDate(edition.dateDebut, lang) : ''} → {edition.dateFin ? formatDate(edition.dateFin, lang) : ''}
          </p>
          <h1
            id="edition-title"
            className="m-0 font-display text-[clamp(48px,8vw,110px)] font-semibold leading-[0.9] tracking-[-0.045em]"
          >
            {edition.ville} {edition.annee}
          </h1>
          <p className="mb-0 mt-6 max-w-[60ch] text-[clamp(17px,1.5vw,22px)] font-medium leading-relaxed text-mist">
            {edition.theme}
          </p>
        </div>
      </section>
      <section aria-label={`${edition.ville} ${edition.annee}`} className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1360px]">
          {edition.image && (
            <Reveal>
              <figure className="m-0 overflow-hidden rounded-[28px]">
                <div className="relative aspect-[16/8]">
                  <Image src={edition.image.src} alt={edition.image.alt} fill className="object-cover" sizes="100vw" priority />
                </div>
                {credit && (
                  <figcaption className="bg-forest px-6 py-3 font-mono text-[11px] text-cream/70">
                    © {credit}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          )}
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
            <Reveal className="flex flex-col gap-5 text-[17px] leading-relaxed text-[#25372E]">
              <p className="m-0 font-display text-[clamp(22px,2.2vw,28px)] font-medium leading-snug text-forest">
                {t.editionDetail.leadPrefix}{edition.ville}{t.editionDetail.leadSuffix}
              </p>
              <p className="m-0">{stripTags(edition.pavillon)}</p>
            </Reveal>
            <Reveal delay={120}>
              <aside className="h-fit rounded-[28px] bg-forest p-8 text-cream lg:sticky lg:top-28">
                <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-sun">{t.editionDetail.brief}</p>
                <ul className="m-0 mt-4 flex list-none flex-col divide-y divide-white/10 p-0">
                  {[
                    [t.editionDetail.city, `${edition.ville} · ${edition.pays}`],
                    [t.editionDetail.theme, edition.theme],
                    [t.editionDetail.open, edition.dateDebut ? formatDate(edition.dateDebut, lang) : '—'],
                    [t.editionDetail.close, edition.dateFin ? formatDate(edition.dateFin, lang) : '—'],
                  ].map(([k, v]) => (
                    <li key={k} className="py-4">
                      <p className="m-0 text-sm text-sage">{k}</p>
                      <p className="m-0 mt-1 font-display text-xl font-semibold leading-snug">{v}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <a
                    href={lz('/contact', lang)}
                    className="inline-flex items-center gap-2 rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-white"
                  >
                    {t.editionDetail.btn1}
                  </a>
                  <a
                    href={lz('/editions', lang)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:border-cream"
                  >
                    {t.editionDetail.btn2}
                  </a>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </article>
  );
}
