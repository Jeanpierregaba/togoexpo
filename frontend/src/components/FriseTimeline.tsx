'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export type TimelineItem = {
  id: string;
  year: number;
  city: string;
  country: string;
  name: string;
  theme: string;
  dates: string;
  kind: 'universelle' | 'horticole' | 'specialisee';
  kindLabel: string;
  prep: boolean;
  image?: string;
};

export type TimelineLabels = {
  gap: string;
  see: string;
  prev: string;
  next: string;
  pause: string;
  play: string;
  prep: string;
};

/** Couleur des points sur fond vert, par famille d'exposition. */
const DOT: Record<TimelineItem['kind'], string> = {
  universelle: 'bg-cream',
  horticole: 'bg-sun',
  specialisee: 'bg-blood',
};

const EASE = 'ease-[cubic-bezier(.22,1,.26,1)]';
const DRAW_MS = 1600;
const STEP_MS = 3800;

/**
 * Frise des participations, sur fond vert, en version immersive.
 *
 * **Entrée.** À l'arrivée dans l'écran, le trait plein se dessine jusqu'à la
 * dernière participation passée, la suite (en préparation) se prolonge en
 * pointillés ; chaque point apparaît à son tour, sa tige se déplie et son
 * année glisse en place.
 *
 * **Parcours.** Une participation est « en lumière » : un repère jaune glisse
 * sur le trait jusqu'à elle, son point s'entoure d'un halo, et sa photo (s'il
 * y en a une) remplit le fond de la section, très voilée. Une fiche détaillée
 * s'affiche sous la frise : année en grand, famille, nom, ville et pays,
 * dates, thème, lien vers la carte. La mise en lumière avance seule, de la
 * plus récente vers les suivantes ; elle s'arrête au survol ou au focus, et
 * se pilote aussi au clavier ou aux boutons (précédent, suivant, pause).
 *
 * Le fond est posé en `absolute` sur la section parente (qui doit être
 * `relative`) ; le contenu de la section doit être `relative` pour passer
 * devant. `prefers-reduced-motion` : état final direct, pas de défilement.
 */
export function FriseTimeline({ items, labels }: { items: TimelineItem[]; labels: TimelineLabels }) {
  const ref = useRef<HTMLOListElement | null>(null);
  const [on, setOn] = useState(false);
  // Une fois l'entrée jouée, plus de délai : le survol doit répondre tout de suite.
  const [settled, setSettled] = useState(false);
  const lastPast = items.reduce((acc, p, i) => (p.prep ? acc : i), 0);
  const [focus, setFocus] = useState(lastPast);
  const [playing, setPlaying] = useState(false);
  const hold = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true);
      setSettled(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!on) return;
    const id = window.setTimeout(() => {
      setSettled(true);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(true);
    }, DRAW_MS + 1000);
    return () => window.clearTimeout(id);
  }, [on]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (hold.current || document.visibilityState !== 'visible') return;
      setFocus((f) => (f + 1) % items.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [playing, items.length]);

  // Centre de la colonne i, en tenant compte de la coupure de 56 px après la 2e.
  const center = (i: number) => (i < 2 ? `calc((100% - 56px) / 12 * ${i + 0.5})` : `calc(56px + (100% - 56px) / 12 * ${i + 0.5})`);
  const pastEnd = center(lastPast);
  const cur = items[focus];
  const go = (d: number) => setFocus((f) => (f + d + items.length) % items.length);

  return (
    <>
      {/* Fond : la photo de la participation en lumière, très voilée. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {items.map((p, i) =>
          p.image ? (
            <Image
              key={p.id}
              src={p.image}
              alt=""
              fill
              sizes="100vw"
              className={`object-cover transition-[opacity,transform] duration-[1400ms] ease-out motion-reduce:transition-none ${
                settled && i === focus ? 'scale-100 opacity-50' : 'scale-105 opacity-0'
              }`}
            />
          ) : null,
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/90 via-forest/55 to-forest/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/70 via-transparent to-forest/70" />
      </div>

      <div
        className="relative"
        onPointerEnter={() => (hold.current = true)}
        onPointerLeave={() => (hold.current = false)}
        onFocusCapture={() => (hold.current = true)}
        onBlurCapture={() => (hold.current = false)}
      >
        <div className="-mx-5 mt-12 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <ol
            ref={ref}
            className="relative m-0 grid min-w-[960px] list-none grid-cols-[repeat(2,1fr)_56px_repeat(10,1fr)] p-0 py-[118px]"
          >
            {/* Trait : partie passée pleine (jaune → crème), partie à venir en pointillés. */}
            <li aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 block h-[3px] -translate-y-1/2">
              <span
                className={`absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-sun via-sun to-cream transition-transform motion-reduce:transition-none ${EASE}`}
                style={{ width: pastEnd, transform: on ? 'scaleX(1)' : 'scaleX(0)', transitionDuration: `${DRAW_MS}ms` }}
              />
              <span
                className="absolute inset-y-0 right-0 bg-[repeating-linear-gradient(90deg,rgba(243,241,234,0.55)_0_8px,transparent_8px_16px)] transition-opacity duration-700 motion-reduce:transition-none"
                style={{ left: pastEnd, opacity: on ? 1 : 0, transitionDelay: `${DRAW_MS - 200}ms` }}
              />
              {/* Repère de la participation en lumière : il glisse sur le trait. */}
              <span
                className={`absolute top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun/25 blur-md transition-[left,opacity] duration-700 motion-reduce:transition-none ${EASE}`}
                style={{ left: center(focus), opacity: settled ? 1 : 0 }}
              />
            </li>

            {items.map((p, i) => {
              const up = i % 2 === 0;
              // Chaque point arrive quand le trait l'atteint.
              const delay = Math.round((DRAW_MS * (i + 0.5)) / items.length);
              const lit = settled && i === focus;
              return (
                <Fragment key={p.id}>
                  {i === 2 && (
                    <li aria-hidden="true" className="relative flex items-center justify-center">
                      <span
                        className="relative z-10 grid h-8 place-items-center whitespace-nowrap rounded-full border border-cream/25 bg-forest px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cream/70 transition-opacity duration-500 motion-reduce:transition-none"
                        style={{ opacity: on ? 1 : 0, transitionDelay: `${delay}ms` }}
                      >
                        {labels.gap}
                      </span>
                    </li>
                  )}
                  <li className="relative flex items-center justify-center">
                    <a
                      href={`#p-${p.id}`}
                      aria-current={lit ? 'true' : undefined}
                      onPointerEnter={() => settled && setFocus(i)}
                      onFocus={() => setFocus(i)}
                      className="group absolute inset-x-0 inset-y-[-118px] flex items-center justify-center rounded-2xl outline-none focus-visible:bg-white/[0.06]"
                    >
                      {/* Tige qui relie le point à son étiquette. */}
                      <span
                        aria-hidden="true"
                        className={`absolute left-1/2 w-px -translate-x-1/2 transition-[transform,background-color] duration-500 motion-reduce:transition-none ${EASE} ${
                          lit ? 'bg-sun' : 'bg-cream/30'
                        } ${up ? 'bottom-1/2 mb-3 h-[34px] origin-bottom' : 'top-1/2 mt-3 h-[34px] origin-top'}`}
                        style={{ transform: `translateX(-50%) scaleY(${on ? 1 : 0})`, transitionDelay: settled ? undefined : `${delay + 120}ms` }}
                      />
                      {/* Point. */}
                      <span
                        aria-hidden="true"
                        className={`relative z-10 block h-[18px] w-[18px] rounded-full transition-[transform,box-shadow] duration-500 group-hover:scale-125 motion-reduce:transition-none ${EASE} ${
                          p.prep ? 'border-2 border-cream bg-forest' : DOT[p.kind]
                        } ${lit ? 'scale-[1.35] shadow-[0_0_0_5px_#166C54,0_0_0_8px_#FFCE00]' : 'shadow-[0_0_0_5px_#166C54]'}`}
                        style={{ transform: on ? undefined : 'scale(0)', transitionDelay: on && !settled ? `${delay}ms` : undefined }}
                      >
                        {lit && <span className="absolute inset-0 animate-ping rounded-full bg-sun/60 motion-reduce:hidden" />}
                      </span>
                      {/* Étiquette : année et ville. */}
                      <span
                        className={`absolute left-1/2 flex w-max flex-col items-center text-center transition-[opacity,transform] duration-700 motion-reduce:transition-none ${EASE} ${
                          up ? 'bottom-1/2 mb-[52px]' : 'top-1/2 mt-[52px]'
                        }`}
                        style={{
                          opacity: on ? 1 : 0,
                          transform: `translateX(-50%) translateY(${on ? 0 : up ? 10 : -10}px) scale(${lit ? 1.12 : 1})`,
                          transitionDelay: settled ? undefined : `${delay + 180}ms`,
                        }}
                      >
                        <span
                          className={`font-display text-[24px] font-semibold leading-none tracking-[-0.03em] transition-colors group-hover:text-sun ${
                            lit ? 'text-sun' : 'text-cream'
                          }`}
                        >
                          {p.year}
                        </span>
                        <span className={`mt-1.5 text-[13px] font-medium transition-colors ${lit ? 'text-cream' : 'text-cream/70'}`}>{p.city}</span>
                      </span>
                    </a>
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </div>

        {/* Fiche de la participation en lumière. */}
        <div
          className="mt-4 rounded-[28px] border border-cream/15 bg-white/[0.06] p-6 backdrop-blur-sm transition-opacity duration-700 sm:p-8"
          style={{ opacity: on ? 1 : 0 }}
          aria-live="polite"
        >
          <div key={cur.id} className="frise-card grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_auto] lg:gap-10">
            <div className="flex items-center gap-5">
              <span className="font-display text-[clamp(56px,7vw,104px)] font-semibold leading-none tracking-[-0.05em] text-sun">{cur.year}</span>
              {cur.image && (
                <span className="relative hidden aspect-[4/3] w-[120px] shrink-0 overflow-hidden rounded-2xl ring-2 ring-sun/40 lg:block">
                  <Image src={cur.image} alt="" fill className="object-cover" sizes="120px" />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="m-0 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                <span className="rounded-full bg-sun px-2.5 py-1 font-bold text-forest">{cur.kindLabel}</span>
                {cur.prep && <span className="rounded-full border border-cream/40 px-2.5 py-1 text-cream">{labels.prep}</span>}
              </p>
              <h3 className="m-0 mt-3 font-display text-[clamp(22px,2.2vw,30px)] font-semibold leading-tight tracking-[-0.02em] text-cream">{cur.name}</h3>
              <p className="m-0 mt-1.5 text-[15px] text-cream/80">
                {cur.city}, {cur.country} · {cur.dates}
              </p>
              <p className="m-0 mt-2 text-[15px] italic leading-snug text-cream/90">« {cur.theme} »</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end">
              <a
                href={`#p-${cur.id}`}
                className="group inline-flex items-center gap-2 rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-white"
              >
                {labels.see}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </a>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={labels.prev}
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-cream/30 text-cream transition-colors hover:border-sun hover:bg-sun hover:text-forest"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setPlaying((v) => !v)}
                  aria-label={playing ? labels.pause : labels.play}
                  aria-pressed={playing}
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-cream/30 text-cream transition-colors hover:border-sun hover:bg-sun hover:text-forest"
                >
                  <span aria-hidden="true" className="text-xs">{playing ? '❚❚' : '▶'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={labels.next}
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-cream/30 text-cream transition-colors hover:border-sun hover:bg-sun hover:text-forest"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
