'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LANGS, DEFAULT_LANG, isLang, switchPath } from './lang';
import { getDictionary } from './dict';

export function LanguageSwitcher() {
  const pathname = usePathname() ?? '/';
  const seg = pathname.split('/')[1];
  const current = isLang(seg) ? seg : DEFAULT_LANG;
  const t = getDictionary(current);
  const short = LANGS.find((l) => l.code === current)?.short ?? 'FR';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = () => setOpen(false);
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open ]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label={t.header.langAria}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-white/25 bg-transparent pl-2.5 pr-3 text-cream transition hover:border-sun hover:text-sun"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx={12} cy={12} r={9} />
          <path d="M3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3Z" />
        </svg>
        <span aria-hidden="true" className="font-mono text-xs font-bold leading-none tracking-[0.06em]">{short}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t.header.langListAria}
          className="absolute right-0 top-full z-50 m-0 mt-2 w-44 list-none rounded-2xl bg-white p-1.5 text-forest shadow-2xl"
        >
          {LANGS.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === current}>
              <a
                href={switchPath(pathname, l.code)}
                className={`flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors hover:bg-cream ${
                  l.code === current ? 'bg-cream' : ''
                }`}
              >
                <span>{l.label}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-forest/50">{l.short}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
