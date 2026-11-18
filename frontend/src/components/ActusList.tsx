'use client';
import { useMemo, useState } from 'react';
import type { PostCategory, PostListItem } from '@/lib/mappers';
import { norm } from '@/lib/text';
import { getDictionary } from '@/i18n/dict';
import { lz, type Lang } from '@/i18n/lang';
import { ActuCard } from './ActuCard';
import { Reveal } from './Reveal';

const ALL = 'tout';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <circle cx={11} cy={11} r={7} />
    <path d="m20 20-3.6-3.6" />
  </svg>
);

/** Liste des actualités : filtres par catégorie du CMS et recherche instantanée,
 *  au-dessus des mêmes cartes colorées que l'accueil. */
export function ActusList({
  posts,
  lang,
  startIndex = 0,
}: {
  posts: PostListItem[];
  lang: Lang;
  /** Décalage de numéro et de teinte : la mise en avant occupe déjà le premier rang. */
  startIndex?: number;
}) {
  const t = getDictionary(lang);
  const [cat, setCat] = useState(ALL);
  const [query, setQuery] = useState('');

  // Filtres construits sur les catégories réellement portées par les articles.
  const categories = useMemo(() => {
    const seen: PostCategory[] = [];
    for (const p of posts) {
      for (const c of p.categories) if (!seen.some((s) => s.slug === c.slug)) seen.push(c);
    }
    return seen;
  }, [posts]);

  const visible = useMemo(() => {
    const q = norm(query.trim());
    return posts.filter((p) => {
      if (cat !== ALL && !p.categories.some((c) => c.slug === cat)) return false;
      if (!q) return true;
      return norm(`${p.title} ${p.excerpt} ${p.categories.map((c) => c.name).join(' ')}`).includes(q);
    });
  }, [posts, cat, query]);

  const filtering = cat !== ALL || query.trim() !== '';

  return (
    <>
      {/* Filtres et recherche sur la même ligne ; sans catégorie en CMS, la recherche
          occupe la ligne seule. */}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        {categories.length > 0 ? (
          <div role="tablist" aria-label={t.actusIdx.h1} className="flex flex-wrap gap-2.5">
            {[{ slug: ALL, name: t.actusIdx.all }, ...categories].map((c) => (
              <button
                key={c.slug}
                type="button"
                role="tab"
                aria-selected={cat === c.slug}
                onClick={() => setCat(c.slug)}
                className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  cat === c.slug ? 'bg-forest text-cream' : 'border border-forest/20 text-forest hover:border-forest'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}

        <div className="relative w-full max-w-[420px]">
          <span aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-forest/40">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.actusIdx.searchPh}
            aria-label={t.actusIdx.searchAria}
            className="w-full rounded-full border border-[#DEE2D5] bg-paper py-3.5 pl-[52px] pr-14 text-[15px] text-forest outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#7D9388] focus:border-pine focus:shadow-[0_0_0_4px_rgba(0,106,78,0.12)] [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.actusIdx.clear}
              className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-[#ECE9DF] text-forest transition-colors hover:bg-forest hover:text-sun"
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-[#D3D6C8] pt-8">
        {filtering && (
          <p aria-live="polite" className="mb-6 mt-0 font-mono text-xs uppercase tracking-[0.1em] text-[#4F665A]">
            {visible.length} {visible.length > 1 ? t.actusIdx.countMany : t.actusIdx.countOne}
          </p>
        )}

        {visible.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-forest/25 bg-paper p-10 text-center">
            <p className="m-0 font-display text-2xl font-semibold tracking-tight">{t.actusIdx.noResult}</p>
            <a
              href={lz('/contact', lang)}
              className="mt-4 inline-block border-b-2 border-pine pb-0.5 font-semibold text-pine transition-colors hover:text-forest"
            >
              {t.actusIdx.noResultCta}
            </a>
          </div>
        ) : (
          <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={(i % 3) * 100} className="h-full">
                  <ActuCard post={p} index={startIndex + i} lang={lang} />
                </Reveal>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
