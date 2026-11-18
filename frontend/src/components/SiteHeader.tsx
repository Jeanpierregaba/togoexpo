'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { MOCK_EDITIONS, MOCK_EDITIONS_EN, MOCK_EDITIONS_JA, MOCK_UPCOMING, MOCK_UPCOMING_EN, MOCK_UPCOMING_JA } from '@/lib/editions';
import { getDictionary } from '@/i18n/dict';
import { baseSlug, lz, type Lang } from '@/i18n/lang';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher';
import { HeaderSocials } from './SocialGlyphs';

const PAST_BY_LANG = { fr: MOCK_EDITIONS, en: MOCK_EDITIONS_EN, ja: MOCK_EDITIONS_JA };
const UPCOMING_BY_LANG = { fr: MOCK_UPCOMING, en: MOCK_UPCOMING_EN, ja: MOCK_UPCOMING_JA };

/**
 * Menu « Archives » : slugs stables du CMS, libellés traduits.
 * Les noms officiels viennent du dictionnaire (`eventTypes`), les villes/pays
 * des listes par langue — pas de libellé français codé en dur.
 */
function archivesMenu(lang: Lang) {
  const t = getDictionary(lang);
  return {
    upcoming: UPCOMING_BY_LANG[lang].map((e) => ({
      slug: e.slug,
      name: t.eventTypes[baseSlug(e.slug)]?.name ?? `${e.ville} ${e.annee}`,
      place: `${e.ville}, ${e.pays}`,
      year: String(e.annee),
    })),
    past: PAST_BY_LANG[lang].map((e) => ({
      slug: e.slug,
      label: `${e.ville} ${e.annee}`,
      country: e.pays,
    })),
  };
}

function isActiveLink(pathname: string, href: string): boolean {
  const clean = pathname.replace(/^\/(fr|en|ja)/, '') || '/';
  if (href === '/#top' || href === '/') return clean === '/';
  if (href === '/archives') return clean.startsWith('/editions');
  return clean === href || clean.startsWith(`${href}/`);
}

const linkBase =
  'relative whitespace-nowrap rounded-full px-3 py-2.5 text-[15px] font-semibold text-cream/90 transition-colors hover:text-sun xl:px-4';

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const menu = archivesMenu(lang);
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setDrop(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrop(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drop]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">
      <nav
        aria-label={t.header.navAria}
        className="relative mx-auto flex h-16 w-full max-w-[1360px] items-center justify-between gap-4 rounded-full border border-white/10 bg-forest/90 px-4 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:h-[72px] sm:px-6"
      >
        <a href={lz('/', lang)} aria-label={`TogoExpo, ${t.nav[0].label}`} className="flex shrink-0 items-center">
          <Image src="/design/logo-togoexpo.webp" alt="Logo TogoExpo" width={90} height={52} className="h-[48px] w-auto sm:h-[52px]" priority />
        </a>
        <ul className="m-0 hidden list-none items-center gap-1 p-0 min-[960px]:flex min-[960px]:absolute min-[960px]:left-1/2 min-[960px]:-translate-x-1/2">
          {t.nav.map((l) =>
            l.href === '/archives' ? (
              <li
                key={l.href}
                className="relative"
                onMouseEnter={() => setDrop(true)}
                onMouseLeave={() => setDrop(false)}
                onFocus={() => setDrop(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDrop(false);
                }}
              >
                {/* « Archives » mène à la page des archives ; le menu s'ouvre au
                    survol et au focus pour aller droit à une édition. */}
                <a
                  href={lz('/editions', lang)}
                  aria-haspopup="true"
                  aria-expanded={drop}
                  className={`${linkBase} ${isActiveLink(pathname, l.href) ? 'text-sun' : ''}`}
                >
                  {l.label} <span aria-hidden="true" className="text-xs">▾</span>
                  {isActiveLink(pathname, l.href) && (
                    <span aria-hidden="true" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-sun xl:inset-x-4" />
                  )}
                </a>
                {drop && (
                  <div className="absolute left-1/2 top-full z-50 w-[400px] max-w-[90vw] -translate-x-1/2 pt-4">
                    <div className="overflow-hidden rounded-3xl bg-white text-forest shadow-2xl">
                      {/* L'intitulé mène lui-même à la page des archives, sur une
                          seule ligne. */}
                      <a
                        href={lz('/editions', lang)}
                        className="group flex items-center justify-between gap-4 px-6 pb-4 pt-5 transition-colors hover:text-blood"
                      >
                        <span className="whitespace-nowrap font-display text-lg font-semibold">{t.archivesMenu.title}</span>
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </a>
                      <p className="m-0 px-6 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-blood">
                        {t.archivesMenu.upcoming}
                      </p>
                      <ul className="m-0 list-none p-3 pt-2">
                        {menu.upcoming.map((u) => (
                          <li key={u.slug}>
                            <a
                              href={lz(`/editions/${u.slug}`, lang)}
                              className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3 transition-colors hover:bg-sun/40"
                            >
                              <span>
                                <span className="block font-display text-[17px] font-semibold leading-tight">{u.name}</span>
                                <span className="mt-0.5 block text-sm text-[#42574C]">{u.place}</span>
                              </span>
                              <span className="shrink-0 rounded-lg bg-sun/50 px-2.5 py-1 font-mono text-xs font-bold">
                                {u.year}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-forest/10 px-6 pb-2 pt-4">
                        <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-forest/50">
                          {t.archivesMenu.past}
                        </p>
                      </div>
                      <ul className="m-0 list-none px-3 pb-4">
                        {menu.past.map((p) => (
                          <li key={p.slug}>
                            <a
                              href={lz(`/editions/${p.slug}`, lang)}
                              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-cream"
                            >
                              <span className="font-medium">{p.label}</span>
                              <span className="font-mono text-xs uppercase tracking-[0.08em] text-forest/50">{p.country}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ) : (
              <li key={l.href} className="relative">
                <a href={lz(l.href, lang)} className={`${linkBase} ${isActiveLink(pathname, l.href) ? 'text-sun' : ''}`}>
                  {l.label}
                  {isActiveLink(pathname, l.href) && (
                    <span aria-hidden="true" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-sun xl:inset-x-4" />
                  )}
                </a>
              </li>
            ),
          )}
        </ul>
        <div className="flex items-center gap-3">
          <div className="hidden min-[1100px]:block">
            <HeaderSocials />
          </div>
          <LanguageSwitcher />
          <button
            type="button"
            aria-label={t.header.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/25 bg-transparent text-lg text-white min-[960px]:hidden"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      {open && (
        <div className="mx-auto mt-2 max-w-[1360px] rounded-[28px] border border-white/10 bg-forest/95 backdrop-blur-xl min-[960px]:hidden">
          <ul className="m-0 mx-auto flex max-w-[1360px] list-none flex-col gap-0.5 px-5 py-4 font-display text-[22px] font-medium sm:px-8">
            {t.nav.map((l) => (
              <li key={l.href}>
                {l.href === '/archives' ? (
                  <a href={lz('/editions', lang)} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 transition-colors hover:bg-white/10">
                    {l.label}
                  </a>
                ) : (
                  <a href={lz(l.href, lang)} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 transition-colors hover:bg-white/10">
                    {l.label}
                  </a>
                )}
                {l.href === '/archives' && (
                  <ul className="m-0 mb-2 ml-4 list-none border-l border-white/15 p-0 pl-4 font-body text-base font-normal">
                    {[...menu.upcoming.map((u) => ({ slug: u.slug, label: u.name })), ...menu.past].map((e) => (
                      <li key={e.slug}>
                        <a href={lz(`/editions/${e.slug}`, lang)} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-cream/80 transition-colors hover:bg-white/10 hover:text-cream">
                          {e.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="px-4 pb-2 pt-3">
              <HeaderSocials />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
