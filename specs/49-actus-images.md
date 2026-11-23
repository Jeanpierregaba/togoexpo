# 49 — Actualités : image à la une en 16:9, bannière d'article sur l'image

## Demande
- Page Actualités : l'image de l'article à la une au format 1920 × 1080 (16:9).
- Page d'un article : l'image mise en avant passe en fond de la bannière ; l'image
  placée avant le texte est supprimée ; la bannière ne contient que le titre.

## Fait
- `FeaturedActu.tsx` : cadre image `aspect-video` (16:9) à toutes les tailles.
- `actualites/[slug]/page.tsx` : bannière `PageHero` (voile `strong`) avec l'image
  mise en avant (photo du site par défaut), seul le `h1` dedans ; fil d'Ariane,
  catégorie, date et chapô retirés de la bannière ; figure avant le texte supprimée.

## Vérif
`npm run audit`, puis contrôle visuel d'une page article et de /fr/actualites.
