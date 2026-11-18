# 32 — Accueil : nouveaux visuels des rendez-vous

Section : « Le Togo sur la scène internationale » (`#rendez-vous`), page
d'accueil.
Fichiers : `src/lib/editions.ts`, `src/components/UpcomingEvents.tsx`,
`src/app/[lang]/page.tsx`, `public/design/event-yokohama-2027-mascot.jpg`,
`public/design/event-belgrade-2027-dance.jpg`.

## Demande
- Remplacer les deux visuels du carrousel des prochains rendez-vous par les
  deux créations fournies.

## Réalisation
- Yokohama 2027 : nouvelle image `event-yokohama-2027-mascot.jpg`
  (mascotte cœur, globe fleuri, ruban togolais).
- Belgrade 2027 : nouvelle image `event-belgrade-2027-dance.jpg`
  (danseur togolais et deux enfants en cape sur fond graphique).
- Références mises à jour pour les trois langues (FR/EN/JA) et textes
  alternatifs réécrits. Les anciens fichiers restent en place pour les autres
  usages éventuels.
- Cadrage `object-position: 70% 50%` pour conserver les sujets à droite dans
  la carte haute et étroite sur mobile.
- Commentaire de `page.tsx` aligné : les visuels éditoriaux locaux priment
  désormais sur l'image à la une WordPress.

## Vérification
- Les deux images répondent en 200 via `/_next/image` (versions 1080 px).
- Accueil FR : sources chargées `event-yokohama-2027-mascot.jpg` et
  `event-belgrade-2027-dance.jpg`, `object-position: 70% 50%`.
- Mobile 390 : carte de 350 px de large, 1050 px de haut, sans débordement.
- `npm run audit` vert : typecheck, lint, build ; 65 pages générées.
