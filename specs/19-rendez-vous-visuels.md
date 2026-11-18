# 19 — Visuels du carrousel « Le Togo sur la scène internationale »

## Objectif
Remplacer les photos de ville en arrière-plan du carrousel des prochains
rendez-vous par les visuels événementiels fournis, un par édition.

## Visuels
| Édition | Fichier | Sujet |
| --- | --- | --- |
| Yokohama 2027 | `/design/event-yokohama-2027.jpg` | Grand Bouddha de Kamakura ceint du drapeau togolais |
| Belgrade 2027 | `/design/event-belgrade-2027.jpg` | Monument de Stefan Nemanja, place Sava, enveloppé du drapeau togolais |

1920×1080, déposés dans `frontend/public/design/`.

## Fichiers
- `frontend/src/lib/editions.ts` — `image` des trois tableaux `MOCK_UPCOMING`,
  `MOCK_UPCOMING_EN` et `MOCK_UPCOMING_JA`, avec leurs textes alternatifs.

## Hors périmètre
`MOCK_EDITION_DETAILS` et la mosaïque de la médiathèque gardent
`city-yokohama.jpg` et `city-belgrade.jpg` : les pages de détail et la galerie
montrent la ville, pas l'habillage événementiel.

## Dépendance CMS
Quand WordPress est joignable, `mapEditionDetail` prend l'image mise en avant de
l'édition dans le CMS ; ces visuels doivent donc aussi être définis comme image
mise en avant des deux fiches pour s'afficher en production.

## Vérification
`npm run audit` + contrôle du `src` rendu pour chacune des deux diapositives.
