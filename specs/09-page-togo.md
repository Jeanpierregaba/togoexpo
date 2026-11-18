# 09 — Page « Le Togo » : bannière, carte, onglets culture, séparation

Fiche de tâche (une tâche = une fiche, cf. AGENTS.md). Périmètre : frontend uniquement.

## 1. Bannière de tête agrandie

- La section de tête passe en `min-h-[70vh]` (`flex flex-col justify-end`), le contenu
  restant calé en bas : la photo du monument de l'Indépendance gagne en présence au lieu
  d'être rognée par un bandeau trop bas. (Depuis la fiche 11, ce bandeau est rendu par le
  composant partagé `PageHero`, repris par les pages Actualités et Contact.)
- Paddings inchangés côté en-tête (`pt-36`, qui réserve la hauteur de la barre de
  navigation) ; bas porté à `pb-16`.

## 2. Section « 01 — Histoire du Togo » : carte à la hauteur du texte

- Le chapô (pastille + titre) descend **dans la colonne de gauche** de la grille, avec les
  paragraphes : la colonne de droite s'étire donc sur toute la hauteur titre + texte.
- `TogoMap` devient pilotée par la hauteur : `flex h-full flex-col`, boîte au ratio
  `290 / 560` (`aspect-ratio`, valeurs dérivées du `viewBox`) qui prend la hauteur
  disponible (`lg:h-auto` + étirement de la grille) et plafonne en largeur (`max-w-full`).
  En dessous de `lg`, repli sur une hauteur fixe de 520 px.
- Le `viewBox` est conservé : le SVG se recadre sans se déformer
  (`preserveAspectRatio` par défaut) et l'infobulle reste calée sur la boîte de référence.

## 3. Section « 04 — Histoire & culture » : une seule colonne

- Fin de la grille `5fr / 7fr` et de la figure collante : la section se lit de haut en bas,
  onglets → textes → image de l'onglet → bouton de téléchargement.
- Onglets : barre pleine largeur, `role="tablist"` conservé, panneau lié par
  `aria-labelledby` / `aria-controls` et `id` stables par onglet.
- Texte : chapô pleine largeur (`max-w-[90ch]`) puis les paragraphes suivants sur deux
  colonnes typographiques en `lg` (`lg:columns-2`), sans quoi les lignes seraient trop
  longues sur toute la largeur.
- Image de l'onglet : figure large (`4/3` en mobile, `16/9` dès `sm`, `21/9` en `lg`), légende en
  surimpression sur dégradé vert, changement d'onglet animé (`word-in`).
- Bouton « Télécharger la fiche des stats » vers `/documents/togo-fiche-statistiques.pdf`
  (PDF bilingue FR/EN « Welcome to Togo », 1 page), attribut `download`, mention du format
  et du poids à côté du libellé.

## 4. Séparation « 06 — Tourisme » / « Communauté officielle »

- Bande blanche de 100 px en fin de page Togo, sur le même principe que celle qui détache
  déjà le pied de page de la section Communauté.

## Dictionnaire

`togo` gagne `cultDlBtn` et `cultDlMeta` dans les trois langues.
Les `imageAlt` des onglets « Art & théâtre » et « Culture » sont corrigés : la photo
`hero-cree.jpeg` montre des danseurs traditionnels, pas de l'artisanat.

## Vérification

- `npm run audit` (typecheck + lint + build) vert.
- `/fr/togo`, `/en/togo`, `/ja/togo` : bannière ≥ 70 vh, carte alignée sur la hauteur du
  bloc titre + paragraphes, section 04 en une colonne avec changement d'onglet,
  téléchargement du PDF servi en 200, bande blanche de 100 px avant la section
  Communauté, aucun débordement horizontal de 375 px à 1440 px.
