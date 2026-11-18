'use client';
import { useEffect, useRef, useState } from 'react';
import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';

/**
 * « Calendrier officiel » : les trois temps forts de la participation, en
 * chemin vertical.
 *
 * **L'animation.** Rien ne bouge tant que la section n'est pas en vue. Dès
 * qu'elle y entre, le trait se trace du haut vers le bas en 1,5 s et les
 * étapes montent l'une après l'autre, décalées de 220 ms : la lecture suit le
 * tracé. L'observation est faite une fois pour toutes — l'animation ne se
 * rejoue pas à chaque passage, ce qui serait agité sur une page longue. Sous
 * `prefers-reduced-motion`, tout est posé d'emblée, sans transition.
 *
 * **La disposition.** Un seul trait : à gauche jusqu'à `lg`, au centre au
 * delà, les étapes alternant alors de part et d'autre. Les pastilles restent
 * sur le trait dans les deux cas.
 *
 * **Les couleurs** suivent la rotation vert / rouge / jaune de la charte. Sur
 * fond blanc le jaune ne se lit pas : la troisième étape porte donc son numéro
 * en vert, le jaune restant à la pastille et à l'étiquette.
 */
const SKINS = [
  { ring: 'border-pine', dot: 'bg-pine', num: 'text-pine', chip: 'bg-pine text-cream' },
  { ring: 'border-blood', dot: 'bg-blood', num: 'text-blood', chip: 'bg-blood text-cream' },
  { ring: 'border-sun', dot: 'bg-sun', num: 'text-forest', chip: 'bg-sun text-forest' },
];

export function BelgradeRoadmap({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const steps = t.belgrade.roadSteps;
  const rootRef = useRef<HTMLOListElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // Même réglage que `Reveal`, pour que le calendrier se déclenche au même
    // moment que le reste de la page.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setOn(true);
        io.disconnect();
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={rootRef} className="relative m-0 list-none p-0">
      {/* Le trait, en deux couches : le rail pâle reste visible d'emblée, le
          trait plein se trace par-dessus. */}
      <span aria-hidden="true" className="absolute bottom-3 left-[17px] top-3 w-0.5 bg-forest/10 lg:left-1/2 lg:-translate-x-1/2" />
      <span
        aria-hidden="true"
        className={`absolute bottom-3 left-[17px] top-3 w-0.5 origin-top bg-forest/35 transition-transform duration-[1500ms] ease-out motion-reduce:transition-none lg:left-1/2 lg:-translate-x-1/2 ${
          on ? 'scale-y-100' : 'scale-y-0'
        }`}
      />

      {steps.map((s, i) => {
        const skin = SKINS[i % SKINS.length];
        const right = i % 2 === 0;
        return (
          <li
            key={s.date}
            className={`relative pb-14 pl-14 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0 ${
              on ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            } transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none`}
            style={{ transitionDelay: on ? `${260 + i * 220}ms` : '0ms' }}
          >
            {/* Pastille posée sur le trait. */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0.5 grid h-9 w-9 place-items-center rounded-full border-[3px] bg-white lg:left-1/2 lg:-translate-x-1/2 ${skin.ring}`}
            >
              <span className={`h-3 w-3 rounded-full ${skin.dot}`} />
            </span>

            <div className={right ? 'lg:col-start-2 lg:pl-16' : 'lg:col-start-1 lg:pr-16 lg:text-right'}>
              <p className="m-0 font-mono text-xs uppercase tracking-[0.14em] text-[#42574C]">{s.date}</p>
              <p aria-hidden="true" className={`m-0 mt-1 font-display text-[clamp(34px,3.6vw,48px)] font-semibold leading-none ${skin.num}`}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="m-0 mt-3">
                <span className={`inline-block rounded-md px-3 py-1.5 font-mono text-[12px] font-bold uppercase tracking-[0.1em] ${skin.chip}`}>
                  {s.title}
                </span>
              </p>
              <p className="m-0 mt-4 max-w-[46ch] text-[16px] leading-relaxed text-[#42574C] lg:inline-block lg:text-left">
                {s.text}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
