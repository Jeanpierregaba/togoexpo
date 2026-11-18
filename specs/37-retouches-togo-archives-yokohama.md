# 37 — Retouches : hero Togo, menu Archives, hero Yokohama, chiffre café/cacao

- Page Togo, hero : `togo.heroSub` reformulé sans « compact » — « un pays d'Afrique de l'Ouest à taille humaine, jeune et ouvert sur le monde » (EN « on a human scale », JA « ほどよい規模 »).
- Menu déroulant « Archives » (`SiteHeader`) : bouton « Consulter » supprimé ; l'intitulé « Toutes les participations » devient lui-même le lien vers `/editions`, sur une ligne, avec une flèche. Clé `archivesMenu.view` retirée (FR/EN/JA).
- Yokohama, hero : vidéo de fond fournie par le client (`public/videos/yokohama-banniere.mp4`, 848×480, 1,6 Mo) en boucle muette ; affiche = première image (`public/design/yokohama/hero-poster.jpg`). Masquée sous `prefers-reduced-motion` (classe `hero-video`), l'affiche reste.
- Yokohama, « Les cultures, richesses de nos terres » : `+72 000 hectares` → `+75 873 ha` de café et de cacao (EN/JA idem).
- Vérif : `npm run audit`.

## Complément
- Hero Togo : nouveau paragraphe — « Terre d'hospitalité et de traditions vivantes, le Togo rayonne par la richesse de ses cultures, l'énergie de sa jeunesse et l'ambition d'un peuple ouvert sur le monde. » (EN/JA traduits).
- Hero Yokohama : contenu centré horizontalement et verticalement (fil d'Ariane, sur-titre, titre, chapeau, compte à rebours, boutons) ; voile neutre recentré (dégradé radial) ; ligne du thème « Scenery of the Future for Happiness » supprimée (elle n'existait que sur cette page — la demande citait Belgrade).
- Menu Archives : intitulé « Toutes les participations » → « Nos participations » (EN « Our participations », JA « 私たちの参加 »).
- Belgrade, hero : titre sans `uppercase`, casse standard, deux lignes coupées après la virgule (« Du Togo, » / « pour le monde ») ; EN « From Togo, for the world » ; JA coupé après « 、 ».
