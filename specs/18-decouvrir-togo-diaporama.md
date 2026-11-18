# 18 — Découvrir le Togo : un diaporama par onglet

## Objectif
Chaque onglet de la section « Découvrir le Togo » (accueil) porte désormais son
propre diaporama de trois photos, au lieu d'une image unique.

## Visuels
Source client : `~/Downloads/PARTIE ECO/{CULTURE,TOURISME,COMMERCE}`, 9 photos en
1350×1080, copiées dans `frontend/public/design/togo/<onglet>/{1,2,3}.jpg`.

| Onglet | Dossier | Photos |
| --- | --- | --- |
| Culture | `togo/culture` | scène musique/danse · fresque murale · mur sculpté « Identité » |
| Tourisme | `togo/tourisme` | littoral et lagune · cathédrale de Lomé · tata du Koutammakou |
| Économie | `togo/economie` | Plateforme Industrielle d'Adétikopé · port de Lomé · marché |

## Comportement
- Les trois onglets restent les sélecteurs de thème ; changer d'onglet revient à
  la photo 1 du nouveau volet.
- Les chevrons, les pastilles du bas et le compteur `01 / 03` pilotent les photos
  du volet courant (et non plus les onglets).
- Défilement auto toutes les 4 s, en pause au survol souris (`pointerType === 'mouse'`)
  et désactivé sous `prefers-reduced-motion`.
- La pastille active reprend la couleur de l'onglet (jaune, vert, rouge).
- Accessibilité : les pastilles sont des boutons libellés par le titre de la photo,
  avec `aria-current` ; seule la photo visible porte un `alt` non vide.

## Fichiers
- `frontend/src/lib/design.ts` — `TOGO_CARDS[].images` remplace `image` / `imageAlt`.
- `frontend/src/i18n/dict.ts` — `togoCards.cards[].shots[{ place, title, alt }]`
  remplace `place` / `title` / `alt` par carte, en FR / EN / JA.
- `frontend/src/components/TogoCards.tsx` — état `shot`, lecture auto, pastilles cliquables.

## Vérification
`npm run audit` + contrôle dans le DOM : photo visible, légende, compteur, couleur
et largeur de la pastille active, remise à zéro au changement d'onglet, bouclage
des chevrons, pause au survol et reprise à la sortie.
