'use client';
import { useEffect, useState } from 'react';
import { getDictionary } from '@/i18n/dict';
import { lz } from '@/i18n/lang';
import { useLang } from '@/i18n/useLang';

/**
 * Page 404 : sobre, un grand « 404 », un message, deux boutons et quelques liens.
 * `not-found.tsx` ne reçoit pas `params` : la langue est lue depuis l'URL.
 */
export function NotFoundContent() {
  const lang = useLang();
  const t = getDictionary(lang).notFound;
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Le document 404 racine est rendu avec lang="fr" : on l'aligne sur l'URL.
    document.documentElement.lang = lang;
    setCanGoBack(window.history.length > 1 && document.referrer.startsWith(window.location.origin));
  }, [lang]);

  return (
    <section
      aria-labelledby="notfound-title"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink px-5 pb-20 pt-36 text-cream sm:px-8"
    >
      {/* Halo vert discret derrière le chiffre. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[min(90vw,720px)] w-[min(90vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest/40 blur-[120px]"
      />

      <div className="hero-in flex max-w-xl flex-col items-center text-center">
        <p className="m-0 rounded-full border border-cream/15 bg-cream/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-sun">
          {t.kicker}
        </p>

        <p
          aria-hidden="true"
          className="m-0 mt-6 bg-gradient-to-b from-cream to-cream/20 bg-clip-text font-display text-[clamp(120px,22vw,240px)] font-semibold leading-none tracking-[-0.06em] text-transparent"
        >
          404
        </p>

        <h1 id="notfound-title" className="m-0 mt-2 font-display text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.03em]">
          {t.title}
        </h1>
        <p className="mb-0 mt-4 text-[17px] leading-relaxed text-mist">{t.para}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={lz('/', lang)}
            className="rounded-full bg-sun px-7 py-3.5 font-semibold text-forest transition-colors hover:bg-cream"
          >
            {t.home}
          </a>
          {canGoBack && (
            <button
              type="button"
              onClick={() => window.history.back()}
              className="cursor-pointer rounded-full border border-cream/25 bg-transparent px-7 py-3.5 font-semibold text-cream transition-colors hover:border-cream"
            >
              {t.back}
            </button>
          )}
        </div>

        <ul className="m-0 mt-12 flex list-none flex-wrap justify-center gap-x-6 gap-y-2 p-0 text-sm">
          {t.links.map((l) => (
            <li key={l.href}>
              <a href={lz(l.href, lang)} className="text-cream/60 underline-offset-4 transition-colors hover:text-sun hover:underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
