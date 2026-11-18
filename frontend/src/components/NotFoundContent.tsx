'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/i18n/dict';
import { lz } from '@/i18n/lang';
import { useLang } from '@/i18n/useLang';
import { AccentTitle, SectionKicker } from './SectionKicker';

/**
 * Page 404 : le visiteur s'est égaré dans une allée de l'exposition. Un grand
 * « 4 0 4 » dont le zéro est un médaillon photo cerné d'un anneau « Vous êtes
 * ici », puis le plan de l'exposition pour repartir.
 * `not-found.tsx` ne reçoit pas `params` : la langue est lue depuis l'URL.
 */
export function NotFoundContent() {
  const lang = useLang();
  const t = getDictionary(lang).notFound;
  const path = usePathname() ?? '/';
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Le document 404 racine est rendu avec lang="fr" : on l'aligne sur l'URL.
    document.documentElement.lang = lang;
    setCanGoBack(window.history.length > 1 && document.referrer.startsWith(window.location.origin));
  }, [lang]);

  const ring = t.youAreHere.repeat(2);

  return (
    <>
      <section
        aria-labelledby="notfound-title"
        className="relative isolate overflow-hidden bg-ink px-5 pb-24 pt-36 text-cream sm:px-8 lg:px-14"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image src="/design/osaka/public-nuit.jpg" alt="" fill className="object-cover opacity-40" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
          {/* Quadrillage d'un plan d'exposition. */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(243,241,234,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(243,241,234,0.06)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </div>

        <div className="hero-in mx-auto flex max-w-[1360px] flex-col items-center text-center">
          <SectionKicker tone="dark">{t.kicker}</SectionKicker>

          <p
            aria-hidden="true"
            className="m-0 mt-8 flex items-center justify-center gap-[0.04em] font-display text-[clamp(120px,24vw,320px)] font-semibold leading-none tracking-[-0.06em] text-cream"
          >
            <span>4</span>
            <span className="relative mx-[0.04em] inline-block h-[0.78em] w-[0.78em] shrink-0">
              <span className="absolute inset-[11%] overflow-hidden rounded-full ring-1 ring-cream/20">
                <Image src="/design/osaka/pavillon-panneaux.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 40vw, 260px" />
                <span className="absolute inset-0 bg-gradient-to-tr from-forest/60 via-transparent to-sun/20" />
              </span>
              <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
                <defs>
                  <path id="nf-ring" d="M100,100 m-90,0 a90,90 0 1,1 180,0 a90,90 0 1,1 -180,0" />
                </defs>
                <circle cx="100" cy="100" r="98" fill="none" stroke="#FFCE00" strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray="2 4" />
                <text fill="#FFCE00" fontSize="10.5" fontWeight="600" letterSpacing="2" style={{ textTransform: 'uppercase' }}>
                  <textPath href="#nf-ring" textLength="560" lengthAdjust="spacing">
                    {ring}
                  </textPath>
                </text>
              </svg>
              {/* L'épingle « vous êtes ici ». */}
              <span className="absolute left-1/2 top-1/2 grid h-[0.16em] w-[0.16em] -translate-x-1/2 -translate-y-1/2 place-items-center">
                <span className="absolute h-full w-full animate-ping rounded-full bg-blood/60 motion-reduce:animate-none" />
                <span className="relative h-[55%] w-[55%] rounded-full border-2 border-cream bg-blood" />
              </span>
            </span>
            <span>4</span>
          </p>

          <h1
            id="notfound-title"
            className="m-0 mt-8 max-w-[18ch] font-display text-[clamp(34px,5vw,64px)] font-semibold leading-[1] tracking-[-0.035em]"
          >
            <AccentTitle text={t.title} accent={t.accent} tone="dark" />
          </h1>
          <p className="mb-0 mt-6 max-w-[58ch] text-[clamp(16px,1.3vw,19px)] leading-relaxed text-mist">{t.para}</p>

          <p className="mb-0 mt-6 flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-xs text-cream/60">
            <span className="uppercase tracking-[0.12em]">{t.searched}</span>
            <code className="max-w-full truncate rounded-full border border-cream/15 bg-cream/5 px-3 py-1 text-cream/85 line-through decoration-blood decoration-2">
              {path}
            </code>
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={lz('/', lang)}
              className="inline-flex items-center gap-2 rounded-full bg-sun px-7 py-3.5 font-semibold text-forest transition-colors hover:bg-cream"
            >
              <span aria-hidden="true">←</span> {t.home}
            </a>
            {canGoBack && (
              <button
                type="button"
                onClick={() => window.history.back()}
                className="cursor-pointer rounded-full border border-cream/35 bg-transparent px-7 py-3.5 font-semibold text-cream transition-colors hover:border-sun hover:text-sun"
              >
                {t.back}
              </button>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="notfound-map" className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1360px]">
          <SectionKicker>{t.mapKicker}</SectionKicker>
          <h2 id="notfound-map" className="m-0 mt-5 font-display text-[clamp(30px,3.6vw,48px)] font-semibold leading-tight tracking-[-0.03em]">
            {t.mapTitle}
          </h2>

          <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {t.zones.map((z, i) => (
              <li key={z.href}>
                <a
                  href={lz(z.href, lang)}
                  className="group relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-[24px] border border-dashed border-forest/30 bg-paper p-7 transition-all duration-500 hover:-translate-y-1 hover:border-solid hover:border-forest hover:bg-forest hover:text-cream hover:shadow-[0_30px_60px_-34px_rgba(15,79,62,0.9)] motion-reduce:transition-none"
                >
                  <span className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-blood transition-colors group-hover:text-sun">
                    {t.zone} {String.fromCharCode(65 + i)}
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 place-items-center rounded-full border border-forest/20 text-base text-forest transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-sun group-hover:bg-sun group-hover:text-forest"
                    >
                      →
                    </span>
                  </span>
                  <span className="mt-10 block">
                    <span className="block font-display text-2xl font-semibold tracking-[-0.02em]">{z.label}</span>
                    <span className="mt-2 block text-[15px] leading-relaxed text-[#42574C] transition-colors group-hover:text-mist">
                      {z.note}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
