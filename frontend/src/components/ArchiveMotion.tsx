'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/**
 * Les gestes qui donnent vie aux pages des participations passées.
 *
 * Une règle commune à tous : **le contenu ne dépend jamais du mouvement**. Le
 * rendu serveur montre déjà tout — la bonne photo, le bon chiffre, la bande
 * entière. Le script n'ajoute que le déplacement. S'il ne tourne pas, ou sous
 * `prefers-reduced-motion`, la page est simplement immobile, jamais vide.
 *
 * Les effets liés au défilement écrivent leur `transform` directement sur le
 * nœud, dans une frame : aucun rendu React pendant que l'on défile.
 */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Abonne `fn` au défilement et au redimensionnement, une frame à la fois. */
function onScrollFrame(fn: () => void) {
  let raf = 0;
  const tick = () => {
    raf = 0;
    fn();
  };
  const ask = () => {
    if (!raf) raf = window.requestAnimationFrame(tick);
  };
  fn();
  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', ask);
  return () => {
    window.removeEventListener('scroll', ask);
    window.removeEventListener('resize', ask);
    if (raf) window.cancelAnimationFrame(raf);
  };
}

/* ------------------------------------------------------------------ */
/* Bannière : diaporama lent                                           */
/* ------------------------------------------------------------------ */

/**
 * Le fond de la bannière : quelques photographies qui se succèdent en fondu,
 * chacune avançant très lentement vers le spectateur. Les petits traits en bas
 * à droite disent où l'on en est ; celui de la photo en cours se remplit sur la
 * durée de la pose. Sans mouvement autorisé, la première photo reste seule.
 */
export function HeroSlides({ slides }: { slides: string[] }) {
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (reduced() || slides.length < 2) return;
    setLive(true);
    const id = window.setInterval(() => {
      // Un onglet caché ne fait pas défiler les photos dans le vide.
      if (document.visibilityState === 'visible') setI((v) => (v + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <>
      {slides.map((src, k) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={k === 0}
          sizes="100vw"
          quality={90}
          className={`object-cover transition-opacity duration-[1600ms] ease-out motion-reduce:transition-none ${
            k === i ? 'opacity-100' : 'opacity-0'
          } ${live && k === i ? (k % 2 === 0 ? 'kenburns-a' : 'kenburns-b') : ''}`}
        />
      ))}
      {live && (
        <div className="absolute bottom-6 right-5 z-10 hidden gap-2 sm:flex sm:right-8 lg:right-14">
          {slides.map((src, k) => (
            <span key={src} className="relative block h-0.5 w-9 overflow-hidden rounded-full bg-cream/30">
              <span
                key={k === i ? `on-${i}` : 'off'}
                className={`absolute inset-0 origin-left bg-sun ${k === i ? 'slide-fill' : k < i ? '' : 'scale-x-0'}`}
              />
            </span>
          ))}
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Lecture : barre de progression                                      */
/* ------------------------------------------------------------------ */

/** Le filet jaune en haut de la fenêtre : il avance avec la lecture. */
export function ScrollProgress() {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return onScrollFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    });
  }, []);
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] block h-[3px] origin-left scale-x-0 bg-sun"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Chiffres qui montent                                                */
/* ------------------------------------------------------------------ */

type Parsed = { head: string; tail: string; value: number; decimals: number; dec: string; thou: string; pad: number };

/**
 * Isole le nombre dans une valeur affichée (« +37,5 % », « 11 000 », « ≈ 500 »,
 * « 28 M », « 01 ») en retenant son écriture : séparateur de milliers, virgule
 * ou point décimal, zéro de tête. Un séparateur suivi de trois chiffres est un
 * séparateur de milliers, sinon c'est la décimale — ce qui distingue
 * « 11,000 » de « 37,5 ».
 */
function parse(text: string): Parsed | null {
  const m = text.match(/\d(?:[\d\s  .,]*\d)?/);
  if (!m || m.index === undefined) return null;
  const raw = m[0];
  const parts = raw.split(/([\s  .,])/);
  let dec = '';
  let thou = '';
  let decimals = 0;
  if (parts.length > 1) {
    const lastSep = parts[parts.length - 2];
    const lastPart = parts[parts.length - 1];
    if (lastPart.length === 3) thou = lastSep;
    else {
      dec = lastSep;
      decimals = lastPart.length;
      if (parts.length > 3) thou = parts[1];
    }
  }
  const intDigits = (dec ? raw.slice(0, raw.lastIndexOf(dec)) : raw).replace(/\D/g, '');
  const fracDigits = dec ? raw.slice(raw.lastIndexOf(dec) + 1) : '';
  return {
    head: text.slice(0, m.index),
    tail: text.slice(m.index + raw.length),
    value: Number(`${intDigits}.${fracDigits || '0'}`),
    decimals,
    dec,
    thou,
    pad: intDigits.startsWith('0') ? intDigits.length : 0,
  };
}

function format(p: Parsed, n: number): string {
  const [int, frac] = n.toFixed(p.decimals).split('.');
  let out = int.padStart(p.pad, '0');
  if (p.thou) out = out.replace(/\B(?=(\d{3})+(?!\d))/g, p.thou);
  return `${p.head}${out}${frac ? `${p.dec}${frac}` : ''}${p.tail}`;
}

/**
 * Un chiffre qui monte jusqu'à sa valeur en entrant à l'écran. Le serveur rend
 * la valeur exacte : sans script le chiffre est juste, et si l'animation ne
 * peut pas tourner un délai de garde repose la valeur finale.
 */
export function CountUp({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const p = parse(value);
    if (!el || !p || reduced()) return;
    let raf = 0;
    let guard = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, (now - t0) / 1400);
          // Sortie cubique : la fin ralentit, le chiffre se pose.
          setShown(format(p, p.value * (1 - (1 - k) ** 3)));
          if (k < 1) raf = requestAnimationFrame(step);
        };
        setShown(format(p, 0));
        raf = requestAnimationFrame(step);
        guard = window.setTimeout(() => setShown(value), 1900);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (guard) window.clearTimeout(guard);
    };
  }, [value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {shown}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Pellicule                                                           */
/* ------------------------------------------------------------------ */

/**
 * Une bande de photographies qui glisse à l'horizontale pendant que la page
 * défile à la verticale : on traverse la journée comme on tire une pellicule.
 * Décorative — les mêmes photographies sont dans la médiathèque, avec leurs
 * légendes — donc masquée aux lecteurs d'écran. Immobile, elle reste une
 * simple frise.
 */
export function FilmStrip({ photos }: { photos: { src: string; w: number; h: number }[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || reduced()) return;
    return onScrollFrame(() => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quand la bande entre par le bas, 1 quand elle sort par le haut.
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const travel = Math.max(0, track.scrollWidth - wrap.clientWidth);
      track.style.transform = `translate3d(${-p * travel}px,0,0)`;
    });
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="overflow-hidden bg-forest py-6 sm:py-8">
      <div ref={trackRef} className="flex w-max gap-3 px-5 will-change-transform sm:gap-4 sm:px-8 lg:px-14">
        {photos.map((p) => (
          <div
            key={p.src}
            className="relative h-[180px] shrink-0 overflow-hidden rounded-2xl sm:h-[240px] lg:h-[300px]"
            style={{ aspectRatio: `${p.w} / ${p.h}` }}
          >
            <Image src={p.src} alt="" fill className="object-cover" sizes="(max-width: 1024px) 60vw, 34vw" />
          </div>
        ))}
      </div>
    </div>
  );
}
