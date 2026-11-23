# 53 — Titre d'article sous la bannière, crédit IBDA STUDIO

## Demande
- Page article : la bannière ne montre que l'image mise en avant ; le titre
  (h1) passe juste au-dessus du texte de l'article.
- Footer : entre la mention de copyright et les liens légaux, « Powered by
  IBDA STUDIO » renvoyant vers https://ibdastudio.com/ (nouvel onglet).

## Fichiers
- frontend/src/app/[lang]/actualites/[slug]/page.tsx
- frontend/src/components/SiteFooter.tsx

## Vérif
`npm run audit`, contrôle visuel article + footer (desktop et mobile).
