'use client';
import { useState } from 'react';
import Image from 'next/image';
import { BELGRADE_RHYTHM_IMAGES, BELGRADE_RHYTHM_IMAGES_BACK } from '@/lib/belgrade';
import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';

/**
 * Les cinq danses du Togo, une par région, en cartes qui se retournent autour
 * de l'axe horizontal.
 *
 * **Le survol commande.** La carte montre sa photo ; le curseur la retourne et
 * découvre la seconde face — l'autre photo du rythme, voilée, et la
 * description ; le curseur parti, elle reprend sa face initiale. Le focus
 * clavier fait de même. Sur écran tactile, où il n'y a pas de survol, le
 * toucher verrouille le retournement, et `aria-pressed` le dit.
 *
 * L'angle n'a plus qu'un seul pilote. Il était auparavant calé sur le
 * défilement, ce qui se contredisait avec le survol : une carte déjà retournée
 * par le défilement se serait *dé*tournée au passage du curseur.
 *
 * **Hauteur.** Les deux faces partagent la même case de grille
 * (`grid-area: 1/1`) : la carte garde au minimum son format photo (4:5 sur
 * mobile, 3:5 au-delà) et s'allonge si la description est plus longue, sans
 * jamais déborder. Les cartes d'une même rangée prennent la même hauteur.
 *
 * **Pivot au centre.** Un retournement de 180° sur le bord haut ou bas
 * déplacerait la carte hors de sa case sous perspective ; le pivot reste au
 * centre, la géométrie de la grille ne bouge jamais. Le sens alterne d'une
 * carte à l'autre.
 *
 * **Les faces.** Le `transform` étant écrit par React, `backface-visibility`
 * suffit à masquer la face tournée : plus besoin de piloter l'opacité à la
 * main comme lorsque l'angle était écrit hors React.
 */

/**
 * Colonne de départ de chaque carte. Deux pistes : quatre colonnes jusqu'à
 * `lg` (deux cartes par rangée, la cinquième centrée), six au-delà (trois en
 * haut, les deux dernières centrées en dessous). Chaque carte occupe deux
 * colonnes, ce qui laisse une demi-carte de marge pour recentrer la rangée
 * basse.
 */
const COL = [
  'sm:col-start-1 lg:col-start-1',
  'sm:col-start-3 lg:col-start-3',
  'sm:col-start-1 lg:col-start-5',
  'sm:col-start-3 lg:col-start-2',
  'sm:col-start-2 lg:col-start-4',
];

export function RhythmCards({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const pillar = t.belgrade.pillars[0];

  // Le survol est passager, le verrou tient. La face montrée est l'un ou
  // l'autre, exclusivement : toucher une carte déjà survolée ne la retourne
  // donc pas deux fois.
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<boolean[]>(() => pillar.items.map(() => false));

  const sign = (i: number) => (i % 2 === 0 ? 1 : -1);
  const sizes = '(max-width: 640px) 46vw, (max-width: 1024px) 40vw, 24vw';

  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-4 sm:gap-5 lg:grid-cols-6 lg:gap-6">
      {pillar.items.map((item, i) => {
        const front = BELGRADE_RHYTHM_IMAGES[i];
        const back = BELGRADE_RHYTHM_IMAGES_BACK[i] ?? front;
        const showBack = hovered === i ? !pinned[i] : pinned[i];
        return (
          <li key={item.name} className={`[perspective:1600px] sm:col-span-2 ${COL[i % COL.length]}`}>
            <button
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered((h) => (h === i ? null : h))}
              onClick={() => setPinned((p) => p.map((v, j) => (j === i ? !v : v)))}
              aria-pressed={pinned[i]}
              className="relative grid h-full w-full cursor-pointer rounded-[24px] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.9)] transition-transform duration-[760ms] ease-[cubic-bezier(.22,1,.26,1)] [transform-style:preserve-3d] [will-change:transform] motion-reduce:transition-none"
              style={{ transform: `rotateX(${showBack ? 180 * sign(i) : 0}deg)` }}
            >
              {/* Face avant : la danse, son nom et sa région. */}
              <span
                aria-hidden={showBack}
                className="relative block aspect-[4/5] overflow-hidden rounded-[24px] [backface-visibility:hidden] [grid-area:1/1] sm:aspect-[3/5]"
              >
                <Image src={front} alt="" fill className="object-cover" sizes={sizes} />
                <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/25" />
                <span className="absolute inset-x-0 bottom-0 flex flex-col items-start p-5 text-left">
                  <span className="m-0 font-mono text-[10px] uppercase tracking-[0.1em] text-sun">{item.meta}</span>
                  <span className="mt-1 font-display text-[25px] font-semibold uppercase leading-none tracking-[-0.02em] text-cream">
                    {item.name}
                  </span>
                </span>
              </span>

              {/* Face arrière : une autre photo du rythme, voilée fort, et la
                  seule description. Ni nom, ni région ici. */}
              <span
                aria-hidden={!showBack}
                className="relative flex overflow-hidden rounded-[24px] [backface-visibility:hidden] [grid-area:1/1] [transform:rotateX(180deg)]"
              >
                <Image src={back} alt="" fill className="object-cover" sizes={sizes} />
                <span className="absolute inset-0 bg-forest/90" />
                <span className="relative flex w-full flex-col items-center justify-center p-5 text-center text-cream xl:p-6">
                  <span className="block text-[14px] leading-relaxed text-cream/90 xl:text-[14.5px]">{item.text}</span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
