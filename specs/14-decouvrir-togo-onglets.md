# 14 — Accueil : « 01 — Découvrir le Togo » en onglets

Fiche de tâche (une tâche = une fiche, cf. AGENTS.md). Périmètre : frontend uniquement.

## Disposition

La section quitte la grille de trois cartes côte à côte pour la disposition de
l'inspiration fournie : deux colonnes à hauteur égale, texte à gauche, volet illustré à
droite. Habillage conservé (Bricolage Grotesque, Instrument Sans, JetBrains Mono, charte
forest / cream / sun / blood / pine).

Colonne de texte :
- pastille à tiret rouge + intitulé mono (le `●` du dictionnaire est remplacé à l'affichage
  par le tiret de l'inspiration) ;
- titre sur deux lignes, la seconde en rouge (`text-blood`) — l'inspiration la met en
  italique serif, nous gardons notre display ;
- accroche de section, puis le paragraphe de l'onglet actif ;
- barre d'onglets ;
- bouton « En savoir plus » vers la cible de l'onglet actif.

Volet illustré : photo plein cadre, pastille de catégorie, compteur `01 / 03`, flèches
précédent / suivant, lieu avec épingle, titre et jauge de progression.

## Les trois cartes deviennent des onglets

Culture (jaune), Tourisme (vert) et Économie (rouge) ne sont plus trois cartes mais trois
onglets qui changent **le paragraphe, l'image, la pastille, le lieu, le titre du volet et
la destination du bouton**. Chaque onglet garde l'aplat de couleur de son ancienne carte
(`TOGO_CARDS[].bg`), et porte un point de cette couleur lorsqu'il est inactif
(`TOGO_CARDS[].dot`, ajouté).

- Composant passé en `'use client'` (état de l'onglet actif).
- `role="tablist"` / `role="tab"` / `aria-selected` / `aria-controls`, panneau
  `role="tabpanel"` rattaché à l'onglet par `aria-labelledby`.
- Les flèches font défiler les volets en boucle.
- Le paragraphe, la légende et l'image rejouent l'animation d'entrée à chaque changement
  (`key` + `.word-in`), neutralisée en `prefers-reduced-motion`.
- Voile bas dédié sur la photo : la légende reste lisible quelle que soit l'image.

## Réglages de la barre d'onglets

- Fond de section passé du crème au **blanc pur** (`bg-white`, `#FFFFFF`).
- La barre occupe toute la largeur de sa colonne, en grille de trois colonnes égales
  (`grid w-full grid-cols-3`) : les trois onglets gardent la même largeur et tiennent sur
  une seule ligne jusqu'en 375 px.
- Un liseré `#E6E4DA` détache la barre blanche du fond, désormais blanc lui aussi.

## Dictionnaire

`togoCards` gagne `tabsAria`, `prev`, `next`, et chaque carte gagne `tab` (libellé court de
l'onglet) et `place` (lieu affiché sur le volet), dans les trois langues.

## Vérification

- `npm run audit` (typecheck + lint + build) vert.
- Accueil FR / EN / JA : trois onglets, changement complet du volet (pastille, compteur,
  lieu, titre, image, paragraphe et cible du bouton — y compris le lien externe Togo Invest
  sur l'onglet Économie), flèches en boucle, aucun débordement horizontal de 375 px
  à 1440 px.
