# 03 — Design system (anti-générique)

## Tokens (déjà dans tailwind.config.ts)
- togo.green #008751, yellow #FFCE00, red #D21034, ink #0B0F0C, sand #F6F3EC
- font display : Sora / Grotesk, body : Inter
- Rayons 12-16px, ombres douces, bordures 1px black/10

## Composants
- Hero sombre ink avec bandeau jaune, pas de template "Event Conference"
- Timeline horizontale sur desktop, verticale mobile, année en gros vert
- Cartes édition blanches avec liseré vert, hover lift
- Boutons : primaire vert, secondaire outline blanc/noir selon fond

## Motion
- Framer Motion : fade-up Hero, stagger timeline. Pas de GSAP pour v1.
- Respect `prefers-reduced-motion`.

## Accessibilité / SEO
- Un seul H1 par page, alt images obligatoire, contrastes AA, focus visibles.

## Mise à jour — police unique et logo (18 octobre 2026)
- Police : **Poppins** sur tout le site (300 à 700, romain et italique), via
  `next/font` dans `src/app/[lang]/layout.tsx`. Les variables `--font-display`,
  `--font-body` et `--font-mono` pointent toutes vers `--font-poppins`
  (`globals.css`), les classes `font-display`, `font-body`, `font-mono` restent.
  Le japonais garde ses polices système en tête.
- Logo de la barre de navigation : 44 px → 48 px (mobile) / 52 px (≥ 640 px).
