import type { ReactNode } from 'react';
import { SOCIALS } from '@/lib/design';

const GLYPHS: Record<string, ReactNode> = {
  Facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M14.5 8.5H17V5h-2.5c-2.5 0-4.5 2-4.5 4.5V12H8v3.5h2V22h3.5v-6.5h2.4l.6-3.5h-3V9.7c0-.7.3-1.2 1-1.2Z"
      />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x={4} y={4} width={16} height={16} rx={4.5} />
      <circle cx={12} cy={12} r={3.4} />
      <circle cx={16.9} cy={7.1} r={1.3} fill="currentColor" stroke="none" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z"
      />
    </svg>
  ),
  Flickr: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <circle cx={8.3} cy={12} r={3.4} fill="currentColor" />
      <circle cx={15.7} cy={12} r={3.4} fill="currentColor" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x={3.5} y={6} width={17} height={12} rx={3.5} />
      <path d="M10.4 9.7v4.6l4.1-2.3-4.1-2.3Z" fill="currentColor" stroke="none" />
    </svg>
  ),
};

/** `label` : début du nom accessible, traduit (« TogoExpo sur », « TogoExpo on »…). */
export function HeaderSocials({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${label} ${s.label}`}
          title={`${label} ${s.label}`}
          className="grid h-9 w-9 place-items-center rounded-full bg-sun text-forest transition hover:bg-forest hover:text-sun"
        >
          {GLYPHS[s.label]}
        </a>
      ))}
    </div>
  );
}
