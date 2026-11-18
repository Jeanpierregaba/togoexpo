'use client';
import { useState } from 'react';
import Image from 'next/image';
import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';

/** Fiche statistique bilingue « Welcome to Togo », servie depuis /public. */
const STATS_SHEET = '/documents/togo-fiche-statistiques.pdf';

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v11" />
    <path d="m7.5 11 4.5 4.5 4.5-4.5" />
    <path d="M5 19h14" />
  </svg>
);

/** Onglets « Histoire & culture » sur une seule colonne : la barre d'onglets, puis le
 *  texte, puis l'image de l'onglet actif et le téléchargement de la fiche de stats. */
export function TogoCultureTabs({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const TABS = t.togo.cultTabs;
  const [active, setActive] = useState(0);
  const tab = TABS[active];
  return (
    <div>
      <div role="tablist" aria-label={t.togo.cultTabsAria} className="flex flex-wrap gap-2.5">
        {TABS.map((tabItem, i) => (
          <button
            key={tabItem.id}
            type="button"
            role="tab"
            id={`cult-tab-${tabItem.id}`}
            aria-selected={i === active}
            aria-controls={`cult-panel-${tabItem.id}`}
            onClick={() => setActive(i)}
            className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              i === active ? 'bg-sun text-forest' : 'border border-forest/25 text-forest hover:border-forest'
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      <div
        key={`panel-${tab.id}`}
        id={`cult-panel-${tab.id}`}
        role="tabpanel"
        aria-labelledby={`cult-tab-${tab.id}`}
        className="word-in mt-10"
      >
        {/* Chapeau pleine largeur, puis le reste du texte sur deux colonnes
            typographiques : sur une pleine largeur, des lignes d'un seul tenant
            seraient trop longues à lire. */}
        <p className="m-0 max-w-[90ch] text-lg font-semibold leading-relaxed text-forest">{tab.paras[0]}</p>
        {tab.paras.length > 1 && (
          <div className="mt-5 lg:columns-2 lg:gap-12">
            {tab.paras.slice(1).map((p, i) => (
              <p key={i} className="m-0 mt-5 break-inside-avoid leading-relaxed text-[#42574C] first:mt-0">
                {p}
              </p>
            ))}
          </div>
        )}

        <figure className="relative m-0 mt-10 aspect-[4/3] overflow-hidden rounded-[24px] sm:aspect-[16/9] lg:aspect-[21/9]">
          {/* Photo en portrait ou de petite taille (`imageContain`) : affichée
              entière, sur un fond flouté tiré de la même image, plutôt que
              recadrée et agrandie. */}
          {'imageContain' in tab && tab.imageContain ? (
            <>
              <Image src={tab.image} alt="" aria-hidden="true" fill className="scale-110 object-cover blur-2xl" sizes="40vw" />
              <Image src={tab.image} alt={tab.imageAlt} fill className="object-contain" sizes="(max-width: 1360px) 100vw, 900px" />
            </>
          ) : (
            <Image
              src={tab.image}
              alt={tab.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1360px) 100vw, 1360px"
            />
          )}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 p-6 text-cream sm:p-8">
            <p className="m-0 font-display text-2xl font-semibold">{tab.label}</p>
            <p className="m-0 mt-1 text-sm text-cream/80">{tab.caption}</p>
          </figcaption>
        </figure>
      </div>

      <div className="mt-8">
        <a
          href={STATS_SHEET}
          download
          className="group inline-flex items-center gap-2.5 rounded-full bg-forest px-6 py-3.5 font-semibold text-cream transition-colors hover:bg-pine"
        >
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
            <DownloadIcon />
          </span>
          {t.togo.cultDlBtn}
        </a>
      </div>
    </div>
  );
}
