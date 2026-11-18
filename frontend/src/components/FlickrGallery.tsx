'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { FlickrPhoto } from '@/lib/flickr';

type Labels = {
  all: string;
  filterAria: string;
  more: string;
  shown: string;
  photos: string;
  view: string;
  close: string;
  prev: string;
  next: string;
  onFlickr: string;
};

/** Photographies montrées d'abord, puis à chaque « Afficher plus ». */
const BATCH = 24;

/**
 * La banque d'images Flickr : filtre par année, maçonnerie en colonnes (les
 * photographies gardent leurs proportions), chargement par lots, et une
 * visionneuse au clavier (← → Échap) avec un lien vers la photo sur Flickr.
 */
export function FlickrGallery({ photos, labels }: { photos: FlickrPhoto[]; labels: Labels }) {
  const years = useMemo(() => {
    const count = new Map<number, number>();
    for (const p of photos) count.set(p.year, (count.get(p.year) ?? 0) + 1);
    return Array.from(count.entries()).sort((a, b) => b[0] - a[0]);
  }, [photos]);

  const [year, setYear] = useState<number | null>(null);
  const [limit, setLimit] = useState(BATCH);
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const thumbsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const lastRef = useRef<number | null>(null);

  const visible = useMemo(() => (year === null ? photos : photos.filter((p) => p.year === year)), [photos, year]);
  const shown = visible.slice(0, limit);

  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    if (open === null) {
      if (lastRef.current !== null) thumbsRef.current[lastRef.current]?.focus();
      lastRef.current = null;
      return;
    }
    lastRef.current = open;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, step]);

  const choose = (y: number | null) => {
    setYear(y);
    setLimit(BATCH);
    setOpen(null);
  };

  const current = open === null ? null : shown[open];
  const alt = (p: FlickrPhoto) => `${p.title || 'TogoExpo'} (${p.year})`;
  const chip = (active: boolean) =>
    `cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
      active ? 'bg-forest text-cream' : 'border border-forest/25 bg-transparent text-forest hover:border-forest'
    }`;

  return (
    <>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label={labels.filterAria}>
        <button type="button" aria-pressed={year === null} onClick={() => choose(null)} className={chip(year === null)}>
          {labels.all} <span className="ml-1 font-mono text-xs opacity-70">{photos.length}</span>
        </button>
        {years.map(([y, n]) => (
          <button key={y} type="button" aria-pressed={year === y} onClick={() => choose(y)} className={chip(year === y)}>
            {y} <span className="ml-1 font-mono text-xs opacity-70">{n}</span>
          </button>
        ))}
      </div>

      <ul className="m-0 mt-10 list-none columns-2 gap-3 p-0 sm:gap-4 md:columns-3 lg:columns-4">
        {shown.map((p, i) => (
          <li key={p.id} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              ref={(el) => {
                thumbsRef.current[i] = el;
              }}
              onClick={() => setOpen(i)}
              aria-label={`${labels.view}${alt(p)}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border-0 bg-forest/10 p-0 ring-1 ring-forest/10 transition-shadow duration-500 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.7)]"
            >
              <Image
                src={p.src}
                alt={alt(p)}
                width={p.width}
                height={p.height}
                className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05] motion-reduce:transition-none"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-3.5 pt-10 text-left opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 motion-reduce:transition-none">
                <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-sun">{p.year}</span>
                <span className="mt-1 block truncate font-display text-[15px] font-semibold leading-tight text-cream">{p.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        {shown.length < visible.length && (
          <button
            type="button"
            onClick={() => setLimit((l) => l + BATCH)}
            className="cursor-pointer rounded-full bg-forest px-6 py-3.5 font-semibold text-cream transition-colors hover:bg-pine"
          >
            {labels.more}
          </button>
        )}
        <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-forest/60" aria-live="polite">
          {shown.length} {labels.shown} {visible.length} {labels.photos}
        </p>
      </div>

      {current && open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt(current)}
          className="fixed inset-0 z-[80] flex flex-col bg-[#0b0d0c]/95 p-4 sm:p-8"
          onClick={() => setOpen(null)}
        >
          <div className="flex items-center justify-between gap-4 text-cream">
            <p className="m-0 font-mono text-xs tracking-[0.14em] text-cream/70">
              {String(open + 1).padStart(2, '0')} / {String(shown.length).padStart(2, '0')}
            </p>
            <button
              type="button"
              ref={closeRef}
              onClick={() => setOpen(null)}
              className="cursor-pointer rounded-full border border-cream/30 bg-transparent px-4 py-2 text-sm font-semibold text-cream transition-colors hover:border-sun hover:text-sun"
            >
              {labels.close}
            </button>
          </div>

          <div className="relative my-4 min-h-0 flex-1" onClick={(e) => e.stopPropagation()}>
            <Image key={current.src} src={current.src} alt={alt(current)} fill className="word-in object-contain" sizes="100vw" priority />
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={labels.prev}
              className="absolute left-0 top-1/2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-cream/15 text-xl text-cream backdrop-blur transition-colors hover:bg-sun hover:text-forest"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={labels.next}
              className="absolute right-0 top-1/2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-cream/15 text-xl text-cream backdrop-blur transition-colors hover:bg-sun hover:text-forest"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="m-0 text-[15px] leading-relaxed text-cream/90" aria-live="polite">
              {alt(current)}
            </p>
            <a
              href={current.page}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-sun underline-offset-4 transition-colors hover:text-cream hover:underline"
            >
              {labels.onFlickr}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
