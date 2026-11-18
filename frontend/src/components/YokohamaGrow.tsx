'use client';
import { useEffect, useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/** `useLayoutEffect` côté navigateur, `useEffect` au rendu serveur — sans quoi
 *  React avertit à chaque rendu statique. */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/* ---------------------------------------------------------------------------
   Un seul guetteur pour toute la page.

   `IntersectionObserver` s'est révélé peu fiable ici : il annonce bien l'état
   initial, puis ne signale plus rien au défilement dans certains contextes
   d'affichage — et comme le contenu n'est visible qu'une fois signalé, la page
   restait blanche. On mesure donc nous-mêmes, au défilement, ce qui est entré
   dans l'écran. Une seule écoute et une seule boucle pour tous les éléments,
   plutôt qu'un observateur par bloc.
   --------------------------------------------------------------------------- */
type Watched = { target: HTMLElement; show: () => void };
const watched = new Set<Watched>();
let bound = false;
let last = 0;
let timer = 0;

/**
 * Un bloc est dévoilé dès que son haut franchit 92 % de la hauteur d'écran.
 *
 * On ne vérifie délibérément pas qu'il soit *encore* à l'écran : un bloc déjà
 * remonté au-dessus de la fenêtre a un sommet négatif, donc il passe, et c'est
 * voulu. Autrement, un défilement rapide ou un saut d'ancre — la bannière en
 * propose deux — franchirait des blocs sans jamais les mesurer, et ils
 * resteraient masqués pour de bon.
 */
function sweep() {
  timer = 0;
  last = Date.now();
  const vh = window.innerHeight;
  for (const w of Array.from(watched)) {
    if (w.target.getBoundingClientRect().top < vh * 0.92) {
      w.show();
      watched.delete(w);
    }
  }
  if (watched.size === 0) unbind();
}

/** Au plus une mesure toutes les 90 ms, avec une dernière passe à la fin. */
function ping() {
  const wait = 90 - (Date.now() - last);
  if (wait <= 0) {
    sweep();
    return;
  }
  if (!timer) timer = window.setTimeout(sweep, wait);
}

function bind() {
  if (bound) return;
  bound = true;
  window.addEventListener('scroll', ping, { passive: true });
  window.addEventListener('resize', ping);
  window.addEventListener('load', ping);
  // Les images arrivent après le premier rendu et déplacent la mise en page :
  // deux passes de rattrapage évitent qu'un bloc entré en vue entre-temps
  // attende le prochain geste de l'utilisateur.
  window.setTimeout(sweep, 400);
  window.setTimeout(sweep, 1500);
}

function unbind() {
  if (!bound) return;
  bound = false;
  window.removeEventListener('scroll', ping);
  window.removeEventListener('resize', ping);
  window.removeEventListener('load', ping);
  if (timer) {
    window.clearTimeout(timer);
    timer = 0;
  }
}

function watch(w: Watched) {
  watched.add(w);
  bind();
  sweep();
  return () => {
    watched.delete(w);
    if (watched.size === 0) unbind();
  };
}

/**
 * Le geste de la page de Yokohama : au lieu d'apparaître, les choses
 * *poussent*. L'élément se dévoile du bas vers le haut par un découpage qui
 * s'ouvre (`yk-grow`), ou bien c'est un trait qui se trace (`yk-draw-y`,
 * `yk-draw-x`). Le déclenchement est le même que celui de `Reveal`
 * (`threshold: 0.1`, une seule fois), pour que toute la page batte au même
 * rythme ; sous `prefers-reduced-motion` la feuille de style neutralise le
 * mouvement et l'élément est simplement là.
 *
 * `as` permet de garder la bonne balise — un `<li>` dans une liste, un `<span>`
 * dans un paragraphe — plutôt que d'empiler des `<div>`.
 */
export function Grow({
  children,
  variant = 'grow',
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children?: ReactNode;
  /** `grow` dévoile un bloc, `draw-y` et `draw-x` tracent un trait. */
  variant?: 'grow' | 'draw-y' | 'draw-x';
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // On masque seulement maintenant, et par la classe plutôt que par l'état
    // React : si cet effet ne tourne pas, rien n'est masqué et la page reste
    // lisible. Le retrait de `.yk-armed` au démontage évite qu'un élément
    // réutilisé reste caché.
    el.classList.add('yk-armed');

    // Un trait réduit à `scaleX(0)` ou `scaleY(0)` n'a plus de surface, et un
    // observateur ne signale jamais l'entrée en vue d'un élément sans
    // surface. On observe donc son parent, qui en a une.
    const target = variant === 'grow' ? el : el.parentElement ?? el;

    const stop = watch({
      target,
      // On *retire* le masquage au lieu de le recouvrir par une règle plus
      // forte : l'état final ne dépend alors ni de l'ordre de la feuille de
      // style, ni du bon déroulement de la transition. Même si l'animation ne
      // tourne pas, le contenu est là.
      show: () => {
        el.classList.add('is-in');
        el.classList.remove('yk-armed');
      },
    });
    return () => {
      stop();
      el.classList.remove('yk-armed');
    };
  }, [variant]);

  return (
    <Tag ref={ref} className={`yk-${variant}${className ? ` ${className}` : ''}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}

/**
 * Chiffre qui monte jusqu'à sa valeur quand il entre en vue. Les grandeurs du
 * pavillon — 20 m², 5 plantes, 10 tablettes, 192 jours — se lisent mieux en
 * train de se remplir qu'affichées d'emblée. La durée est courte et la fin
 * ralentie : on voit le chiffre se poser.
 */
export function CountUp({ to, suffix = '', className = '' }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(to);
      return;
    }
    let raf = 0;
    let done = false;
    // Même guetteur que les blocs, pour la même raison : le chiffre doit finir
    // par s'afficher même si l'animation ne peut pas tourner.
    const stop = watch({
      target: el,
      show: () => {
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / 1100);
          // Sortie cubique : la fin ralentit, le chiffre se pose.
          setN(Math.round(to * (1 - (1 - p) ** 3)));
          if (p < 1) raf = requestAnimationFrame(step);
          else done = true;
        };
        raf = requestAnimationFrame(step);
        // Si aucune image n'est calculée — rendu suspendu — le compteur
        // n'afficherait jamais sa valeur : on la pose au bout d'un instant.
        window.setTimeout(() => {
          if (!done) setN(to);
        }, 1600);
      },
    });
    return () => {
      stop();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {n}
      {suffix}
    </span>
  );
}
