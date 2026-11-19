# 47 — Aperçu au partage du lien (Open Graph)

## Demande
Améliorer les métadonnées pour qu'un lien du site partagé (WhatsApp, Facebook, LinkedIn,
X…) affiche un vrai aperçu.

## Avant
- Image d'aperçu : une carte texte sur fond noir générée à la volée (`opengraph-image.tsx`).
- Toutes les pages reprenaient le titre et la description de l'accueil ; pas de `og:url`.

## Fait
- `frontend/scripts/og-image.mjs` (`npm run og`) : images 1200 × 630 dans
  `public/og/togoexpo-{fr,en,ja}.jpg` (photo Woezon, voile, logo, accroche
  « Une ambition sans frontières » (traduite), togoexpo.org, liseré aux couleurs du drapeau).
  `opengraph-image.tsx` supprimé.
- `src/lib/share.ts` : `withShare(lang, meta, opts)` ajoute `openGraph` et `twitter`
  (titre « … | TogoExpo », description, URL canonique, image) à chaque page.
  Branché sur toutes les pages ; l'accueil garde l'accroche `meta.ogTitle/ogDesc`,
  les articles prennent leur image à la une, les éditions racontées leur photo.
- Layout : image et `og:url` par défaut (404 et pages sans métadonnées).

## Vérif
`npm run audit` ; balises `og:*` contrôlées dans le HTML généré (accueil, médiathèque,
édition, page Togo en JA). En ligne : tester avec le débogueur de partage Facebook
(developers.facebook.com/tools/debug) ou en collant le lien dans WhatsApp.
