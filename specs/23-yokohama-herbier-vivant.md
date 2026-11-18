# 23 — Yokohama 2027 : refonte complète, direction artistique « herbier vivant »

## Pourquoi

La page existait mais tenait en une seule recette répétée neuf fois : surtitre,
titre, paragraphe, cartes arrondies de 26 px, fonds blanc et crème en
alternance. Rien n'y disait que GREEN×EXPO 2027 Yokohama est une **exposition
internationale d'horticulture**. D'où le constat du commanditaire : « trop
générique ».

Source : *Yokohama Expo Technique*, offre technique, juillet 2026, 19 pages
(Canva, Douriath ABOU).

## La direction artistique

**Le parti : la planche d'herbier.** Le sujet est botanique ; la page emprunte
donc sa forme aux planches de botaniste. Papier quadrillé, planches numérotées
en chiffres romains, binômes latins en italique, filets fins et étiquettes à
petites capitales. Les grands arrondis disparaissent — `rounded-[4px]` au lieu
de 26 px — et les cartes cèdent la place à des blocs séparés par des filets
d'un pixel.

**La palette** reste strictement celle du site, mais sa proportion change : le
vert (forest, pine, sage, mist) prend toute la place, le jaune signe les
accents sur fond vert, le rouge se réduit aux repères — surtitres, numéro de
planche actif, élément mis en avant sur le plan. La règle de contraste déjà
posée pour le reste du site (rouge sur clair, jaune sur vert) est respectée.

**La règle de mouvement : tout pousse.** Un seul geste, décliné partout.
Les blocs se dévoilent du bas vers le haut par un découpage qui s'ouvre
(`yk-grow`), jamais par un fondu ni un glissement latéral. Les traits se
tracent depuis leur origine (`yk-draw-y` pour la tige verticale qui accompagne
le concept créatif, `yk-draw-x` pour les filets de titre et la ligne de temps).
Les grandeurs du pavillon montent jusqu'à leur valeur (`CountUp`). Dans la
bannière, deux feuillages respirent sur 19 et 27 secondes, d'une amplitude de
1,5 % — une respiration, pas une animation.

Le déclenchement est partout le même que celui de `Reveal` déjà en place
(`IntersectionObserver`, `threshold: 0.1`, une seule fois), pour que la page
batte d'un seul rythme. Sous `prefers-reduced-motion`, la feuille de style
neutralise découpages, transformations et respirations.

## Les trois pièces maîtresses

**La planche des cinq plantes** (`YokohamaPlate`) remplace la grille de cinq
cartes identiques. Un spécimen tenu en pleine page avec ses coins de montage,
son numéro de planche, son nom et son binôme latin ; à côté, l'index des cinq
espèces, comme les onglets d'un classeur. Les cinq photographies sont montées
et superposées, seule l'opacité change : pas de rechargement. La notice est
remontée par sa `key` pour rejouer son entrée. Clavier : flèches, `Début`,
`Fin`.

**Le plan du pavillon** (`YokohamaStand`) remplace la photographie de concept
enfermée dans un cadre. La plaquette décrit un aménagement précis — cinq
plantes au centre, dix tablettes autour, un écran principal, un coin « Rentrez
avec un bout du Togo » — qu'une photo ne montre pas. Le plan est en SVG, à
l'échelle des 20 m² ; survoler une entrée de la légende éclaire les éléments
correspondants et éteint les autres, et inversement. Le quadrillage du papier
millimétré court dessous.

**Les grandeurs du pavillon** : 20 m², 5 plantes, 10 tablettes, 192 jours
d'exposition. Les 192 jours sont calculés du 19 mars au 26 septembre 2027
inclus.

## Le reste de la page

Bannière pleine hauteur avec voile vert en diagonale et feuillages ; concept
créatif accompagné de sa tige, avec la signature « Préserver la nature,
construire demain » en pied d'étiquette ; trois piliers en colonnes séparées
d'un filet sur fond vert quadrillé ; stratégie de communication **avant /
pendant / après** reprise de la plaquette, posée sur une ligne de temps qui se
trace ; deux plans rapprochés (baobab, hysope) avec légende botanique ; compte
à rebours ; documentation, journal et galerie restylés.

## Contenu

Les textes existants couvraient déjà la plaquette et sont conservés. Ajouts au
dictionnaire (FR / EN / JA) : `signature`, `plateLabel`, `plateIndex`,
`plateUse`, `standKicker`, `standH2a/b`, `standPara`, `standPlanAria`,
`standFigures`, `standLegend`, `phasesKicker`, `phasesH2`, `phasesAccent`,
`phases`.

Les binômes latins vivent dans `lib/yokohama.ts` et non au dictionnaire : la
nomenclature botanique est la même dans les trois langues. *Adansonia
digitata*, *Hoslundia opposita*, *Phyllanthus amarus*, *Coffea canephora*,
*Theobroma cacao*. Les deux premiers étaient déjà affirmés par les textes
alternatifs du projet. **Hypothèse à confirmer** : la plaquette ne précise pas
l'espèce de café ; `Coffea canephora` retient le robusta, très majoritaire au
Togo.

## Fichiers

`frontend/src/app/[lang]/editions/yokohama-2027/page.tsx` (réécrite),
`frontend/src/components/YokohamaGrow.tsx`, `YokohamaPlate.tsx`,
`YokohamaStand.tsx` (nouveaux), `frontend/src/lib/yokohama.ts`,
`frontend/src/i18n/dict.ts`, `frontend/src/app/globals.css`.

## Vérification

`npm run audit` vert : typecheck, « ✔ No ESLint warnings or errors », 52/52
pages. Au navigateur : douze sections dans l'ordre, planche à cinq entrées dont
le changement bascule bien l'opacité et le `aria-current` (vérifié de la
planche I à la IV et retour), plan présent avec ses 31 formes et ses quatre
entrées de légende.

## Correctif — page blanche au premier essai

La première version masquait les blocs **par défaut** dans la feuille de style
et ne les révélait qu'une fois signalés par un `IntersectionObserver`. Tout
reposait donc sur un seul mécanisme : s'il ne répondait pas, la page restait
vide. C'est ce qui s'est produit.

Trois corrections, par ordre d'importance :

1. **Le masquage n'est plus l'état par défaut.** Il est posé par le script au
   montage (`.yk-armed`, en `useLayoutEffect`, donc avant le premier affichage)
   et *retiré* au dévoilement — et non recouvert par une règle plus forte.
   L'état final ne dépend ainsi ni de l'ordre de la feuille de style, ni du bon
   déroulement de la transition. Sans JavaScript, ou si l'effet ne tourne pas,
   rien n'est masqué.

2. **Plus d'`IntersectionObserver`.** Un seul guetteur partagé mesure au
   défilement, avec une limite de 90 ms entre deux passes, plus des passes de
   rattrapage au chargement des images (400 ms et 1,5 s) et au
   redimensionnement. Une seule écoute pour les 43 blocs de la page.

3. **Un bloc franchi reste dévoilé.** La condition ne vérifie plus qu'il soit
   *encore* à l'écran : un défilement rapide, ou l'un des deux liens d'ancre de
   la bannière, sautait des blocs qui ne se montraient alors plus jamais.
   Mesuré avant correction : un saut direct en bas de page laissait 23 blocs
   sur 43 définitivement masqués ; après, les 43 se dévoilent, et les 11 traits
   se tracent.

Leçon de méthode : le volet de prévisualisation ne délivre **aucun** événement
de défilement et ne fait progresser aucune transition — mesuré, zéro événement
alors que la position passait bien à 2600 px. Toute vérification d'un
comportement lié au défilement y est donc aveugle, et c'est ce qui a laissé
passer le défaut.

## Ajustements de la bannière et coupes

**Bande défilante.** Les cinq plantes passent en continu au pied de la
bannière, chacune suivie de son binôme latin en jaune et séparée d'une feuille
— la ponctuation reste botanique, là où Belgrade emploie une étoile. La liste
est triplée pour que le défilement de -50 % de la piste se referme sans saut,
et réutilise l'animation `.play-marquee` déjà en place. Décorative, donc
`aria-hidden` : les cinq espèces sont nommées et décrites juste en dessous dans
la planche.

**Compte à rebours dans la bannière.** La ligne « 19 mars — 26 septembre 2027 ·
Yokohama, Japon » cède la place au compte à rebours jusqu'à l'ouverture. Le
calendrier complet reste accessible : il est déjà dans le chapeau et dans les
métadonnées de la page.

**Trois sections supprimées** : « Stratégie de communication » (avant / pendant
/ après), « Ouverture de GREEN×EXPO 2027 » — le compte à rebours étant remonté
dans la bannière, la section faisait doublon — et « Photographies &
conception ». Le composant `YokohamaGallery` et la constante
`YOKOHAMA_GALLERY` n'avaient plus de consommateur et sont supprimés ; les
libellés `gal*` du dictionnaire restent, `galCatNature` servant encore aux
légendes botaniques des deux plans rapprochés.

La page compte désormais neuf sections au lieu de douze.
