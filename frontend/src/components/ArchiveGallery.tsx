'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export type GalleryPhoto = { src: string; w: number; h: number; alt: string };

type Labels = {
  more: string;
  less: string;
  close: string;
  view: string;
  prev: string;
  next: string;
};

/** Nombre de photographies montrées avant de déplier la galerie. */
const FIRST = 9;

/**
 * La mini-médiathèque d'une édition.
 *
 * **La grille.** Une maçonnerie en colonnes CSS : les photographies gardent
 * leurs proportions — il y a un portrait parmi les paysages — sans qu'aucune ne
 * soit recadrée. Neuf photographies d'abord, les autres derrière un bouton : la
 * page reste courte pour qui ne fait que passer.
 *
 * **La visionneuse.** Un clic ouvre la photographie en grand, avec sa légende
 * et son rang. On passe de l'une à l'autre aux flèches du clavier ou aux
 * boutons, on ferme par Échap, par le bouton ou en cliquant le fond. Le focus
 * va au bouton de fermeture à l'ouverture et revient à la vignette à la
 * fermeture, et le défilement de la page est gelé tant qu'elle est ouverte.
 */
export function ArchiveGallery({ photos, labels }: { photos: GalleryPhoto[]; labels: Labels }) {
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const thumbsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const lastRef = useRef<number | null>(null);

  const shown = all ? photos : photos.slice(0, FIRST);
  const rest = photos.length - FIRST;

  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) {
      // Retour du focus sur la vignette d'où l'on vient.
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

  const current = open === null ? null : photos[open];

  return (
    <>
      <ul className="m-0 list-none columns-2 gap-3 p-0 sm:gap-4 lg:columns-3">
        {shown.map((p, i) => (
          <li key={p.src} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              ref={(el) => {
                thumbsRef.current[i] = el;
              }}
              onClick={() => setOpen(i)}
              aria-label={`${labels.view}${p.alt}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border-0 bg-forest p-0"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.26,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              {/* La légende monte du bas de la vignette au survol et au focus. */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pb-4 pt-12 text-left text-[13px] leading-snug text-cream opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
                {p.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {rest > 0 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setAll((v) => !v)}
            aria-expanded={all}
            className="cursor-pointer rounded-full border border-cream/30 bg-transparent px-6 py-3 text-sm font-semibold text-cream transition-colors duration-300 hover:border-sun hover:text-sun"
          >
            {all ? labels.less : labels.more.replace('{n}', String(rest))}
          </button>
        </div>
      )}

      {current && open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[80] flex flex-col bg-[#0b0d0c]/95 p-4 sm:p-8"
          onClick={() => setOpen(null)}
        >
          <div className="flex items-center justify-between gap-4 text-cream">
            <p className="m-0 font-mono text-xs tracking-[0.14em] text-cream/70">
              {String(open + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
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

          {/* La photographie occupe tout l'espace restant, sans être recadrée. */}
          <div className="relative my-4 min-h-0 flex-1" onClick={(e) => e.stopPropagation()}>
            <Image key={current.src} src={current.src} alt={current.alt} fill className="word-in object-contain" sizes="100vw" priority />
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

          <p className="m-0 mx-auto max-w-[70ch] text-center text-[15px] leading-relaxed text-cream/90" aria-live="polite">
            {current.alt}
          </p>
        </div>
      )}
    </>
  );
}
