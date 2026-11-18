import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';

/**
 * Gabarit commun des bandes défilantes (accueil, Belgrade, Yokohama) : même
 * fond, même hauteur, même corps de texte, même séparateur. Chaque page garde
 * sa propre animation (`marquee-track` ou `play-marquee`), réglée sur la
 * longueur de sa liste.
 */
const TRACK_BASE =
  'flex w-max items-center whitespace-nowrap font-display text-[clamp(17px,1.8vw,26px)] font-semibold uppercase tracking-[-0.01em]';
export const BAND = 'relative shrink-0 overflow-hidden border-y border-white/10 bg-forest py-3';
export const TRACK = `${TRACK_BASE} gap-8`;
export const ITEM = 'flex items-center gap-8';
export const STAR = 'text-[0.55em] text-blood';

const GROUP_REPEATS = 4;

export function Marquee({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const next = t.marquee[0];
  const items = Array.from({ length: GROUP_REPEATS }, () => t.marquee).flat();
  return (
    <div aria-hidden="true" className={BAND}>
      <div className={`marquee-track ${TRACK_BASE}`}>
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center gap-8 pr-8">
            {items.map((c, i) => (
              <span key={`${group}-${c}-${i}`} className={`${ITEM} ${c === next ? 'text-sun' : 'text-cream'}`}>
                {c}
                <span className={STAR}>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
