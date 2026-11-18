'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TOGO_BANDS, TOGO_DOTS, TOGO_LOME, TOGO_OUTLINE } from '@/lib/togo-outline';
import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';

const VB_X = -45;
const VB_Y = -18;
const VB_W = 290;
const VB_H = 560;

const ORDER = ['savanes', 'kara', 'centrale', 'plateaux', 'maritime'];

const CITY_LABEL: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' }> = {
  savanes: { dx: 7, dy: 3, anchor: 'start' },
  kara: { dx: -7, dy: 3, anchor: 'end' },
  centrale: { dx: -7, dy: 3, anchor: 'end' },
  plateaux: { dx: -7, dy: 3, anchor: 'end' },
  maritime: { dx: -7, dy: 3, anchor: 'end' },
};

/** Bornes horizontales du tracé dans le viewBox : les bandes de régions vont de
 *  x = 0 à x = 200. La fiche se pose au-delà, jamais dessus. */
const MAP_X0 = 0;
const MAP_X1 = 200;

/** Largeur de la fiche : au plus `CARD_MAX`, réduite à la marge disponible, et
 *  renvoyée sous la carte si l'on descend sous `CARD_MIN`. */
const CARD_MAX = 248;
const CARD_MIN = 150;
const GAP = 14;

type Box = { left: number; width: number } | null;

/**
 * Convertit un point du viewBox en pixels du conteneur. Le SVG garde le
 * `preserveAspectRatio` par défaut (« meet ») : le tracé est mis à l'échelle du
 * plus petit côté puis centré, il faut donc reproduire ce cadrage au lieu de
 * diviser par la seule largeur.
 */
function vbToPx(vx: number, vy: number, svg: SVGSVGElement): { x: number; y: number } {
  const rect = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  const scale = Math.min(rect.width / vb.width, rect.height / vb.height);
  return {
    x: (vx - vb.x) * scale + (rect.width - vb.width * scale) / 2,
    y: (vy - vb.y) * scale + (rect.height - vb.height * scale) / 2,
  };
}

export function TogoMap({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const regions = ORDER.map((id) => t.togo.regions.find((r) => r.id === id)!).filter(Boolean);
  const [activeId, setActiveId] = useState('maritime');
  const [open, setOpen] = useState(false);
  // Position horizontale de la fiche, calculée au clic : elle ne dépend que du
  // cadrage du SVG. `null` = pas la place sur les côtés, la fiche passe alors
  // sous la carte (écrans étroits), où elle ne masque rien non plus.
  const [box, setBox] = useState<Box>(null);
  // Position verticale, calculée après rendu : la hauteur dépend du texte de la
  // région et de la langue. La valeur vit aussi dans une ref, sinon l'effet qui
  // la calcule dépendrait de son propre résultat et boucler
  const [top, setTop] = useState(0);
  const topRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const activeIndex = regions.findIndex((r) => r.id === activeId);
  const active = regions[activeIndex] ?? regions[0];

  /** Côté et largeur : la fiche se loge dans la marge laissée par le tracé, du
   *  côté le plus large. En dessous de `CARD_MIN` elle passe sous la carte. */
  const measureBox = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mapLeft = vbToPx(MAP_X0, 0, svg).x;
    const mapRight = vbToPx(MAP_X1, 0, svg).x;
    const roomLeft = mapLeft;
    const roomRight = rect.width - mapRight;
    const width = Math.min(CARD_MAX, Math.max(roomLeft, roomRight) - GAP);
    if (width < CARD_MIN) {
      setBox(null);
      return;
    }
    setBox({ left: roomRight >= roomLeft ? mapRight + GAP : mapLeft - GAP - width, width });
  }, []);

  const select = (id: string) => {
    setActiveId(id);
    setOpen(true);
    measureBox();
  };

  /** Centrage vertical sur le chef-lieu de la région, rabattu dans le cadre. */
  const placeVertically = useCallback(() => {
    const svg = svgRef.current;
    const card = cardRef.current;
    if (!svg || !card || !box) return;
    const rect = svg.getBoundingClientRect();
    const dot = TOGO_DOTS[activeId];
    if (!dot) return;
    const y = vbToPx(dot[0], dot[1], svg).y;
    const next = Math.max(0, Math.min(rect.height - card.offsetHeight, y - card.offsetHeight / 2));
    if (Math.abs(topRef.current - next) < 1) return;
    topRef.current = next;
    setTop(next);
  }, [activeId, box]);

  useLayoutEffect(() => {
    placeVertically();
  }, [placeVertically, lang]);

  useEffect(() => {
    const onResize = () => {
      measureBox();
      placeVertically();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measureBox, placeVertically]);

  return (
    // À partir de `lg`, la boîte prend toute la hauteur que lui laisse la colonne
    // (titre + paragraphes) ; le SVG s'y recadre sans se déformer.
    // Carte pleine largeur : la fiche est posée dessus, à côté de la région.
    <div className="flex h-full flex-col">
        <div className="relative h-[520px] w-full lg:h-full lg:min-h-0 lg:flex-1">
          <svg ref={svgRef} viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`} role="group" aria-label={t.togo.mapAria} className="h-full w-full">
            <defs>
              <clipPath id="togo-real-clip">
                <path d={TOGO_OUTLINE} />
              </clipPath>
            </defs>
            <path d={TOGO_OUTLINE} fill="#0F5A45" stroke="rgba(14,70,55,.4)" strokeWidth={2} strokeLinejoin="round" />
            <g clipPath="url(#togo-real-clip)">
              {regions.map((r, i) => {
                const isActive = r.id === activeId;
                const [y0, y1] = TOGO_BANDS[i];
                return (
                  <g
                    key={r.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    aria-label={`${r.name} — ${t.togo.regionCapital}${r.capital}`}
                    onClick={() => select(r.id)}
                    onMouseEnter={() => setActiveId(r.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        select(r.id);
                      }
                    }}
                    className="cursor-pointer outline-none"
                  >
                    <title>{r.name}</title>
                    <rect
                      x={0}
                      y={y0}
                      width={200}
                      height={y1 - y0}
                      fill={isActive ? '#FFCE00' : '#14532D'}
                      opacity={isActive ? 1 : 0.5}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}
              {TOGO_BANDS.slice(1).map(([y]) => (
                <line key={y} x1={0} y1={y} x2={200} y2={y} stroke="rgba(255,255,255,.4)" strokeWidth={1.5} />
              ))}
            </g>
            {regions.map((r) => {
              const [dx, dy] = TOGO_DOTS[r.id];
              const isActive = r.id === activeId;
              return (
                <circle
                  key={`dot-${r.id}`}
                  cx={dx}
                  cy={dy}
                  r={isActive ? 6 : 4}
                  fill={isActive ? '#166C54' : '#fff'}
                  stroke="rgba(0,0,0,.25)"
                  strokeWidth={1}
                  className="pointer-events-none transition-all duration-300"
                />
              );
            })}
            <g transform={`translate(${TOGO_LOME[0]},${TOGO_LOME[1]})`} className="pointer-events-none">
              <path
                d="M0-5.5 L1.3-1.7 L5.5-1.7 L2.1 0.9 L3.2 4.9 L0 2.4 L-3.2 4.9 L-2.1 0.9 L-5.5-1.7 L-1.3-1.7 Z"
                fill="#FFCE00"
                stroke="#166C54"
                strokeWidth={1}
              />
              <title>Lomé</title>
            </g>
            {/* Pays limitrophes */}
            <g fontFamily="monospace" fontSize={9} letterSpacing={2} fill="#42574C" className="pointer-events-none">
              <text x={100} y={-4} textAnchor="middle">{t.togo.neighbors.burkina}</text>
              <text x={-41} y={263}>{t.togo.neighbors.ghana}</text>
              <text x={241} y={263} textAnchor="end">{t.togo.neighbors.benin}</text>
              <text x={100} y={544} textAnchor="middle" fontStyle="italic">{t.togo.neighbors.gulf}</text>
            </g>
            {/* Villes marquées */}
            <g fontSize={10.5} fontWeight={600} fill="#166C54" className="pointer-events-none" stroke="#F3F1EA" strokeWidth={3} paintOrder="stroke">
              {regions.map((r) => {
                const [dx, dy] = TOGO_DOTS[r.id];
                const pos = CITY_LABEL[r.id];
                return (
                  <text key={`city-${r.id}`} x={dx + pos.dx} y={dy + pos.dy} textAnchor={pos.anchor}>
                    {r.capital.split(' · ')[0]}
                  </text>
                );
              })}
              <text x={TOGO_LOME[0] - 8} y={TOGO_LOME[1] + 3} textAnchor="end">Lomé</text>
            </g>
          </svg>

          {/* Fiche posée dans la marge du cadre, à hauteur du chef-lieu : le tracé
              de la carte et la pastille de la région restent entièrement visibles. */}
          {open && box !== null && (
            <div
              key={activeId}
              role="status"
              aria-live="polite"
              className="word-in absolute z-10"
              style={{ left: `${box.left}px`, top: `${top}px`, width: `${box.width}px` }}
            >
              <div ref={cardRef} className="rounded-2xl bg-forest p-5 text-cream shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-sun">
                      {t.togo.regionOf} {String(activeIndex + 1).padStart(2, '0')} / 05
                    </p>
                    <p className="m-0 mt-1 font-display text-2xl font-semibold leading-none">{active.name}</p>
                    <p className="m-0 mt-1 text-xs text-cream/70">{t.togo.regionCapital}{active.capital}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t.togo.closeTip}
                    className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full border border-white/25 text-sm text-cream transition hover:bg-white hover:text-forest"
                  >
                    ✕
                  </button>
                </div>
                <p className="mb-0 mt-3 text-[13px] leading-relaxed text-cream/85">{active.desc}</p>
                <ul className="mb-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
                  {active.spots.map((s) => (
                    <li key={s} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

      {/* Écran étroit : plus de marge utilisable, la fiche passe sous la carte. */}
      {open && box === null && (
        <div key={`below-${activeId}`} role="status" aria-live="polite" className="word-in mt-5 shrink-0">
          <div className="rounded-2xl bg-forest p-5 text-cream shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-sun">
                    {t.togo.regionOf} {String(activeIndex + 1).padStart(2, '0')} / 05
                  </p>
                  <p className="m-0 mt-1 font-display text-2xl font-semibold leading-none">{active.name}</p>
                  <p className="m-0 mt-1 text-xs text-cream/70">{t.togo.regionCapital}{active.capital}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t.togo.closeTip}
                  className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full border border-white/25 text-sm text-cream transition hover:bg-white hover:text-forest"
                >
                  ✕
                </button>
              </div>
              <p className="mb-0 mt-3 text-[13px] leading-relaxed text-cream/85">{active.desc}</p>
              <ul className="mb-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
                {active.spots.map((s) => (
                  <li key={s} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
                    {s}
                  </li>
                ))}
              </ul>
          </div>
        </div>
      )}
    </div>
  );
}
