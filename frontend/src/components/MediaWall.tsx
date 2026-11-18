import Image from 'next/image';
import { MEDIA_GALLERY } from '@/lib/design';
import { getDictionary } from '@/i18n/dict';
import { lz, type Lang } from '@/i18n/lang';
import { Reveal } from './Reveal';
import { SectionKicker } from './SectionKicker';

// Même courbe que l'accordéon des éditions : décélération longue, sans rebond.
const EASE = 'cubic-bezier(.16,1,.3,1)';

/** Mosaïque d'images façon Pinterest : colonnes CSS, hauteurs libres, et
 *  animations au survol (zoom de l'image, voile, légende qui remonte).
 *  Sur mobile (pas de survol) le voile et la légende restent visibles. */
export function MediaWall({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const href = lz('/mediatheque', lang);

  return (
    <section id="mediatheque" aria-labelledby="media-title" className="bg-paper px-5 py-[100px] text-forest sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <div>
            <Reveal>
              <SectionKicker className="mb-6">{t.mediaWall.kicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="media-title" className="m-0 font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.04em]">
                {t.mediaWall.h2a}<br />
                <span className="text-blood">{t.mediaWall.h2b}</span>
              </h2>
            </Reveal>
            <Reveal>
              <p className="mb-0 mt-6 max-w-[48ch] text-[clamp(16px,1.3vw,19px)] leading-relaxed text-[#42574C]">{t.mediaWall.para}</p>
            </Reveal>
          </div>
          <Reveal>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.flickr.com/photos/190367340@N06/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex gap-2.5 rounded-full bg-forest px-6 py-3.5 font-semibold text-cream transition-colors hover:bg-pine"
              >
                {t.mediaWall.gallery}
              </a>
              <a
                href="https://www.youtube.com/@togoexpoofficiel7522"
                target="_blank"
                rel="noreferrer"
                className="inline-flex gap-2.5 rounded-full border border-forest/30 px-6 py-3.5 font-semibold text-forest transition-colors hover:border-forest hover:bg-forest hover:text-cream"
              >
                {t.mediaWall.youtube}
              </a>
            </div>
          </Reveal>
        </div>

        <ul className="m-0 mt-12 columns-2 gap-4 p-0 md:columns-3 lg:columns-4 lg:gap-5">
          {MEDIA_GALLERY.map((tile, i) => {
            const meta = t.mediaWall.tiles[i];
            return (
              <li key={tile.src} className="mb-4 list-none break-inside-avoid lg:mb-5">
                <Reveal delay={(i % 4) * 90}>
                  <a
                    href={href}
                    aria-label={`${t.mediaWall.viewAria}${meta.caption}`}
                    className="group relative block overflow-hidden rounded-[20px] ring-1 ring-forest/10 transition-[transform,box-shadow] duration-700 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(0,0,0,0.75)] hover:ring-2 hover:ring-sun/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sun motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    style={{ aspectRatio: tile.ar, transitionTimingFunction: EASE }}
                  >
                    <Image
                      src={tile.src}
                      alt={meta.caption}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-[1100ms] group-hover:scale-[1.09] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      style={{ transitionTimingFunction: EASE }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent transition-opacity duration-700 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 motion-reduce:transition-none"
                    />
                    <span
                      className="absolute inset-x-0 bottom-0 block p-4 transition-[opacity,transform] duration-700 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100 motion-reduce:transition-none motion-reduce:md:translate-y-0 motion-reduce:md:opacity-100"
                      style={{ transitionTimingFunction: EASE }}
                    >
                      <span className="block font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-sun">{meta.tag}</span>
                      <span className="mt-1.5 block font-display text-[15px] font-semibold leading-tight text-cream">{meta.caption}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute right-3 top-3 grid h-9 w-9 scale-75 place-items-center rounded-full bg-sun text-forest opacity-0 transition-[opacity,transform] duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                      style={{ transitionTimingFunction: EASE }}
                    >
                      ↗
                    </span>
                  </a>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
