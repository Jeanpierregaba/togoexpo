# 38 — Archives : frise animée

- Nouveau composant client `src/components/FriseTimeline.tsx` (ne pas confondre avec `ArchiveTimeline`, la frise « journée » des pages d'édition).
- Section frise sur fond vert. Grille inchangée (2 colonnes, coupure « 30 ans », 10 colonnes, défilement horizontal sous 960 px).
- Animation à l'entrée (IntersectionObserver, seuil 0,35) : trait plein jaune → crème qui se dessine (1,6 s) jusqu'à la dernière participation passée, puis pointillés vers les éditions en préparation ; chaque point apparaît quand le trait l'atteint, sa tige se déplie, l'année glisse en place. Osaka 2025 (dernière passée) : année en jaune et pulsation. Survol / focus : point agrandi, année en jaune, nom de l'édition affiché. Délais supprimés après l'entrée (survol réactif). `prefers-reduced-motion` : état final direct.
- Couleurs sur fond vert : universelle = crème, horticole = jaune, spécialisée = rouge, en préparation = cercle creux ; légende mise à jour.
- Supprimés : le chapeau « Chaque point est une participation… » (`friseLead`) et la ligne « Crédits photo — … » de la section Préparatifs (`credits`, FR/EN/JA). Les crédits restent dans `lib/participations.ts`.

## Incident
- Le premier jet a écrasé par erreur `ArchiveTimeline.tsx` (frise des pages d'édition). Fichier restauré à l'identique depuis l'historique de session, nouveau composant renommé `FriseTimeline`. Pages d'édition revérifiées (Osaka 2025).

## Complément — frise immersive
- `FriseTimeline` réécrit : une participation « en lumière » à la fois. Un halo jaune glisse sur le trait jusqu'à elle, son point s'entoure d'un anneau jaune (pulsation), sa tige et son année passent en jaune ; sa photo (si `image`) remplit le fond de la section (opacité 50 %, dégradés verts par-dessus).
- Fiche détaillée sous la frise (fondu montant `frise-card` à chaque changement) : année en grand, vignette photo, famille, « En préparation », nom, ville · pays · dates, thème, bouton « Voir la fiche ↓ » ; boutons précédent / pause / suivant.
- Défilement automatique toutes les 3,8 s après l'entrée, suspendu au survol ou au focus et quand l'onglet est caché ; survol ou focus d'un point = mise en lumière. `prefers-reduced-motion` : pas de défilement.
- Dict : `archivePage.friseSee/frisePrev/friseNext/frisePause/frisePlay` (FR/EN/JA). Section frise : `relative isolate`, contenu `relative`.
- Hero Archives : 2e photo remplacée par l'image fournie par le client (`public/design/archives/archives-hero-dubai-2.webp`, 2000×1334).
