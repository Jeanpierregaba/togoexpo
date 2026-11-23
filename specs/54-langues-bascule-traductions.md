# 54 — Bascule de langue et traductions manquantes

## Constat
- Le sélecteur de langue suffixait chaque segment de l'URL (`/fr/a-propos` →
  `/en/a-propos-en`) : 404 sur presque toutes les pages.
- Belgrade et Yokohama : en EN/JA, les liens menaient à la fiche WordPress
  générique (`belgrade-2027-en`) au lieu de la page dédiée.
- Blog vide en EN/JA : les 34 articles n'existent qu'en français.
- Libellés français hors dictionnaire : noms accessibles des réseaux sociaux,
  textes alternatifs des éditions, titres Flickr, liens utiles, catégories.

## Correctifs
- `switchPath` : seul le slug d'une édition change de forme ; les autres
  chemins sont identiques dans les trois langues ; les articles gardent leur slug.
- `editionPath` + `DEDICATED_EDITIONS` : Belgrade/Yokohama gardent la même
  adresse dans les trois langues ; l'ancienne forme suffixée redirige (308).
- `postsWithFallback` : sans article dans la langue, on montre les articles
  français, avec une mention ; la page article l'indique aussi (`lang="fr"`)
  et son canonical pointe vers la version française.
- `i18n/fixed.ts` : traductions EN/JA des libellés français restants.

## Vérif
`npm run audit` ; bascule testée sur toutes les pages (200 dans les 3 langues).
