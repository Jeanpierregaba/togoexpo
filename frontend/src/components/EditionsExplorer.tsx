'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { Edition } from '@/lib/editions';
import { EDITION_DETAILS } from '@/lib/design';
import { getDictionary } from '@/i18n/dict';
import { baseSlug, lz, type Lang } from '@/i18n/lang';
import { Reveal } from './Reveal';
import { SectionKicker } from './SectionKicker';

// Courbe « ease-out expo » : départ franc, arrivée longue — c'est elle qui donne
// le glissé de l'accordéon. Même durée à l'ouverture et à la fermeture.
const EASE = 'cubic-bezier(.16,1,.3,1)';
const OPEN_GROW = 6; // la fiche ouverte occupe 6 parts contre 1 aux autres

// L'animation porte sur `flex-grow` : il s'applique à l'axe principal, donc la même
// règle sert aux colonnes (grand écran) et aux lignes (mobile), sans media query en
// JavaScript ni calcul de gouttières.

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx={12} cy={10} r={3} />
  </svg>
);

export function EditionsExplorer({ editions, lang }: { editions: Edition[]; lang: Lang }) {
  const t = getDictionary(lang);
  // Sélection initiale fidèle au dossier : la dernière édition passée (Osaka),
  // pas l’édition future (triées par année décroissante).
  const [sel, setSel] = useState(() => {
    const i = editions.findIndex((e) => e.annee <= new Date().getFullYear());
    return i >= 0 ? i : 0;
  });
  if (editions.length === 0) return null;

  // Les plus anciennes à gauche, comme une frise.
  // De la plus récente à la plus ancienne : Osaka en tête, Hanovre en fin de liste.
  const ordered = [...editions].sort((a, b) => b.annee - a.annee);
  const activeSlug = editions[sel]?.slug ?? editions[0].slug;


  return (
    <section id="editions" aria-labelledby="editions-title" className="relative bg-forest px-5 py-[100px] sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-7 lg:mb-14">
          <div>
            <Reveal>
              <SectionKicker tone="dark" className="mb-6">{t.explorer.kicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="editions-title" className="m-0 font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.035em]">
                {t.explorer.h2a}<br /><span className="text-sun">{t.explorer.h2b}</span>
              </h2>
            </Reveal>
            <Reveal>
              <p className="m-0 mt-6 max-w-[58ch] leading-relaxed text-white">{t.explorer.para}</p>
            </Reveal>
          </div>
          <Reveal>
            <a
              href={lz('/editions', lang)}
              className="inline-flex items-center gap-2.5 rounded-full bg-sun px-6 py-3.5 font-semibold text-forest transition-colors hover:bg-white hover:text-blood"
            >
              {t.explorer.all} <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>

        <Reveal>
          <ul className="m-0 flex h-[560px] list-none flex-col gap-3 p-0 md:h-[600px] md:flex-row lg:h-[660px]">
            {ordered.map((e) => {
              const key = baseSlug(e.slug);
              const d = EDITION_DETAILS[key];
              const detail = t.editionDetails[key];
              const on = e.slug === activeSlug;
              const name = `${e.ville} ${e.annee}`;
              const idx = editions.findIndex((x) => x.slug === e.slug);
              return (
                <li
                  key={e.slug}
                  className="relative min-h-0 min-w-0 overflow-hidden rounded-[20px] bg-deeppine transition-[flex-grow] duration-[900ms] motion-reduce:transition-none"
                  style={{ flexGrow: on ? OPEN_GROW : 1, flexBasis: 0, transitionTimingFunction: EASE }}
                >
                  {/* Visuel : net et cadré au centre quand la fiche est ouverte, assombri sinon. */}
                  {d?.image && (
                    <Image
                      src={d.image}
                      alt={on ? d.imageAlt : ''}
                      fill
                      className="object-cover transition-transform duration-[1200ms] motion-reduce:transition-none"
                      style={{ transform: on ? 'scale(1)' : 'scale(1.18)', transitionTimingFunction: EASE }}
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none"
                    style={{ opacity: on ? 1 : 0, background: 'linear-gradient(to top, rgba(0,0,0,.80) 8%, rgba(0,0,0,.14) 55%, rgba(0,0,0,.42) 100%)' }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-black/50 transition-opacity duration-700 motion-reduce:transition-none"
                    style={{ opacity: on ? 0 : 1 }}
                  />

                  {/* Surface de commande : couvre la fiche, passe sous le CTA une fois ouverte. */}
                  <button
                    type="button"
                    onClick={() => setSel(idx)}
                    onMouseEnter={() => setSel(idx)}
                    onFocus={() => setSel(idx)}
                    aria-expanded={on}
                    aria-label={t.explorer.openAria.replace('{name}', name)}
                    className="absolute inset-0 z-10 w-full cursor-pointer appearance-none border-0 bg-transparent p-0"
                  />

                  {/* État replié : année, ville à la verticale, flèche. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 flex flex-row items-center justify-between gap-3 px-4 py-4 transition-opacity duration-300 motion-reduce:transition-none md:flex-col"
                    style={{ opacity: on ? 0 : 1 }}
                  >
                    <span className="rounded-lg bg-black/55 px-2.5 py-1 font-mono text-[11px] font-bold text-cream backdrop-blur-sm">
                      {e.annee}
                    </span>
                    <span className="truncate font-display text-[19px] font-semibold tracking-tight text-cream md:[writing-mode:vertical-rl]">
                      {e.ville}
                    </span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 text-sm text-cream">
                      →
                    </span>
                  </span>

                  {/* État ouvert. Largeur figée : le texte ne se recompose pas pendant le glissé. */}
                  <span
                    aria-hidden={!on}
                    className="pointer-events-none absolute inset-0 z-20 block transition-opacity duration-500 motion-reduce:transition-none"
                    style={{ opacity: on ? 1 : 0, transitionDelay: on ? '180ms' : '0ms' }}
                  >
                    <span className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5 sm:p-6">
                      <span className="flex shrink-0 flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-sun px-3 py-1.5 font-mono text-[12px] font-bold text-forest">{e.annee}</span>
                        <span className="rounded-full bg-black/55 px-3.5 py-1.5 text-[13px] font-medium text-cream backdrop-blur-sm">
                          {t.explorer.kind}
                        </span>
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-black/55 px-3.5 py-1.5 text-[13px] font-medium text-cream backdrop-blur-sm">
                        <PinIcon />
                        {e.ville} · {e.pays}
                      </span>
                    </span>

                    <span className="absolute inset-x-0 bottom-0 block p-5 sm:p-7">
                      <span className="block w-[440px] max-w-[calc(100vw-4.5rem)]">
                        <span className="block font-display text-[clamp(30px,3.6vw,52px)] font-semibold leading-none tracking-[-0.035em] text-cream">
                          {name}
                        </span>
                        <span className="mt-4 block rounded-2xl border border-white/12 bg-black/50 p-4 backdrop-blur-sm">
                          <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-sun">{t.explorer.themeTitle}</span>
                          <span className="mt-1.5 block text-[15px] italic leading-snug text-cream">
                            «&nbsp;{detail?.theme ?? e.theme}&nbsp;»
                          </span>
                        </span>
                        <a
                          href={lz(`/editions/${e.slug}`, lang)}
                          tabIndex={on ? undefined : -1}
                          className="pointer-events-auto relative z-30 mt-4 inline-flex items-center gap-2.5 rounded-full bg-sun px-6 py-3.5 text-[15px] font-semibold text-forest transition-colors hover:bg-white"
                        >
                          {t.explorer.goTo.replace('{name}', name)} <span aria-hidden="true">→</span>
                        </a>
                      </span>
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
