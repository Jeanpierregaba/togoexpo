'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TOGO_CARDS } from '@/lib/design';
import { getDictionary } from '@/i18n/dict';
import { lz, type Lang } from '@/i18n/lang';
import { Reveal } from './Reveal';
import { SectionKicker } from './SectionKicker';

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === 'left' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'} />
  </svg>
);

const AUTOPLAY_MS = 4000;

/** « 01 — Découvrir le Togo » : texte à gauche, volet illustré à droite.
 *  Culture, tourisme et économie ne sont plus trois cartes côte à côte mais trois
 *  onglets qui changent le paragraphe et l'image, en gardant chacun sa couleur.
 *  Chaque onglet porte son propre diaporama de trois photos. */
export function TogoCards({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const [active, setActive] = useState(0);
  const [shot, setShot] = useState(0);
  const paused = useRef(false);
  const card = TOGO_CARDS[active];
  const txt = t.togoCards.cards[active];
  const shots = card.images.length;
  const go = (dir: -1 | 1) => setShot((i) => (i + dir + shots) % shots);
  // Changer d'onglet repart de la première photo du nouveau volet.
  const pick = (i: number) => {
    setActive(i);
    setShot(0);
  };

  // Défilement auto des photos de l'onglet courant, sauf préférence de
  // réduction des animations ou survol à la souris.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!paused.current) setShot((i) => (i + 1) % shots);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [active, shots]);

  return (
    <section id="togo" aria-labelledby="togo-title" className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
      <div className="mx-auto grid max-w-[1360px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Colonne de texte */}
        <div>
          <Reveal>
            <SectionKicker className="mb-7">{t.togoCards.kicker}</SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="togo-title" className="m-0 font-display text-[clamp(39px,5.29vw,67px)] font-semibold leading-[1.02] tracking-[-0.035em]">
              {t.togoCards.h2a}
              <br />
              <span className="text-blood">{t.togoCards.h2b}</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="m-0 mt-7 max-w-[54ch] text-[17px] leading-relaxed text-[#42574C]">{t.togoCards.para}</p>
          </Reveal>
          {/* Paragraphe de l'onglet actif : rejoué à chaque changement */}
          <p key={txt.tab} className="word-in m-0 mt-5 max-w-[54ch] text-[17px] leading-relaxed text-[#25372E]">
            {txt.text}
          </p>

          <Reveal>
            <div
              role="tablist"
              aria-label={t.togoCards.tabsAria}
              className="mt-9 grid w-full max-w-[54ch] grid-cols-3 gap-1.5 rounded-full border border-[#E6E4DA] bg-white p-1.5 shadow-[0_14px_38px_-28px_rgba(14,70,55,0.6)]"
            >
              {TOGO_CARDS.map((c, i) => (
                <button
                  key={c.href}
                  type="button"
                  role="tab"
                  id={`togo-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="togo-panel"
                  onClick={() => pick(i)}
                  className={`flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-2 py-3 text-[13px] font-semibold transition-colors duration-300 sm:gap-2.5 sm:px-5 sm:text-sm ${
                    i === active ? c.bg : 'text-forest hover:bg-cream'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 rounded-full ${i === active ? 'bg-current opacity-60' : c.dot}`}
                  />
                  {t.togoCards.cards[i].tab}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <a
              href={lz('/togo', lang)}
              title={txt.linkLabel}
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-forest px-7 py-4 font-semibold text-cream transition-colors hover:bg-pine"
            >
              {t.togoCards.more}
              <span aria-hidden="true" className="text-sun transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                →
              </span>
            </a>
          </Reveal>
        </div>

        {/* Volet illustré */}
        <Reveal delay={120}>
          <div
            id="togo-panel"
            role="tabpanel"
            aria-labelledby={`togo-tab-${active}`}
            className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_40px_90px_-50px_rgba(14,70,55,0.85)] lg:aspect-[5/4]"
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') paused.current = true;
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === 'mouse') paused.current = false;
            }}
          >
            {card.images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={i === shot ? txt.shots[i].alt : ''}
                fill
                className="object-cover transition-opacity duration-700 motion-reduce:transition-none"
                style={{ opacity: i === shot ? 1 : 0 }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={active === 0 && i === 0}
              />
            ))}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40" />
            {/* Voile bas dédié : les pastilles restent lisibles quelle que soit la photo. */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

            <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] ${card.bg}`}>
                  {txt.tab}
                </span>
                <span className="rounded-full bg-black/45 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.12em] text-cream backdrop-blur-sm">
                  {String(shot + 1).padStart(2, '0')} / {String(shots).padStart(2, '0')}
                </span>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t.togoCards.prev}
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-black/40 text-cream backdrop-blur-sm transition-colors hover:bg-cream hover:text-forest"
                >
                  <Chevron dir="left" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t.togoCards.next}
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-cream/90 text-forest transition-colors hover:bg-sun"
                >
                  <Chevron dir="right" />
                </button>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 text-cream sm:p-8">
              <div className="flex gap-1.5">
                {card.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setShot(i)}
                    aria-label={txt.shots[i].title}
                    aria-current={i === shot}
                    className={`h-1.5 cursor-pointer rounded-full border-0 p-0 transition-[width,background-color] duration-500 ${
                      i === shot ? `w-7 ${card.dot}` : 'w-4 bg-cream/40 hover:bg-cream/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
