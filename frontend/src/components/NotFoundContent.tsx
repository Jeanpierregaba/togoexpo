'use client';
import { useEffect } from 'react';
import { getDictionary } from '@/i18n/dict';
import { LANGS, lz } from '@/i18n/lang';
import { useLang } from '@/i18n/useLang';
import { SectionKicker } from './SectionKicker';

// `not-found.tsx` ne reçoit pas `params` : la langue est lue depuis l'URL.
export function NotFoundContent() {
  const lang = useLang();
  const t = getDictionary(lang);

  // Le document 404 racine est rendu avec lang="fr" (pas de params côté serveur) :
  // on réaligne l'attribut sur la langue réellement détectée dans l'URL.
  useEffect(() => {
    document.documentElement.lang = LANGS.find((l) => l.code === lang)?.code ?? 'fr';
  }, [lang]);
  return (
    <div className="mx-auto max-w-2xl px-4 py-[100px] text-center">
      <SectionKicker tone="dark" className="justify-center">{t.notFound.kicker}</SectionKicker>
      <h1 className="mt-4 font-display text-4xl font-bold">{t.notFound.h1}</h1>
      <p className="mt-2 text-black/70">{t.notFound.para}</p>
      <div className="mt-6 flex justify-center gap-3">
        <a href={lz('/', lang)} className="rounded bg-togo-green px-4 py-2 text-sm text-white">{t.notFound.home}</a>
        <a href={lz('/editions', lang)} className="rounded border px-4 py-2 text-sm">{t.notFound.editions}</a>
        <a href={lz('/contact', lang)} className="rounded border px-4 py-2 text-sm">{t.notFound.contact}</a>
      </div>
    </div>
  );
}
