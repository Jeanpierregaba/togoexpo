'use client';
import { useEffect, useState } from 'react';
import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

type Variant = 'dark' | 'light' | 'soft';

/** Trois habillages : la carte sombre (bannières), la carte claire des pages
 *  d'édition, et la version compacte rouge des « Rendez-vous » de l'accueil. */
const SKIN = {
  dark: {
    box: 'rounded-2xl border border-white/12 bg-black/35 p-4 backdrop-blur-sm',
    over: 'text-cream',
    tile: 'min-w-[52px] rounded-xl bg-white/[0.07] px-2.5 py-2',
    value: 'text-[22px] text-cream',
    unit: 'text-cream/55',
    sep: 'text-cream/30',
  },
  light: {
    box: 'rounded-[24px] border border-[#D3D6C8] bg-white p-6 sm:p-8',
    over: 'text-forest',
    tile: 'min-w-[70px] rounded-2xl border border-[#D3D6C8] bg-paper px-3.5 py-3 sm:min-w-[84px]',
    value: 'text-[30px] text-forest sm:text-[38px]',
    unit: 'text-[#4F665A]',
    sep: 'text-forest/25',
  },
  soft: {
    box: 'rounded-2xl bg-blood p-2.5 shadow-[0_18px_40px_-24px_rgba(160,20,30,0.75)]',
    over: 'text-white',
    tile: 'min-w-[48px] rounded-xl bg-white/15 px-2 py-1.5 ring-1 ring-inset ring-white/20',
    value: 'text-[20px] text-white',
    unit: 'text-white/80',
    sep: 'text-white/55',
  },
} satisfies Record<Variant, Record<string, string>>;

function Tile({ value, unit, skin }: { value: string; unit: string; skin: (typeof SKIN)[Variant] }) {
  return (
    <span className={`grid gap-0.5 text-center ${skin.tile}`}>
      <span className={`font-display font-semibold leading-none tabular-nums ${skin.value}`}>{value}</span>
      <span className={`font-mono text-[9px] uppercase leading-none tracking-[0.1em] ${skin.unit}`}>{unit}</span>
    </span>
  );
}

function Sep({ skin }: { skin: (typeof SKIN)[Variant] }) {
  return (
    <span aria-hidden="true" className={`font-display text-lg leading-none ${skin.sep}`}>
      :
    </span>
  );
}

/** Compte à rebours en tuiles (jours · heures · minutes · secondes) pour la carte Rendez-vous. */
export function CountdownPanel({
  target,
  label,
  lang,
  variant = 'dark',
}: {
  target: string;
  label: string;
  lang: Lang;
  variant?: Variant;
}) {
  const t = getDictionary(lang);
  const skin = SKIN[variant];
  // null au premier rendu : serveur et client doivent produire le même HTML.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = new Date(target).getTime();
  const diff = now === null || Number.isNaN(time) ? null : time - now;
  const days = diff === null ? null : Math.ceil(diff / 864e5);
  const over = diff !== null && diff <= 0;

  return (
    <div className={skin.box}>
      {over ? (
        <p className={`m-0 font-display text-lg font-semibold ${skin.over}`}>{t.countdown.started}</p>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5" role="timer" aria-label={`${t.countdown.timerAria}${label}`}>
          <Tile skin={skin} value={days === null ? '—' : String(days)} unit={t.countdown.dLong} />
          <Sep skin={skin} />
          <Tile skin={skin} value={diff === null ? '—' : pad(Math.floor(diff / 36e5) % 24)} unit={t.countdown.hLong} />
          <Sep skin={skin} />
          <Tile skin={skin} value={diff === null ? '—' : pad(Math.floor(diff / 6e4) % 60)} unit={t.countdown.mLong} />
          <Sep skin={skin} />
          <Tile skin={skin} value={diff === null ? '—' : pad(Math.floor(diff / 1e3) % 60)} unit={t.countdown.sLong} />
        </div>
      )}
    </div>
  );
}
