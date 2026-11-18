'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { YOKOHAMA_LATIN, YOKOHAMA_PLANTS } from '@/lib/yokohama';
import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';

/** Durée de pose d'une plante pendant le défilement automatique. */
const HOLD = 5200;

/**
 * L'herbier en cinq panneaux : les cinq plantes du projet togolais, côte à
 * côte, chacune dans une haute bande de photographie. La bande ouverte prend
 * la place, les quatre autres se resserrent en lisières où le nom se lit à la
 * verticale.
 *
 * **Pourquoi des panneaux.** La section ne porte plus de texte par plante — le
 * détail a sa propre section. Il reste donc à *montrer* : cinq images en grand,
 * un nom, un binôme latin, un rang. L'ancien index à onglets servait à lire une
 * notice ; sans notice, il n'était plus qu'une liste à côté d'une photo.
 *
 * **L'interaction.** Au survol ou au focus, le panneau s'ouvre ; au clic aussi,
 * pour le tactile. Tant que personne n'y touche, les panneaux s'ouvrent l'un
 * après l'autre, un trait jaune mesurant la pose ; dès le premier geste, le
 * défilement s'arrête pour de bon — c'est le lecteur qui feuillette.
 * Sur mobile les panneaux s'empilent et s'ouvrent en hauteur.
 *
 * **Le clavier** : flèches pour passer d'une plante à l'autre, `Début` et `Fin`
 * pour les extrémités. Sous `prefers-reduced-motion`, pas de défilement
 * automatique ni de zoom : le premier panneau est ouvert, les autres s'ouvrent
 * à la demande.
 */
export function YokohamaPlate({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const y = t.yokohama;
  const plants = y.plants;
  const n = plants.length;
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false);
  const rootRef = useRef<HTMLOListElement | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Le défilement automatique ne tourne que lorsque la section est à l'écran.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let touched = false;
    const check = () => {
      if (touched) return;
      const r = el.getBoundingClientRect();
      setAuto(r.top < window.innerHeight * 0.75 && r.bottom > window.innerHeight * 0.25);
    };
    const stop = () => {
      touched = true;
      setAuto(false);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    el.addEventListener('pointerenter', stop);
    el.addEventListener('pointerdown', stop);
    el.addEventListener('keydown', stop);
    return () => {
      window.removeEventListener('scroll', check);
      el.removeEventListener('pointerenter', stop);
      el.removeEventListener('pointerdown', stop);
      el.removeEventListener('keydown', stop);
    };
  }, []);

  useEffect(() => {
    if (!auto) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % n), HOLD);
    return () => window.clearTimeout(id);
  }, [auto, active, n]);

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowDown: (active + 1) % n,
      ArrowRight: (active + 1) % n,
      ArrowUp: (active - 1 + n) % n,
      ArrowLeft: (active - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    btnRefs.current[next]?.focus();
  };

  return (
    <ol
      ref={rootRef}
      aria-label={y.plateIndex}
      onKeyDown={onKey}
      className="m-0 flex h-[640px] list-none flex-col gap-1.5 p-0 sm:h-[720px] lg:h-[min(74vh,720px)] lg:min-h-[520px] lg:flex-row lg:gap-2"
    >
      {plants.map((p, i) => {
        const on = i === active;
        return (
          <li
            key={p.id}
            className="relative min-h-0 min-w-0 basis-0 overflow-hidden rounded-[4px] transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(.22,1,.26,1)] motion-reduce:transition-none"
            style={{ flexGrow: on ? 6 : 1 }}
          >
            <button
              type="button"
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-current={on}
              tabIndex={on ? 0 : -1}
              className="group absolute inset-0 block h-full w-full cursor-pointer border-0 bg-ink p-0 text-left text-cream outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sun"
            >
              {/* La photographie. Ouverte, elle avance très lentement ;
                  refermée, elle se retire et s'assombrit. */}
              <Image
                src={YOKOHAMA_PLANTS[i]}
                alt=""
                fill
                className={`object-cover transition-[transform,filter] ease-[cubic-bezier(.22,1,.26,1)] motion-reduce:transition-none motion-reduce:transform-none ${
                  on ? 'scale-[1.08] saturate-100 duration-[6000ms]' : 'scale-100 saturate-[0.55] duration-[900ms]'
                }`}
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={i === 0}
              />
              <span
                aria-hidden="true"
                className={`absolute inset-0 transition-colors duration-700 motion-reduce:transition-none ${
                  on ? 'bg-black/0' : 'bg-black/50 group-hover:bg-black/30'
                }`}
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/25" />

              {/* Le rang, en haut : toujours lisible, ouvert ou non. */}
              <span className="absolute left-4 top-4 font-mono text-[11px] tracking-[0.18em] text-sun lg:left-5 lg:top-5">
                <span className="sr-only">{y.plateLabel} </span>
                {ROMAN[i]}
              </span>

              {/* Lisière : le nom à la verticale quand le panneau est refermé
                  (à l'horizontale sur mobile, où les panneaux s'empilent). */}
              <span
                aria-hidden="true"
                className={`absolute left-12 top-4 font-display text-[17px] font-semibold uppercase leading-none tracking-[0.04em] transition-opacity duration-500 motion-reduce:transition-none lg:bottom-6 lg:left-1/2 lg:top-auto lg:-translate-x-1/2 lg:whitespace-nowrap lg:[writing-mode:vertical-rl] lg:[text-orientation:sideways] lg:rotate-180 ${
                  on ? 'opacity-0' : 'opacity-100 delay-200'
                }`}
              >
                {p.name}
              </span>

              {/* L'étiquette du panneau ouvert. Largeur fixe : le texte ne se
                  recompose pas pendant que le panneau s'élargit. */}
              <span
                className={`absolute bottom-0 left-0 block w-[min(560px,86vw)] p-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.26,1)] motion-reduce:transition-none sm:p-8 lg:p-10 ${
                  on ? 'translate-y-0 opacity-100 delay-300' : 'pointer-events-none translate-y-5 opacity-0'
                }`}
              >
                <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-sun">{p.cat}</span>
                <span className="mt-3 block font-display text-[clamp(34px,5.4vw,76px)] font-semibold uppercase leading-[0.92] tracking-[-0.035em]">
                  {p.name}
                </span>
                <span className="mt-3 block font-mono text-[13px] italic text-cream/80 sm:text-[15px]">{YOKOHAMA_LATIN[i]}</span>
              </span>

              {/* Rang sur le total, en haut à droite du panneau ouvert. */}
              <span
                aria-hidden="true"
                className={`absolute right-5 top-5 font-mono text-[11px] tracking-[0.18em] text-cream/70 transition-opacity duration-500 motion-reduce:transition-none ${
                  on ? 'opacity-100 delay-300' : 'opacity-0'
                }`}
              >
                {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>

              {/* Le trait de pose, seulement pendant le défilement automatique. */}
              {on && auto && (
                <span
                  key={`fill-${i}`}
                  aria-hidden="true"
                  className="slide-fill absolute inset-x-0 bottom-0 block h-[3px] origin-left bg-sun"
                  style={{ animationDuration: `${HOLD}ms` }}
                />
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V'] as const;
