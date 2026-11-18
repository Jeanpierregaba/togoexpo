# 33 — Accueil : allègement des voiles

Sections : « Le Togo sur la scène internationale » (`#rendez-vous`) et
« Communauté officielle » (`#communaute`).
Fichiers : `src/components/UpcomingEvents.tsx`, `src/components/Community.tsx`.

## Demande
- Les nouveaux visuels des rendez-vous sont désormais clairs ; réduire le
  voile noir qui rend les deux slides trop sombres.
- Réduire aussi le voile de la section « Communauté officielle ».

## Réalisation
- Rendez-vous, voile horizontal :
  `from-black/85 via-black/70 to-black/30` → `from-black/75 via-black/50 to-black/15`.
- Rendez-vous, voile vertical :
  `from-black/60 via-black/10 to-black/35` → `from-black/45 via-black/5 to-black/20`.
- Communauté :
  `from-black/75 via-black/60 to-black/80` → `from-black/55 via-black/30 to-black/60`.
- La barre d'onglets et le voile bas de la carte gardent leur fond, seule la
  couche posée sur la photo est allégée.

## Vérification
- Gradients calculés dans le navigateur conformes aux nouvelles valeurs :
  rendez-vous `rgba(0,0,0,.75) → rgba(0,0,0,.5) 42% → rgba(0,0,0,.15)` et
  `rgba(0,0,0,.45) → rgba(0,0,0,.05) → rgba(0,0,0,.2)` ;
  communauté `rgba(0,0,0,.55) → rgba(0,0,0,.3) → rgba(0,0,0,.6)`.
- `npm run audit` vert : typecheck, lint, build ; 65 pages générées.
