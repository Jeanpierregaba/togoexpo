import type { ReactNode } from 'react';

/** Fond de la section : `light` = crème ou blanc, `dark` = vert ou photo sombre.
 *  Il commande les deux couleurs d'accent de la section. */
export type Tone = 'light' | 'dark';

/** Pastille de section : un trait horizontal puis le nom de la section.
 *  Rouge sur fond clair, jaune sur fond vert — même couleur que le mot mis en
 *  avant du titre : c'est la seule des deux qui reste lisible sur chaque fond.
 *  Les sections ne sont plus numérotées. */
export function SectionKicker({
  children,
  tone = 'light',
  className = '',
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const text = tone === 'dark' ? 'text-sun' : 'text-blood';
  const bar = tone === 'dark' ? 'bg-sun' : 'bg-blood';
  return (
    <p className={`m-0 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] ${text} ${className}`}>
      <span aria-hidden="true" className={`h-0.5 w-7 shrink-0 ${bar}`} />
      {children}
    </p>
  );
}

/** Couleur du mot mis en avant dans un titre de section : rouge sur fond clair,
 *  jaune sur fond vert, comme la pastille. Le jaune sur blanc (1,26:1) et le rouge
 *  sur vert (3,4:1) ne passaient pas, on ne les alterne donc plus. */
export function accentClass(tone: Tone): string {
  return tone === 'dark' ? 'text-sun' : 'text-blood';
}

/** Met en avant `accent` à l'intérieur de `text`. Si le mot n'est pas trouvé
 *  (traduction remaniée), le titre s'affiche tel quel plutôt que de se casser. */
export function AccentTitle({
  text,
  accent,
  tone,
  breakBefore = false,
}: {
  text: string;
  accent?: string;
  tone: Tone;
  /** Passe le mot mis en avant à la ligne : titre sur deux lignes. */
  breakBefore?: boolean;
}) {
  if (!accent) return <>{text}</>;
  const at = text.indexOf(accent);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      {breakBefore && at > 0 && <br />}
      <span className={accentClass(tone)}>{accent}</span>
      {text.slice(at + accent.length)}
    </>
  );
}
