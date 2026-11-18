import type { ReactNode } from 'react';
import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';
import { Reveal } from './Reveal';
import { SectionKicker } from './SectionKicker';

type Social = {
  name: string;
  handle: string;
  href: string;
  circle: string;
  icon: ReactNode;
};

const SOCIALS: Social[] = [
  {
    name: 'Facebook',
    handle: '@TogoExpoOfficiel',
    href: 'https://www.facebook.com/TogoExpoOfficiel/',
    circle: 'bg-[#1877F2]',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <path
          fill="#fff"
          d="M14.5 8.5H17V5h-2.5c-2.5 0-4.5 2-4.5 4.5V12H8v3.5h2V22h3.5v-6.5h2.4l.6-3.5h-3V9.7c0-.7.3-1.2 1-1.2Z"
        />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    handle: '@togoexpoofficiel',
    href: 'https://www.instagram.com/togoexpoofficiel/',
    circle: 'bg-[linear-gradient(45deg,#F9CE34,#EE2A7B_55%,#6228D7)]',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8" fill="none" stroke="#fff" strokeWidth={2}>
        <rect x={4} y={4} width={16} height={16} rx={4.5} />
        <circle cx={12} cy={12} r={3.4} />
        <circle cx={16.9} cy={7.1} r={1.3} fill="#fff" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    handle: 'Togo Expo',
    href: 'https://www.linkedin.com/company/106336470/',
    circle: 'bg-[#0A66C2]',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <path
          fill="#fff"
          d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z"
        />
      </svg>
    ),
  },
  {
    name: 'Flickr',
    handle: 'Togo Expo',
    href: 'https://www.flickr.com/photos/190367340@N06/',
    circle: 'bg-[linear-gradient(90deg,#0063DC_50%,#FF0084_50%)]',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <circle cx={8.3} cy={12} r={3.1} fill="#fff" />
        <circle cx={15.7} cy={12} r={3.1} fill="#fff" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    handle: '@togoexpoofficiel7522',
    href: 'https://www.youtube.com/@togoexpoofficiel7522',
    circle: 'bg-[#FF0000]',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <rect x={3.5} y={6} width={17} height={12} rx={3.5} fill="#fff" />
        <path d="M10.4 9.7v4.6l4.1-2.3-4.1-2.3Z" fill="#FF0000" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    handle: '@togoexpoofficiel',
    href: 'https://www.tiktok.com/@togoexpoofficiel',
    circle: 'bg-[#010101]',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <path
          fill="#fff"
          d="M14.1 3h2.4c.2 1.5 1.1 2.8 2.4 3.4.6.3 1.2.4 1.9.5v2.5a7 7 0 0 1-4.2-1.4v5.9a5.5 5.5 0 1 1-5.5-5.5c.3 0 .5 0 .8.1v2.5a3 3 0 1 0 2.2 2.9V3Z"
        />
      </svg>
    ),
  },
];

/** Bande pleine largeur « Communauté officielle », posée sur une photo que le
 *  défilement laisse immobile : le fond est attaché au cadre d'affichage
 *  (`bg-fixed`), seule la section glisse par-dessus. Sur iOS, où l'attachement
 *  fixe n'est pas appliqué, l'image défile simplement avec la section. */
export function Community({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  return (
    <section id="communaute" aria-labelledby="community-title" className="relative isolate w-full overflow-hidden bg-forest text-cream">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[url('/design/communaute-danse.jpg')] bg-cover bg-fixed bg-center"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/30 to-black/60" />

      <div className="mx-auto grid max-w-[1360px] gap-12 px-5 py-[126px] sm:px-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-center lg:px-14 lg:py-[161px]">
        <div>
          <Reveal>
            <SectionKicker tone="dark">{t.community.kicker}</SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="community-title" className="m-0 mt-4 font-display text-[clamp(34px,4.6vw,53px)] font-semibold leading-[1.02] tracking-[-0.03em]">
              {t.community.title}
            </h2>
          </Reveal>
          <Reveal>
            <p className="m-0 mt-5 max-w-xl text-[clamp(15px,1.2vw,18px)] leading-relaxed text-cream/80">{t.community.para}</p>
          </Reveal>
        </div>
        <ul className="m-0 grid list-none grid-cols-3 gap-x-6 gap-y-10 p-0 sm:gap-x-8">
          {SOCIALS.map((s, i) => (
            <li key={s.name} className="min-w-0 text-center">
              <Reveal delay={i * 70}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${s.name} — ${s.handle}`}
                  className={`mx-auto grid h-16 w-16 place-items-center rounded-full shadow-[0_18px_36px_-20px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:h-20 sm:w-20 ${s.circle}`}
                >
                  {s.icon}
                </a>
                <p className="mt-3 text-sm font-semibold">{s.name}</p>
                <p className="mt-1 break-words px-1 font-mono text-[11px] leading-snug text-cream/65">{s.handle}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
