# 20 — Visuel de la section « Rayonnement & diplomatie »

## Objectif
Remplacer la photo illustrant la section Mission de la page d'accueil par la
photo officielle de délégation fournie par le client.

## Visuel
`/design/comite-delegation.jpg` (2000×1333) : délégation togolaise et hôtes
japonais réunis lors d'un dîner officiel, drapeau togolais au centre.

## Fichiers
- `frontend/src/components/Mission.tsx` — `src` de l'image.
- `frontend/src/i18n/dict.ts` — `mission.imgAlt` en FR / EN / JA, réécrit pour
  décrire la photo réellement affichée.

## Hors périmètre
`comite.webp` reste en place : il sert encore de tuile dans la mosaïque de la
médiathèque (`MEDIA_GALLERY`).

## Vérification
`npm run audit` + contrôle du `src` et du `alt` rendus dans la section.
