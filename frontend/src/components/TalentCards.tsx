'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { BELGRADE_TALENT_IMAGES } from '@/lib/belgrade';
import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';

/**
 * Les trois talents (fresques, sculpture, lokpo) en paquet de cartes
 * superposées : la carte du dessus est entièrement visible, les deux autres
 * dépassent légèrement en bas (`translate-y-4/8`), rétrécies (`scale 0.97/0.94`)
 * et assombries pour la profondeur.
 *
 * **Interaction en deux temps.** Un clic (ou Entrée/Espace au clavier) sur la
 * carte visible la fait d'abord décoller par-dessus le paquet (`LIFT` : elle
 * monte, s'agrandit, passe devant avec `z-50`), puis elle replonge en bas de
 * la pile pendant que la suivante remonte au premier plan — le `z-index`
 * bascule à mi-course de la seconde transition, la carte passe donc devant
 * puis derrière. Les clics sont ignorés pendant l'animation. Le cycle est
 * infini. Sous `prefers-reduced-motion` le réordonnancement est instantané.
 *
 * **Survol.** L'animation « voile qui se lève » est conservée sur la carte du
 * dessus : la photo zoome doucement et le voile s'éclaircit, liseré jaune.
 */
const DEPTHS = [
  'z-30 translate-y-0 scale-100 rotate-0',
  'z-20 translate-y-4 scale-[0.97] rotate-1',
  'z-10 translate-y-8 scale-[0.94] -rotate-1',
];

/** La carte qui quitte le premier plan : elle décolle au-dessus du paquet. */
const LIFT = 'z-50 -translate-y-10 scale-[1.04] rotate-0';

/** Durée du décollage avant que la carte replonge en bas de pile (ms). */
const LIFT_MS = 280;

export function TalentCards({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const pillar = t.belgrade.pillars[2];
  // Ordre du paquet : `order[0]` est la carte visible.
  const [order, setOrder] = useState<number[]>(() => pillar.items.map((_, i) => i));
  // Carte en train de quitter le premier plan : elle décolle d'abord.
  const [leaving, setLeaving] = useState<number | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const advance = () => {
    if (leaving !== null) return;
    setLeaving(order[0] ?? null);
    timer.current = window.setTimeout(() => {
      setOrder(([first, ...rest]) => [...rest, first]);
      setLeaving(null);
    }, LIFT_MS);
  };
  const next = pillar.items[order[1] ?? 0];

  return (
    <ul className="relative m-0 h-[458px] list-none p-0 sm:h-[488px] lg:h-[518px]">
        {pillar.items.map((g, i) => {
          const img = BELGRADE_TALENT_IMAGES[i];
          const depth = order.indexOf(i);
          const front = depth === 0;
          const flying = leaving === i;
          return (
            <li
              key={g.name}
              onClick={front ? advance : undefined}
              onKeyDown={front ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); } } : undefined}
              role={front ? 'button' : undefined}
              tabIndex={front ? 0 : undefined}
              aria-label={front && next ? `${g.name} — ${t.belgrade.deckHint} (${next.name})` : undefined}
              aria-hidden={front ? undefined : true}
              className={`group absolute inset-x-0 top-0 flex h-[410px] flex-col justify-end overflow-hidden rounded-[24px] p-6 text-cream shadow-[0_24px_48px_-24px_rgba(0,0,0,0.75)] transition-all duration-500 ease-out motion-reduce:transition-none sm:h-[440px] lg:h-[470px] ${flying ? LIFT : DEPTHS[depth] ?? ''} ${
                front ? 'cursor-pointer hover:ring-2 hover:ring-sun' : 'pointer-events-none'
              }`}
            >
              <Image
                src={img.src}
                alt={front ? g.name : ''}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 38vw"
                className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${img.position}`}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-50 motion-reduce:transition-none"
              />
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-black/30 transition-opacity duration-500 motion-reduce:transition-none ${front ? 'opacity-0' : 'opacity-100'}`}
              />
              <div className="relative">
                <p className="m-0 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest font-mono text-sm font-bold text-sun ring-2 ring-cream/30"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[clamp(24px,2.2vw,30px)] font-semibold leading-none tracking-[-0.02em]">
                    {g.name}
                  </span>
                </p>
                <p className="m-0 mt-3 font-mono text-xs uppercase tracking-[0.12em] text-cream/75">{g.meta}</p>
                <p className="m-0 mt-2 text-[15px] font-semibold leading-snug">{g.hook}</p>
              </div>

              {/* Description, révélée au survol de la carte du dessus par un
                  rideau vert qui balaie la photo en diagonale — le clic, lui,
                  reste réservé au passage à la carte suivante. Le rideau est
                  posé en absolu : la carte garde sa taille et le paquet ne
                  bouge pas. */}
              {front && (
                <div className="talent-curtain pointer-events-none absolute inset-0 flex flex-col justify-end gap-3 overflow-hidden bg-forest/95 p-6">
                  <p className="talent-line talent-line-1 m-0 flex items-center gap-3">
                    <span aria-hidden="true" className="h-0.5 w-7 shrink-0 bg-sun" />
                    <span className="font-display text-[clamp(22px,2vw,28px)] font-semibold uppercase leading-none tracking-[-0.02em] text-cream">
                      {g.name}
                    </span>
                  </p>
                  <p className="talent-line talent-line-2 m-0 text-[14px] leading-relaxed text-cream/90 sm:text-[15px]">
                    {g.text}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
  );
}
