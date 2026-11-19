import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FlickrGallery } from '@/components/FlickrGallery';
import { SectionKicker } from '@/components/SectionKicker';
import { FLICKR_PHOTOS, FLICKR_URL } from '@/lib/flickr';
import { getDictionary } from '@/i18n/dict';
import { isLang, langAlternates, lz, toLang } from '@/i18n/lang';
import { withShare } from '@/lib/share';

type Props = { params: { lang: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang(params.lang);
  const t = getDictionary(lang);
  return withShare(lang, {
    title: t.media.h1,
    description: t.media.para,
    alternates: langAlternates('/mediatheque', lang),
  });
}

/**
 * Médiathèque : toute la banque d'images Flickr de TogoExpo. La liste des
 * photos est relevée par `npm run flickr` (src/data/flickr.json) ; les images
 * elles-mêmes restent servies par Flickr.
 */
export default function MediathequePage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const t = getDictionary(lang);
  const photos = FLICKR_PHOTOS;

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
          <h1 id="media-hero-title" className="m-0 font-display text-[clamp(40px,6vw,75px)] font-semibold leading-[0.95] tracking-[-0.04em]">
            {t.media.h1}
          </h1>
          <p className="mb-0 mt-6 max-w-[62ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-mist">
            {t.media.para}
            {photos.length > 0 && (
              <>
                {' '}— <span className="font-semibold text-sun">{photos.length} {t.media.photos}</span>
              </>
            )}
            .
          </p>
          <a
            href={FLICKR_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-full border border-cream/35 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:border-sun hover:text-sun"
          >
            {t.media.flickrCta}
          </a>
        </div>
      </section>

      <section aria-label={t.media.h1} className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1360px]">
          {photos.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-forest/30 p-10 text-center">
              <p className="m-0 font-display text-2xl font-semibold">{t.media.emptyTitle}</p>
              <p className="mx-auto mb-0 mt-3 max-w-[60ch] leading-relaxed text-[#42574C]">{t.media.emptyPara}</p>
            </div>
          ) : (
            <FlickrGallery
              photos={photos}
              labels={{
                all: t.media.all,
                filterAria: t.media.filterAria,
                more: t.media.more,
                shown: t.media.shown,
                photos: t.media.photos,
                view: t.media.viewAria,
                close: t.media.close,
                prev: t.media.prev,
                next: t.media.next,
                onFlickr: t.media.onFlickr,
              }}
            />
          )}
          <p className="mb-0 mt-10 text-sm text-forest/60">{t.media.credit}</p>
        </div>
      </section>
    </>
  );
}
