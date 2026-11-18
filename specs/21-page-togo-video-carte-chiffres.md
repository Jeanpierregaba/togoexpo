# 21 — Page Togo : bannière vidéo, fiche de région, chiffres

## 1. Bannière en vidéo
`PageHero` accepte une prop optionnelle `video`. La page Togo passe
`/videos/togo-banniere.mp4` (9 Mo), jouée en boucle, muette, `playsInline`,
`preload="metadata"`.

La photo `hero-independance.jpg` reste rendue dessous et sert d'affiche
(`poster`) : elle couvre le temps de chargement. Sous `prefers-reduced-motion`,
la règle `.hero-video { display: none }` de `globals.css` masque la vidéo et
laisse la photo.

Les autres bannières (blog, contact) n'ayant pas de `video`, elles sont inchangées.

## 2. Carte des régions — fiche posée sur la carte, à côté de la région
La fiche n'est ni posée au centre de la carte, ni dans une colonne voisine trop
éloignée : elle est ancrée sur le chef-lieu de la région cliquée et **décalée de
28 px à côté**, de façon à laisser le tracé et la pastille bien visibles.

Le côté se choisit selon la place disponible : on mesure l'espace restant de
part et d'autre du point (`roomRight`, `roomLeft`) et on prend le côté qui
accueille les 248 px de la fiche. Ne pas se contenter de la moitié de la carte :
sur carte étroite, la fiche sortait du cadre à gauche pour 4 régions sur 5.

Un second passage, après rendu, rabat la fiche dans le cadre si elle dépasse
quand même (`clampIntoFrame`) : la hauteur dépend du texte de la région et de la
langue, elle n'est pas prévisible au clic. La mesure se fait en métriques de
layout (`offsetWidth`, `clientWidth`) et non au `getBoundingClientRect`, que
l'animation `word-in` fausse pendant sa durée. Le décalage est stocké dans une
ref en plus de l'état : sinon le callback qui le calcule dépendrait de son propre
résultat et provoquerait une boucle de rendu.

## 2 bis. Ancrage en pixels
L'ancrage passe par `vbToPx()`, qui reproduit le `preserveAspectRatio` par
défaut (« meet ») : le SVG met le tracé à l'échelle du plus petit côté puis le
centre, un simple `rect.width / viewBox.width` placerait la fiche à côté.

## 3. « Le Togo en chiffres » — cartes 08, 09, 10
| # | Avant | Après |
| --- | --- | --- |
| 08 | Produit intérieur brut | 1er exportateur de produits agricoles bio — de la CEDEAO vers l'Europe |
| 09 | Doing Business 2020 | 1re place bancaire d'Afrique de l'Ouest — par le nombre de représentations d'institutions financières |
| 10 | Exportations | Entrée sans visa — pour les ressortissants de tous les pays africains |

Traduit en FR / EN / JA.

## 4. Retouches de bannière et de section
- Le crédit photo (« Monument de l'Indépendance, Lomé — Bamouzou, Wikimedia
  Commons ») est retiré : la bannière joue une vidéo, la photo n'est qu'affiche.
  La clé `togo.heroCredit` disparaît des trois dictionnaires.
- `PageHero` accepte une prop `overlay` (`soft` par défaut, `strong` pour la page
  Togo) qui pose un voile noir à 55 % sous un dégradé vert plus dense : le titre
  reste lisible sur un plan animé chargé. Les autres bannières sont inchangées.
- Le sous-titre « PDF bilingue · 1 page · 4,6 Mo » sous le bouton de
  téléchargement de la fiche des stats est retiré, ainsi que la clé
  `cultDlMeta` dans les trois dictionnaires.

## Fichiers
- `frontend/src/components/PageHero.tsx` — prop `video`, prop `overlay`.
- `frontend/src/app/[lang]/togo/page.tsx` — passe la vidéo et l'overlay fort.
- `frontend/src/app/globals.css` — `.hero-video` sous `prefers-reduced-motion`.
- `frontend/src/components/TogoMap.tsx` — fiche ancrée sur la carte.
- `frontend/src/components/TogoCultureTabs.tsx` — suppression du sous-titre.
- `frontend/src/i18n/dict.ts` — `togo.numCards[7..9]`, retrait de `heroCredit`
  (togo) et `cultDlMeta`.
- `frontend/public/videos/togo-banniere.mp4`.

## Vérification
`npm run audit` + contrôle dans le DOM : lecture et bouclage de la vidéo, voile
sombre appliqué, absence du crédit et du sous-titre PDF, fiche dans le cadre de la
carte pour les cinq régions avec un écart constant au point (mesuré : 21 px,
38 % de la carte couverte au maximum).

## 5. Bannière plein écran et voile en diagonale (2026-10-12)
`PageHero` gagne une prop `height` (`tall` par défaut = 70 vh, `full` = `min-h-svh`).
La page Togo passe `full` : la bannière mesure exactement la hauteur de la fenêtre
(900 px sur 900 px de fenêtre, mesuré).

Le voile `strong` n'est plus un aplat noir + dégradé vertical mais un **dégradé
vert en diagonale** : dense dans le coin bas-gauche, là où se posent le fil
d'Ariane, le titre et les chiffres, effacé vers le coin haut-droit pour laisser
voir le drapeau de la vidéo. Un second dégradé vertical léger assoit le bas de la
bannière sur le vert du site.

## 6. Fiche de région : dans la marge, jamais sur la carte (2026-10-12)
Troisième et dernière approche. La fiche ne se pose plus à côté du chef-lieu « sur »
la carte — à ce décalage elle recouvrait le tracé, de façon flagrante pour les
Savanes, dont le chef-lieu est en haut à gauche.

Le tracé occupe `x = 0 → 200` du viewBox, soit 246 px de large pour un cadre de
629 px à 1440 px de fenêtre : il reste 191 px de marge de chaque côté. La fiche se
loge désormais **dans cette marge**, du côté le plus large, et se centre
verticalement sur le chef-lieu de la région, rabattue dans le cadre si elle
dépasse. Largeur = `min(248, marge − 14)`, soit 172 px à 1440 px.

Sous `CARD_MIN` (150 px) — écrans étroits, où la marge disparaît — la fiche n'est
plus posée en absolu mais **rendue sous la carte**, en pleine largeur.

Mesuré à 1440 px : fiche de 1197 à 1369 px, tracé de 927 à 1183 px — aucun
recouvrement pour les cinq régions, et les cinq fiches tiennent dans le cadre.
À 375 px : fiche sous la carte, 335 px de large, aucun débordement horizontal.

Disparaissent avec cette refonte : `clampIntoFrame` et son `shift` à deux passes,
le type `Anchor`, et l'aide « Nord → Sud · cliquez une région » sous la carte
(clé `togo.mapHint` retirée des trois dictionnaires) — la fiche sous la carte
occupe cette place sur mobile.

## 7. Autres retouches (2026-10-12)
- « Le Togo en chiffres » : la carte 10 (entrée sans visa) passe sur fond jaune
  `bg-sun`, numéro et libellé assombris en conséquence. Format inchangé — mesuré
  à 316 × 215 px, comme les cartes 08 et 09.
- La bande blanche de 100 px entre Tourisme et Communauté est supprimée : les deux
  sections se touchent (écart mesuré à 0 px).

## Complément (18 oct.)
- « Le Togo en chiffres » : la carte 11 ouvre https://togo.gouv.tg/ dans un
  nouvel onglet ; sa ligne d'aide renvoie désormais au portail officiel (FR/EN/JA).
- « Histoire & culture » : onglet actif fond jaune, texte vert ; premier
  paragraphe de chaque onglet en semi-gras.
