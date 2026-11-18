import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MediathequeGallery } from '@/components/MediathequeGallery';
import { toMediaItems, type HomeQuery } from '@/lib/mappers';
import { wpQuery } from '@/lib/wp';
import { GET_HOME } from '@/graphql/queries';
import { getDictionary } from '@/i18n/dict';
import { isLang, langAlternates, lz, toLang, wpLanguage, type Lang } from '@/i18n/lang';
import { SectionKicker } from '@/components/SectionKicker';

export const revalidate = 300;

type Props = { params: { lang: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang(params.lang);
  const t = getDictionary(lang);
  return {
    title: t.media.h1,
    description: t.media.para,
    alternates: langAlternates('/mediatheque', lang),
  };
}

async function getMedia(lang: Lang) {
  const t = getDictionary(lang);
  try {
    const res = await wpQuery<HomeQuery>(GET_HOME, { first: 100, language: wpLanguage(lang) });
    return toMediaItems(res.editions?.nodes, res.posts?.nodes, {
      pavillonOf: t.media.pavillonOf,
      actusLabel: t.media.actusLabel,
    });
  } catch {
    return [];
  }
}

export default async function MediathequePage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const t = getDictionary(lang);
  const items = await getMedia(lang);
  return (
    <>
      {/* Bannière : une photographie de la médiathèque sous un voile neutre. */}
      <section aria-labelledby="media-hero-title" className="relative isolate overflow-hidden bg-ink px-5 pb-14 pt-36 text-cream sm:px-8 lg:px-14">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image src="/design/hero-parade-osaka.jpg" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/50 to-black/20" />
        </div>
        <div className="hero-in mx-auto max-w-[1360px]">
          <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-cream/75">
            <a href={lz('/', lang)} className="transition hover:text-cream">{t.nav[0].label}</a>{' '}
            <span aria-hidden="true">/</span> {t.media.crumb}
          </p>
          <SectionKicker tone="dark" className="mb-6 mt-10">{t.media.kicker}</SectionKicker>
          <h1
            id="media-hero-title"
            className="m-0 font-display text-[clamp(40px,6vw,75px)] font-semibold leading-[0.95] tracking-[-0.04em]"
          >
            {t.media.h1}
          </h1>
          <p className="mb-0 mt-6 max-w-[62ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-mist">
            {t.media.para}
            {items.length > 0 && (
              <>
                {' '}— <span className="font-semibold text-sun">{items.length} {t.media.photos}</span>
              </>
            )}
            .
          </p>
        </div>
      </section>
      <section aria-label={t.media.h1} className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1360px]">
          <MediathequeGallery items={items} lang={lang} />
        </div>
      </section>
    </>
  );
}
