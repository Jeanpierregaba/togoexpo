'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { EditionDetail } from '@/lib/editions';
import { getDictionary, type Dict } from '@/i18n/dict';
import { baseSlug, editionPath, localizePath, type Lang } from '@/i18n/lang';
import { formatDate, stripTags } from '@/lib/mappers';
import { CountdownPanel } from './CountdownPanel';
import { Reveal } from './Reveal';
import { SectionKicker } from './SectionKicker';
import { AccentTitle } from './SectionKicker';

const AUTOPLAY_MS = 3000;

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx={12} cy={10} r={3} />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x={3} y={5} width={18} height={16} rx={3} />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

const SealIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={12} cy={9} r={5.5} />
    <path d="m8.5 14-1.3 7L12 18.6 16.8 21l-1.3-7" />
  </svg>
);

/** Bloc « icône + intitulé + valeur » des informations pratiques. */
function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-forest/15 bg-forest/[0.06] text-forest">
        {icon}
      </span>
      <span className="grid gap-1">
        <span className="font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-[#5B6F64]">{label}</span>
        <span className="max-w-[20ch] font-display text-[17px] font-semibold leading-tight text-forest">{value}</span>
      </span>
    </div>
  );
}

/** Contenu d'un rendez-vous. Toutes les fiches sont empilées dans la même
 *  cellule de grille : la carte garde la hauteur de la plus haute, donc une
 *  taille constante quelle que soit la fiche affichée. */
function EventPanel({ e, t, lang, hidden, animate, waiting }: { e: EditionDetail; t: Dict; lang: Lang; hidden: boolean; animate: boolean; waiting: boolean }) {
  // Les métadonnées vitrine sont indexées sur le slug FR de référence.
  const meta = t.eventTypes[baseSlug(e.slug)];
  const name = meta?.name ?? `${e.ville} ${e.annee}`;
  return (
    <div
      aria-hidden={hidden}
      className={`col-start-1 row-start-1 transition-opacity duration-500 ${hidden ? 'invisible opacity-0' : 'opacity-100'}`}
    >
      {/* Mobile : le visuel au-dessus du texte, sans voile. */}
      {e.image && (
        <div aria-hidden="true" className="relative aspect-video w-full lg:hidden">
          <Image src={e.image.src} alt="" fill className="object-cover" sizes="100vw" />
        </div>
      )}
      {/* Le texte, sur un panneau blanc translucide posé dans la zone claire
          du visuel : lisible sans assombrir l'image. */}
      <div className={`${animate ? 'ev-in' : waiting ? 'opacity-0 motion-reduce:opacity-100' : ''} px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:my-7 lg:ml-[max(56px,calc((100vw-1360px)/2))] lg:max-w-[min(720px,60%)] lg:rounded-[24px] lg:border lg:border-forest/10 lg:bg-white/85 lg:px-10 lg:py-11 lg:shadow-[0_30px_70px_-40px_rgba(14,70,55,0.55)] lg:backdrop-blur-md`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
        <span className="inline-flex items-center gap-2 rounded-full bg-sun px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-forest">
          <SealIcon />
          {t.upcoming.confirmed}
        </span>
        <span aria-hidden="true" className="text-forest/30">/</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#42574C]">{meta?.type ?? ''}</span>
      </div>

      <h3 className="m-0 mt-4 max-w-[22ch] lg:mt-7 font-display text-[clamp(28px,3vw,40px)] font-semibold leading-[1.02] tracking-[-0.035em] text-forest">
        {name}
      </h3>
      <p className="m-0 mt-2 max-w-[48ch] lg:mt-3 text-[clamp(15px,1.3vw,17px)] italic leading-snug text-blood">
        {t.upcoming.themeLabel} «&nbsp;{e.theme}&nbsp;»
      </p>

      {/* Filets portés par la bande elle-même : padding haut et bas égaux,
          donc contenu exactement centré entre les deux lignes. */}
      <div className="mt-5 border-y border-forest/15 py-4 lg:mt-8 lg:py-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Fact icon={<PinIcon />} label={t.upcoming.cityLabel} value={`${e.ville}, ${e.pays}`} />
          <Fact
            icon={<CalendarIcon />}
            label={t.upcoming.datesLabel}
            value={`${e.dateDebut ? formatDate(e.dateDebut, lang) : '—'} — ${e.dateFin ? formatDate(e.dateFin, lang) : '—'}`}
          />
        </div>
        {e.dateDebut && (
          <div className="mt-4 w-fit max-w-full lg:mt-6">
            <CountdownPanel target={e.dateDebut} label={name} lang={lang} variant="soft" />
          </div>
        )}
      </div>

      {e.pavillon && (
        <p className="m-0 mt-5 max-w-[52ch] lg:mt-8 text-[clamp(15px,1.2vw,16px)] leading-relaxed text-[#42574C]">
          {stripTags(e.pavillon)}
        </p>
      )}
      <a
        href={localizePath(editionPath(e.slug, lang), lang)}
        tabIndex={hidden ? -1 : undefined}
        className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-forest lg:mt-8 px-6 py-3 font-semibold text-cream transition-colors hover:bg-pine"
      >
        {t.upcoming.discoverNamed.replace('{name}', `${e.ville} ${e.annee}`)}
        <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
      </a>
      </div>
    </div>
  );
}

export function UpcomingEvents({ events, lang }: { events: EditionDetail[]; lang: Lang }) {
  const t = getDictionary(lang);
  const [active, setActive] = useState(0);
  // Démarre à false pour un rendu serveur/client identique, ajusté au montage.
  const [playing, setPlaying] = useState(false);
  const paused = useRef(false);
  // La carte ne s'anime qu'une fois la section à l'écran : sinon l'entrée se
  // jouerait hors de vue, au chargement.
  const stage = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setPlaying(events.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, [events.length]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (paused.current) return;
      setActive((v) => (v + 1) % events.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [playing, events.length]);

  if (events.length === 0) return null;

  return (
    <section id="rendez-vous" aria-labelledby="rendez-vous-title" className="bg-white pt-[100px] text-forest">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:box-content lg:px-14">
        <Reveal>
          <SectionKicker className="mb-6">{t.upcoming.kicker}</SectionKicker>
        </Reveal>
        <Reveal>
          <h2 id="rendez-vous-title" className="m-0 font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.035em]">
            <AccentTitle text={t.upcoming.h2} accent={t.upcoming.h2Accent} tone="light" breakBefore />
          </h2>
        </Reveal>
        <Reveal>
          <p className="mt-6 max-w-[70ch] text-[clamp(16px,1.3vw,19px)] leading-relaxed text-[#42574C]">{t.upcoming.para}</p>
        </Reveal>
      </div>

        <Reveal>
          <article
            ref={stage}
            className="group relative mt-12 overflow-hidden bg-white text-forest"
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
          >
            {/* Visuels en fondu croisé, sans voile ni recadrage : la zone suit le
                ratio 16:9 des images (contain, calé à droite si le panneau la
                rend plus haute). Grand écran seulement — sur mobile, chaque
                fiche porte son visuel au-dessus du texte. Les commandes du
                slider sont posées en bas à droite, sur l'image, dès 1360 px ;
                en dessous, elles passent sous le visuel pour ne pas toucher le panneau. */}
            <div className="relative grid grid-cols-1 lg:aspect-video lg:items-center min-[1360px]:pb-20">
            <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
              {events.map((ev, i) => (
                <div key={ev.slug} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === active ? 1 : 0 }}>
                  {ev.image ? (
                    <Image
                      src={ev.image.src}
                      alt=""
                      fill
                      className="object-contain object-right"
                      sizes="100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-ink" />
                  )}
                </div>
              ))}
            </div>

              {events.map((ev, i) => (
                <EventPanel key={ev.slug} e={ev} t={t} lang={lang} hidden={i !== active} animate={seen && i === active} waiting={!seen} />
              ))}
            </div>

            {events.length > 1 && (
              <div className="relative px-5 pb-6 sm:px-8 lg:px-14 lg:py-5 min-[1360px]:absolute min-[1360px]:bottom-7 min-[1360px]:right-[max(56px,calc((100vw-1360px)/2))] min-[1360px]:z-10 min-[1360px]:p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 min-[1360px]:justify-end">
                <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.upcoming.chooseAria}>
                  {events.map((ev, i) => (
                    <button
                      key={ev.slug}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      onClick={() => setActive(i)}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors ${
                        i === active
                          ? 'border-sun bg-sun text-forest shadow-[0_10px_24px_-14px_rgba(0,0,0,0.45)]'
                          : 'border-forest/15 bg-white/90 text-forest/75 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.35)] backdrop-blur-sm hover:border-forest/40 hover:text-forest'
                      }`}
                    >
                      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${i === active ? 'bg-forest' : 'bg-forest/35'}`} />
                      {String(i + 1).padStart(2, '0')}. {ev.ville} {ev.annee} ({ev.pays})
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? t.upcoming.pauseAria : t.upcoming.playAria}
                    aria-pressed={playing}
                    className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-forest/20 bg-white/90 text-forest shadow-[0_10px_24px_-14px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-colors hover:border-sun hover:bg-sun hover:text-forest"
                  >
                    <span aria-hidden="true">{playing ? '⏸' : '▶'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActive((active - 1 + events.length) % events.length)}
                    aria-label={t.upcoming.prevAria}
                    className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-forest/20 bg-white/90 text-forest shadow-[0_10px_24px_-14px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-colors hover:border-sun hover:bg-sun hover:text-forest"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setActive((active + 1) % events.length)}
                    aria-label={t.upcoming.nextAria}
                    className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-forest/20 bg-white/90 text-forest shadow-[0_10px_24px_-14px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-colors hover:border-sun hover:bg-sun hover:text-forest"
                  >
                    ›
                  </button>
                </div>
                </div>
              </div>
            )}
          </article>
        </Reveal>
    </section>
  );
}
