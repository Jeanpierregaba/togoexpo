# 51 — Belgrade : section « L'ambassadeur » redessinée

## Demande
La section était trop simple, l'ambassadeur n'était pas vraiment mis en avant.
Retirer les repères chiffrés (2006, 2008, 27.10.2026).

## Fait
- Section sombre (`bg-ink`), nom « ADEBAYOR » en filigrane géant (contour).
- Portrait studio noir et blanc tiré du documentaire (8 s),
  `public/design/belgrade/adebayor-portrait.jpg`, liseré vert-jaune-rouge et
  macaron jaune « Ambassadeur de Jeu ».
- Nom en très grand (« Emmanuel Sheyi » / « ADEBAYOR » en jaune), fonction,
  citation tirée du documentaire (56 s) : « Sans le Togo, je ne serais jamais le
  Sheyi Adebayor que je suis aujourd'hui. », puis le paragraphe.
- Documentaire pleine largeur : en-tête (libellé, durée, sélecteur FR/EN) et
  grand bouton lecture sur l'affiche ; contrôles natifs une fois lancé.
- `ambFacts` supprimés ; nouvelles clés `ambFirst`, `ambLast`, `ambRole`,
  `ambQuote`, `ambQuoteBy`, `ambPortraitAlt`, `ambBadge`, `ambPlay` (FR, EN, JA).

## Vérif
`npm run audit` ; desktop 1440 et mobile 375 ; lecture + bascule FR → EN.
