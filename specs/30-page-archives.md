# 30 — Page Archives

Route : `/[lang]/editions` (l'ancienne URL `/archives` y redirige déjà, 308).
Fichiers : `src/app/[lang]/editions/page.tsx`, `src/lib/participations.ts`,
`src/components/SiteHeader.tsx`, `src/i18n/dict.ts` (`archivePage`).

## Demande
Une belle page qui présente toutes les participations du Togo, jusqu'ici
remplacée par un simple menu déroulant :
- Expositions universelles : 1967 Montréal, 1970 Osaka, 2000 Hanovre,
  2010 Shanghai, 2015 Milan, 2020 Dubaï, 2025 Osaka ;
- Expositions horticoles : 2019 Pékin, 2023 Doha ;
- Préparatifs : 2027 Yokohama (horticole), 2027 Belgrade (spécialisée),
  2030 Riyad (universelle).

## Réalisation
- Bannière plein écran en diaporama (Osaka, Dubaï, Belgrade, Milan), chiffres
  clés qui montent : 12 participations, 7 universelles, 2 horticoles, 3 en
  préparation.
- Frise des douze rendez-vous à intervalles réguliers, coupure « 30 ans »
  entre 1970 et 2000 ; couleur par famille, cercle vide pour les préparatifs ;
  chaque point mène à sa carte. Défilement horizontal sur mobile.
- Expositions universelles : Osaka 2025 en grand, puis Dubaï, Milan, Shanghai,
  Hanovre en cartes photo ; 1970 et 1967 en fiches d'archive typographiques.
- Expositions horticoles : Pékin et Doha en fiches.
- Préparatifs (fond vert) : Yokohama et Belgrade en cartes photo, Riyad en fiche.
- Une carte n'est un lien que si l'édition a sa page (7 sur 12) ; pas de lien
  mort. Crédits photo Wikimedia en pied de section.
- Thèmes et dates officiels (BIE / AIPH) ajoutés pour chaque exposition : à
  valider par le Comité. TODO : brancher WP quand le CMS portera ces éditions.
- En-tête : « Archives » est désormais un lien vers la page ; le menu
  s'ouvre au survol et au focus. Sur mobile, « Archives » est aussi un lien.

## Retouche (19 octobre 2026)
- Frise : le trait de progression et la coupure « 30 ans » sont rendus en
  `<li aria-hidden>` au lieu de `<span>` directs dans l'`<ol>` ; le HTML de la
  liste est valide et l'ordre visuel inchangé.
- Commentaires alignés sur l'état réel : voiles neutres de `PageHero`, cinq
  récits d'archives (et non quatre).
