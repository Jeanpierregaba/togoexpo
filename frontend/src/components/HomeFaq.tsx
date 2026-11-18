'use client';
import { useMemo, useState } from 'react';
import { getDictionary } from '@/i18n/dict';
import { lz, type Lang } from '@/i18n/lang';
import { norm } from '@/lib/text';
import { Reveal } from './Reveal';
import { SectionKicker } from './SectionKicker';

const EASE = 'cubic-bezier(.16,1,.3,1)';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <circle cx={11} cy={11} r={7} />
    <path d="m20 20-3.6-3.6" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] text-sun" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x={3} y={5} width={18} height={14} rx={3} />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export function HomeFaq({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(0);

  const items = useMemo(() => {
    const q = norm(query.trim());
    // L'index d'origine sert de numéro de fiche : il reste stable pendant la recherche.
    const all = t.faq.items.map((it, i) => ({ ...it, i }));
    return q ? all.filter((it) => norm(`${it.cat} ${it.q} ${it.a}`).includes(q)) : all;
  }, [query, t.faq.items]);

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-cream px-5 pb-[100px] text-forest sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1360px] border-t border-[#D3D6C8] pt-[100px]">
        <div className="flex flex-wrap items-stretch justify-between gap-x-10 gap-y-8">
          <div className="max-w-[52ch]">
            <Reveal>
              <SectionKicker className="mb-6">{t.faq.kicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="faq-title" className="m-0 font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.035em]">
                {t.faq.h2a}
                <br />
                <span className="text-blood">{t.faq.h2b}</span>
              </h2>
            </Reveal>
            <Reveal>
              <p className="mb-0 mt-6 text-[clamp(16px,1.3vw,19px)] leading-relaxed text-[#42574C]">{t.faq.para}</p>
            </Reveal>
          </div>
          <div className="flex flex-1 flex-col items-start justify-between gap-8 lg:items-end">
            <Reveal>
              <a
                href={lz('/contact', lang)}
                className="group inline-flex items-center gap-3 rounded-full bg-forest px-7 py-4 font-semibold text-cream transition-colors hover:bg-pine"
              >
                <MailIcon />
                {t.faq.cta}
                <span aria-hidden="true" className="inline-block text-sun transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Reveal>
            <Reveal className="w-full lg:max-w-[420px]">
              <div className="relative">
                <span aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-forest/40">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.faq.searchPh}
                  aria-label={t.faq.searchAria}
                  className="w-full rounded-full border border-[#DEE2D5] bg-paper py-4 pl-[52px] pr-14 text-[15px] text-forest outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#7D9388] focus:border-pine focus:shadow-[0_0_0_4px_rgba(0,106,78,0.12)] [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label={t.faq.clear}
                    className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-[#ECE9DF] text-forest transition-colors hover:bg-forest hover:text-sun"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        {query && (
          <p aria-live="polite" className="mt-4 font-mono text-xs uppercase tracking-[0.1em] text-[#4F665A]">
            {items.length} {items.length > 1 ? t.faq.countMany : t.faq.countOne}
          </p>
        )}

        {items.length === 0 ? (
          <div className="mt-8 rounded-[26px] border border-dashed border-forest/25 bg-paper p-10 text-center">
            <p className="m-0 font-display text-2xl font-semibold tracking-tight">{t.faq.noResult}</p>
            <a href={lz('/contact', lang)} className="mt-4 inline-block border-b-2 border-pine pb-0.5 font-semibold text-pine transition-colors hover:text-forest">
              {t.faq.noResultCta}
            </a>
          </div>
        ) : (
          <ul className="m-0 mt-8 flex list-none flex-col gap-4 p-0">
            {items.map((it, pos) => {
              const isOpen = open === it.i;
              return (
                <li key={it.q}>
                  <Reveal delay={pos * 60}>
                    <div
                      className={`rounded-[26px] transition-[box-shadow,background-color] duration-500 ${
                        isOpen
                          ? 'bg-white shadow-[0_26px_60px_-34px_rgba(14,70,55,0.55)]'
                          : 'bg-paper shadow-[0_14px_36px_-30px_rgba(14,70,55,0.5)]'
                      }`}
                    >
                      <h3 className="m-0">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`faq-panel-${it.i}`}
                          onClick={() => setOpen(isOpen ? -1 : it.i)}
                          className="grid w-full cursor-pointer grid-cols-[44px_1fr_34px] items-center gap-4 px-5 py-6 text-left sm:grid-cols-[56px_1fr_40px] sm:gap-6 sm:px-8 sm:py-7"
                        >
                          <span
                            aria-hidden="true"
                            className={`grid h-11 w-11 place-items-center rounded-2xl font-mono text-[13px] transition-colors duration-500 sm:h-14 sm:w-14 sm:text-sm ${
                              isOpen ? 'bg-forest text-sun' : 'bg-[#EFEDE3] text-forest/55'
                            }`}
                          >
                            {String(it.i + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-blood">{it.cat}</span>
                            <span className="mt-2 block font-display text-[clamp(18px,1.6vw,25px)] font-semibold leading-[1.15] tracking-[-0.02em]">
                              {it.q}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className={`grid h-9 w-9 place-items-center justify-self-end rounded-full transition-[transform,background-color,color] duration-500 sm:h-10 sm:w-10 ${
                              isOpen ? 'rotate-180 bg-forest text-sun' : 'bg-[#EFEDE3] text-forest/60'
                            }`}
                            style={{ transitionTimingFunction: EASE }}
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </span>
                        </button>
                      </h3>
                      <div
                        id={`faq-panel-${it.i}`}
                        aria-hidden={!isOpen}
                        className="grid transition-[grid-template-rows] duration-500 motion-reduce:transition-none"
                        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', transitionTimingFunction: EASE }}
                      >
                        <div className="overflow-hidden">
                          <p className="m-0 max-w-[80ch] px-5 pb-7 pt-1 leading-relaxed text-[#33473D] sm:pl-[116px] sm:pr-10">{it.a}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
