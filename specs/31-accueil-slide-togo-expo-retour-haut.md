# 31 — Accueil : slide TOGO EXPO, overlays et retour en haut

Routes : `/[lang]` (FR, EN, JA).
Fichiers : `src/lib/design.ts`, `src/i18n/dict.ts`,
`src/components/HeroExpo.tsx`, `src/components/Marquee.tsx`,
`src/app/globals.css`, `src/components/BackToTop.tsx`,
`src/app/[lang]/layout.tsx`, `src/components/CountdownPanel.tsx`,
`public/design/hero-togo-expo.jpg`.

## Demande
- Ajouter un premier slide au hero d'accueil avec la photo fournie
  (drapeaux Togo / Japon devant l'écran Woezon).
- Titre « TOGO EXPO » avec un trait animé sous « EXPO », paragraphe fourni,
  boutons « En savoir plus » et « Le Comité ».
- Alléger légèrement le voile sombre des slides d'accueil.
- Ajouter un bouton de retour en haut sur toutes les pages.
- Corriger le retard d'un jour des compte-à-rebours.

## Réalisation
- Image source recadrée/redimensionnée en `1920 × 1279`
  (`public/design/hero-togo-expo.jpg`).
- Nouveau slide `togo-expo` en tête de `SLIDES`, variante `brand` : grand H1
  `clamp(46px, 10vw, 140px)`, soulignement jaune animé sous « EXPO ».
  Traductions FR/EN/JA ajoutées dans le même ordre que `SLIDES`.
- Paragraphe conservé tel que fourni. CTA vers `/#mission` et `/comite`.
- Voile du hero allégé : `from-black/50 via-black/30 to-black/75` (au lieu de
  `from-black/60 via-black/40 to-black/85`).
- `BackToTop` global monté dans le layout : visible après 520 px de scroll,
  libellé traduit, `aria-hidden`/`tabIndex` cohérents, scroll smooth désactivé
  si `prefers-reduced-motion`.
- Compte-à-rebours : jours calculés avec `Math.ceil` pour afficher le jour
  calendaire attendu (Yokohama 151 j et Belgrade 208 j au 19 octobre 2026).

## Retouche (19 octobre 2026)
- Bandeau d'accueil : le texte ne laisse plus de vide en fin de boucle. La piste
  contient deux groupes identiques de quatre répétitions (12 items par groupe) ;
  chaque groupe mesure 3121 px en 1440 et 2311 px en 390, donc toujours plus
  large que l'écran. Animation portée à 180 s pour conserver la vitesse.
- `BackToTop` : bouton réduit à une flèche centrée dans un rond de 50 × 50 px ;
  le libellé traduit reste en `aria-label`.

## Vérification
- `npm run typecheck` et `npm run lint` verts.
- Desktop 1440 : H1 sur une ligne (1328 px de large, pas de débordement),
  visuel du premier slide et trait sous « EXPO » contrôlés.
- Mobile 390 : aucun débordement horizontal (`scrollWidth = 390`), H1 46 px
  sur une ligne, les deux CTA tiennent côte à côte.
- Retour en haut testé sur mobile : passage de `scrollY = 1200` à `0`, bouton
  masqué et retiré du tab order en haut de page.
- Compteurs lus sur l'accueil, Belgrade et Yokohama : 151 j / 208 j / 151 j.
- Bandeau : deux groupes égaux, 12 items chacun, sans débordement horizontal ;
  bouton retour en haut mesuré à 50 × 50 px, opacité 1 après scroll.
- `npm run audit` vert : typecheck, lint, build ; 65 pages générées.
