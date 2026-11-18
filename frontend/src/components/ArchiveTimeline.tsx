'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { ArchiveMoment } from '@/lib/archives';

export type MomentPhoto = { src: string; w: number; h: number; alt: string };

/**
 * Les temps forts datés d'une participation passée, en chemin vertical.
 *
 * **Pourquoi un autre chemin que celui de Belgrade.** Le calendrier de Belgrade
 * annonce trois rendez-vous à venir sur fond blanc, en alternance de part et
 * d'autre d'un trait central. Ici on raconte ce qui a eu lieu : fond vert, un
 * seul côté, la date d'abord et le récit dessous — on lit une chronique, pas un
 * programme. Certaines éditions n'ont qu'un seul temps fort, et une alternance
 * à deux colonnes n'aurait alors plus de sens.
 *
 * **Le trait suit la lecture.** Il se remplit à mesure que l'on descend : son
 * extrémité se tient aux deux tiers de la fenêtre, là où l'œil lit. Les temps
 * forts, eux, montent une fois pour toutes à l'entrée de la liste, décalés de
 * 200 ms, la pastille s'ouvrant juste avant son texte.
 *
 * **Les photographies.** Un temps fort peut porter une ou plusieurs
 * photographies ; elles se découvrent de gauche à droite après le texte.
 *
 * Sous `prefers-reduced-motion`, tout est posé d'emblée et le trait est plein.
 */
export function ArchiveTimeline({ moments, photos }: { moments: ArchiveMoment[]; photos?: MomentPhoto[][] }) {
  const rootRef = useRef<HTMLOListElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    const fill = fillRef.current;
    if (!el) return;
    // Même seuil que `Reveal`, pour que la page batte au même rythme.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true);
      if (fill) fill.style.transform = 'scaleY(1)';
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setOn(true);
        io.disconnect();
      },
      { threshold: 0.05 },
    );
    io.observe(el);

    // Le remplissage du trait, écrit hors React à chaque frame de défilement.
    let raf = 0;
    const paint = () => {
      raf = 0;
      if (!fill) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.66 - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
    };
    const ask = () => {
      if (!raf) raf = window.requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', ask);
      window.removeEventListener('resize', ask);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ol ref={rootRef} className="relative m-0 list-none p-0">
      {/* Le trait, en deux couches : le rail pâle est là d'emblée, le trait
          plein se remplit par-dessus avec la lecture. */}
      <span aria-hidden="true" className="absolute bottom-4 left-[7px] top-4 w-px bg-cream/15" />
      <span
        ref={fillRef}
        aria-hidden="true"
        className="absolute bottom-4 left-[7px] top-4 w-px origin-top scale-y-0 bg-sun transition-transform duration-200 ease-linear motion-reduce:transition-none"
      />

      {moments.map((m, i) => {
        const shots = photos?.[i] ?? [];
        return (
          <li
            key={m.date}
            className={`relative pb-16 pl-10 last:pb-0 sm:pl-14 ${
              on ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'
            } transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none`}
            style={{ transitionDelay: on ? `${240 + Math.min(i, 4) * 200}ms` : '0ms' }}
          >
            {/* Pastille posée sur le trait : elle s'ouvre juste avant le texte. */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1.5 grid h-[15px] w-[15px] place-items-center rounded-full border-2 border-sun bg-forest transition-transform duration-500 ease-[cubic-bezier(.22,1,.26,1)] motion-reduce:transition-none ${
                on ? 'scale-100' : 'scale-0'
              }`}
              style={{ transitionDelay: on ? `${180 + Math.min(i, 4) * 200}ms` : '0ms' }}
            />

            <p className="m-0 font-mono text-[12px] uppercase tracking-[0.16em] text-sun">{m.date}</p>
            <h3 className="m-0 mt-3 max-w-[22ch] font-display text-[clamp(24px,2.6vw,36px)] font-semibold leading-tight tracking-[-0.03em] text-cream">
              {m.title}
            </h3>
            <div className="mt-5 flex max-w-[62ch] flex-col gap-4">
              {m.paras.map((p, j) => (
                <p key={j} className="m-0 text-[17px] leading-relaxed text-cream/85">
                  {p}
                </p>
              ))}
            </div>

            {shots.length > 0 && (
              <ul className="m-0 mt-7 flex list-none flex-wrap gap-3 p-0 sm:gap-4">
                {shots.map((s, k) => (
                  <li
                    key={s.src}
                    className="group relative h-[150px] overflow-hidden rounded-2xl transition-[clip-path] duration-[1000ms] ease-[cubic-bezier(.22,1,.26,1)] motion-reduce:transition-none sm:h-[190px] lg:h-[220px]"
                    style={{
                      aspectRatio: `${s.w} / ${s.h}`,
                      clipPath: on ? 'inset(0 0 0 0 round 16px)' : 'inset(0 100% 0 0 round 16px)',
                      transitionDelay: on ? `${520 + Math.min(i, 4) * 200 + k * 140}ms` : '0ms',
                    }}
                  >
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.26,1)] group-hover:scale-[1.06] motion-reduce:transition-none"
                      sizes="(max-width: 640px) 60vw, 320px"
                    />
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
