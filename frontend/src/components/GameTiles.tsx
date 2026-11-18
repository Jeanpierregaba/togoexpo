'use client';
import { useState } from 'react';
import Image from 'next/image';
import { BELGRADE_GAME_IMAGES } from '@/lib/belgrade';
import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';

/**
 * Les quatre jeux traditionnels (Adito, Ampé, Akonto, Vététré) en grandes
 * tuiles photo 2×2. Chaque tuile porte son fond photo (`BELGRADE_GAME_IMAGES`,
 * dans l'ordre des jeux), assombri par un voile dégradé pour garder les textes
 * lisibles ; pastille numéro 01–04, nom, catégorie et accroche en crème.
 *
 * **Effet « pion de jeu » au survol.** La tuile se soulève comme un pion que
 * l'on prend en main : elle monte de 6 px, penche légèrement d'un côté puis de
 * l'autre en alternance (tuiles 1 et 3 vers la droite, 2 et 4 vers la gauche)
 * et son ombre portée s'agrandit.
 *
 * **La règle du jeu au survol.** Un volet vert monte alors du bas de la tuile
 * et porte la description du jeu. Il est posé en absolu par-dessus la photo :
 * la tuile ne change pas de hauteur, la grille ne bouge pas. Le survol et le
 * clavier passent par CSS (`group-hover`, `group-focus-visible`), sans rendu
 * React ; la touche, elle, bascule l'état — d'où le bouton et son
 * `aria-expanded`. Sous `prefers-reduced-motion` tout se fait sans
 * déplacement, par simple apparition.
 */
export function GameTiles({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const pillar = t.belgrade.pillars[1];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2">
      {pillar.items.map((g, i) => {
        const img = BELGRADE_GAME_IMAGES[i];
        const shown = open === i;
        return (
          <li key={g.name}>
            <button
              type="button"
              onClick={() => setOpen((prev) => (prev === i ? null : i))}
              aria-expanded={shown}
              className={`group relative flex min-h-[360px] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-[24px] p-7 text-left text-cream shadow-[0_24px_48px_-24px_rgba(0,0,0,0.75)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_36px_60px_-24px_rgba(0,0,0,0.8)] hover:ring-2 hover:ring-sun focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sun motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:min-h-[420px] ${
                i % 2 === 0 ? 'hover:rotate-1 motion-reduce:hover:rotate-0' : 'hover:-rotate-1 motion-reduce:hover:rotate-0'
              }`}
            >
              <Image
                src={img.src}
                alt={g.name}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 44vw, 30vw"
                className={`object-cover ${img.position}`}
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

              {/* Face de repos : numéro, nom, catégorie, accroche. */}
              <span className="relative block">
                <span className="m-0 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest font-mono text-sm font-bold text-sun ring-2 ring-cream/30"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[clamp(26px,2.4vw,34px)] font-semibold leading-none tracking-[-0.02em]">
                    {g.name}
                  </span>
                </span>
                <span className="m-0 mt-4 block font-mono text-xs uppercase tracking-[0.12em] text-cream/75">{g.meta}</span>
                <span className="m-0 mt-2 block text-[16px] font-semibold leading-snug">{g.hook}</span>
              </span>

              {/* Volet de description, monté du bas par-dessus la photo. */}
              <span
                className="absolute inset-0 flex translate-y-8 flex-col justify-end gap-3 overflow-hidden bg-forest/95 p-7 opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.26,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
                style={shown ? { transform: 'translateY(0)', opacity: 1 } : undefined}
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-0.5 w-7 shrink-0 bg-sun" />
                  <span className="font-display text-[clamp(22px,2vw,28px)] font-semibold uppercase leading-none tracking-[-0.02em] text-cream">
                    {g.name}
                  </span>
                </span>
                <span className="block text-[13px] leading-relaxed text-cream/90 sm:text-[14px]">{g.text}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
