'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import type { MediaItem } from '@/lib/mappers';
import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';

export function MediathequeGallery({ items, lang }: { items: MediaItem[]; lang: Lang }) {
  const t = getDictionary(lang);
  const filters = useMemo(() => {
    const labels: Record<string, string> = {};
    const order: string[] = [];
    for (const it of items) {
      const key = it.editionSlug ?? 'actus';
      if (!(key in labels)) {
        labels[key] = it.editionLabel;
        order.push(key);
      }
    }
    return [{ key: 'tout', label: t.media.all }, ...order.map((key) => ({ key, label: labels[key] }))];
  }, [items, t.media.all]);

  const [filter, setFilter] = useState('tout');
  const [open, setOpen] = useState<number | null>(null);

  const visible = filter === 'tout' ? items : items.filter((it) => (it.editionSlug ?? 'actus') === filter);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open ]);

  useEffect(() => setOpen(null), [filter]);

  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-forest/30 p-10 text-center">
        <p className="m-0 font-display text-2xl font-semibold">{t.media.emptyTitle}</p>
        <p className="mx-auto mb-0 mt-3 max-w-[60ch] leading-relaxed text-[#42574C]">{t.media.emptyPara}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2.5" role="tablist" aria-label={t.media.crumb}>
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              filter === f.key
                ? 'bg-forest text-cream'
                : 'border border-forest/25 text-forest hover:border-forest'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-8 text-[#42574C]">{t.media.noneForFilter}</p>
      ) : (
        <ol className="mb-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((it, i) => (
            <li key={`${it.src}-${i}`}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`${t.media.viewAria}${it.title}`}
                className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[24px] border-0 p-0 text-left"
              >
                <Image
                  src={it.src}
                  alt={it.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 block p-5">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-sun">{it.editionLabel}</span>
                  <span className="mt-1 block truncate font-display text-xl font-semibold text-cream">{it.title}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
      {open !== null && visible[open] && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={visible[open].alt}
        >
          <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <span className="relative block h-[70vh] w-[90vw] max-w-4xl overflow-hidden rounded-[24px]">
              <Image src={visible[open].src} alt={visible[open].alt} fill className="object-contain" sizes="90vw" />
            </span>
            <figcaption className="mt-3 text-center text-sm text-cream">
              {visible[open].title} — {visible[open].editionLabel}
            </figcaption>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="mx-auto mt-3 block cursor-pointer rounded-full bg-sun px-5 py-2 text-sm font-semibold text-forest transition-colors hover:bg-white"
            >
              {t.media.close}
            </button>
          </figure>
        </div>
      )}
    </>
  );
}
