# 48 — Hero de l'accueil : voile allégé

## Demande
Le hero de l'accueil paraît toujours sombre : estomper l'overlay.

## Fait
`frontend/src/components/HeroExpo.tsx` :
- voile `from-black/50 via-black/30 to-black/75` -> `from-black/25 via-black/5 to-black/60`
  (haut juste assez pour l'en-tête, milieu presque transparent, bas pour le texte) ;
- ombre douce sur le texte du hero pour qu'il reste lisible sur les photos claires.

## Vérif
`npm run audit` ; diapositives contrôlées dans le navigateur (titre, texte et boutons lisibles).
