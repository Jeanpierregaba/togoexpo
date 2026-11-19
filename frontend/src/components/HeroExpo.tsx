'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { SLIDES } from '@/lib/design';
import { getDictionary } from '@/i18n/dict';
import { localizePath, type Lang } from '@/i18n/lang';

const AUTOPLAY_MS = 3000;

export function HeroExpo({ lang, children }: { lang: Lang; children?: React.ReactNode }) {
  const t = getDictionary(lang);
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  // Lecture auto active sauf préférence de réduction des animations.
  // Initialisé à false pour un rendu serveur/client identique, ajusté au montage.
  const [playing, setPlaying] = useState(false);
  const paused = useRef(false);
  const lastAdvance = useRef(Date.now());

  const advance = () => {
    setActive((v) => (v + 1) % SLIDES.length);
    setCycle((c) => c + 1);
    lastAdvance.current = Date.now();
  };

  useEffect(() => {
    setPlaying(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (paused.current) return;
      advance();
    }, AUTOPLAY_MS);
    // Les navigateurs gèlent les timers des onglets cachés : au retour,
    // on avance immédiatement si un cycle complet s’est écoulé.
    const onVis = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastAdvance.current >= AUTOPLAY_MS) {
        advance();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [playing]);

  const go = (i: number) => {
    setActive(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setCycle((c) => c + 1);
  };

  const slide = SLIDES[active];
  const txt = t.hero.slides[active];
  const brand = slide.variant === 'brand';

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col overflow-hidden"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') paused.current = true;
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') paused.current = false;
      }}
    >
      <div aria-hidden="true" className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? 'auto' : 'none' }}
          >
          <Image
              src={s.image}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
              loading={i === 0 ? undefined : 'lazy'}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 via-[40%] to-black/60 to-[90%]" />
      </div>

      <div className="relative flex flex-1 flex-col justify-end px-5 pb-8 pt-36 sm:px-8 lg:px-14 lg:pb-14">
      <div className="hero-in mx-auto w-full max-w-[1360px] [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">
        <div className="mb-7 flex flex-wrap gap-2.5 font-mono text-xs uppercase tracking-[0.08em]">
          <span className="rounded-full bg-blood px-3 py-1.5 text-white">{t.hero.badge}</span>
        </div>
        <h1
          id="hero-title"
          className={`m-0 font-display font-semibold ${
            brand
              ? 'text-[clamp(46px,10vw,140px)] uppercase leading-[0.86] tracking-[-0.055em]'
              : 'text-[clamp(36px,6vw,75px)] leading-[0.95] tracking-[-0.04em]'
          }`}
        >
          {brand ? (
            <span key={`${slide.id}-${cycle}`} className="block">
              {txt.t1} <span className="title-rule relative inline-block">{txt.t2}</span>
            </span>
          ) : (
            <>
              <span className="block">{txt.t1}</span>
              <span className="block overflow-hidden">
                <span key={`${slide.id}-${cycle}`} className={cycle > 0 ? 'word-in block text-left text-sun' : 'block text-left text-sun'}>
                  {txt.t2}
                </span>
              </span>
            </>
          )}
        </h1>
        <div className="mt-8 grid items-end gap-7 md:grid-cols-2">
          <div className="flex flex-wrap gap-3">
            <a href={localizePath(slide.cta1.href, lang)} className="inline-flex items-center gap-2.5 rounded-full bg-sun px-6 py-4 font-semibold text-forest transition-colors hover:bg-white">
              {txt.cta1} <span aria-hidden="true">→</span>
            </a>
            <a href={localizePath(slide.cta2.href, lang)} className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-black/25 px-6 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-forest">
              {txt.cta2}
            </a>
          </div>
          <p
            key={`p-${slide.id}-${cycle}`}
            className={`m-0 leading-relaxed text-mist ${
              // Slide de marque : même colonne que les autres slides, texte un
              // peu plus petit pour tenir sur deux lignes (coupure `\n` du
              // dictionnaire) sur grand écran.
              brand ? 'text-[clamp(14px,1.08vw,16px)] xl:whitespace-pre-line' : 'max-w-[46ch] text-[clamp(16px,1.3vw,19px)]'
            }`}
          >
            {txt.para}
          </p>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <div className="flex gap-2" role="tablist" aria-label={t.hero.chooseAria}>
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`${s.countdown?.label ?? t.hero.slides[i].t1} : ${t.hero.slides[i].t1} ${t.hero.slides[i].t2}`}
                onClick={() => go(i)}
                className="h-2 cursor-pointer rounded-full border-0 transition-all"
                style={{ width: i === active ? 32 : 8, background: i === active ? '#FFCE00' : 'rgba(255,255,255,.35)' }}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
      {children && <div className="relative">{children}</div>}
    </section>
  );
}
