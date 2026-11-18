# 22 — Page Belgrade : bannière « statue », lumière et bandeau signature

## 1. Deux bannières, une seule modifiée
`BelgradeHero` est rendu deux fois d'affilée. Seul le premier rendu passe en
`variant="statue"` ; le second garde le dégradé irisé et la mascotte.

Le composant accepte un `idSuffix` pour que chaque `<h1>` garde un
`aria-labelledby` unique, et `priority` n'est passé qu'au premier rendu. La
mascotte est masquée sur la variante « statue » : elle occupait la droite de la
bannière, là où se trouve la statue.

## 2. La bannière « statue »
`public/design/belgrade/statue.jpg` (1672 × 941) : la photo de la statue **avec**
son ruban de drapeau, en `object-cover object-right`. L'ancrage à droite est
nécessaire, la statue est à 77 % de la largeur et un recadrage centré la ferait
disparaître sur les écrans en portrait.

Voile en deux couches : un dégradé horizontal qui assombrit la gauche, où se pose
le texte, et un vignettage vertical discret. En portrait, le recadrage ramène la
statue au centre sous le texte : un voile plein plus dense est ajouté sous `lg`.

## 3. La lumière qui tourne
La photo porte son ruban : on ne le redessine pas, on pose une **lumière** qui en
parcourt la spirale. `StatueGlint` (composant serveur, aucun état) trace une
hélice de deux tours et fait circuler trois reflets flous dessus, décalés en temps
(12 s, 15 s, 18 s).

Le mouvement est un `stroke-dashoffset` sur un **tracé fixe** : c'est ce qui le rend
continu et sans à-coup. Un ruban lui-même animé ne l'était pas — voir § 5.

Géométrie relevée sur la photo : axe de la colonne à x = 1277, rayon 118, de
y = 470 à y = 870 sur deux tours. Les passages avant tombent alors sur les bandes du
ruban à y = 630 et y = 830, les passages arrière à y = 530 et y = 730.

Repère 1672 × 941 et ancrage à droite identiques à la photo (`xMaxYMid slice` /
`object-right`) : les deux couches subissent le même recadrage, la lumière suit le
ruban sur tout l'écran. Sous `prefers-reduced-motion`, les reflets sont masqués et
la photo seule reste.

## 4. Bandeau signature remonté, duo plein écran
Le bandeau défilant n'est plus une section séparée après les deux bannières : il
est rendu **en bas de la bannière « statue »**, via une prop `marquee`. La bannière
passe en `min-h-svh flex flex-col`, son contenu en `flex-1 content-end`, le bandeau
en `shrink-0` — le duo occupe donc exactement la hauteur de l'écran, sur le même
modèle que le hero de l'accueil (`HeroExpo`, `min-h-svh`).

Le haut du contenu passe de `pt-36` à `pt-28` : à `pt-36` le contenu débordait de
18 px et la bannière mesurait 918 px pour 900 px de fenêtre. Mesuré après
correction : 900 px sur 900, et 844 px en émulation mobile (hauteur `svh`, comme
l'accueil).

## 4 bis. Section d'accueil, entre les deux bannières
Fond blanc, deux colonnes centrées verticalement (`lg:grid-cols-2`, 632 px chacune
en 1440 px). À gauche le titre de section, le titre, les deux paragraphes et le
bouton « Découvrir le Togo » vers `/togo` ; à droite la mascotte en pied de page
avec sa bulle, dans un cadre à coins arrondis comme le reste du site.

Textes ajoutés au dictionnaire dans les trois langues (`welcomeKicker`,
`welcomeTitle`, `welcomeParas`, `welcomeCta`, `welcomeAlt`) : le titre de section
reprend le nouveau titre du hero, « Du Togo, pour le monde ».

## 4 ter. Suppression et refonte de sections
Deux sections retirées : « Repères de l'événement + compte à rebours » et « La
participation du Togo » (`belgrade-vision`). Le lien `#participation` du bouton du
hero pointait vers la seconde : il est désormais `#rythmes`.

La bannière au dégradé irisé (deuxième hero, avec sa mascotte) n'existe plus. Elle
devient la **section des Rythmes**, qui reprend l'onglet « Rythmes » de la section
« Les fondements du pavillon » : titre de section « Les trois piliers de notre
participation », titre « Rythmes », à gauche l'accroche et l'introduction du
pilier, à droite les cinq danses.

Les cinq photos de danses viennent de `Downloads/togo-belgrade/assets/media/`
(`rhythm-agbadza`, `rhythm-bobobo`, `rhythm-takai`, `rhythm-tchimou`,
`rhythm-talkoutk`), converties en JPEG 1200 px de large et rangées dans
`BELGRADE_ITEM_IMAGES.rythmes`, dans l'ordre de `pillars[0].items`.

## 4 quater. Cartes à retourner
`RhythmCards.tsx` (client). Cinq cartes en `perspective`, chacune portant deux
faces en `backface-visibility: hidden` :

- **avant** — la photo de la danse en fond de carte, le nom et la région ;
- **arrière** — la région, l'accroche et la description du rythme.

Le retournement part du scroll : un `IntersectionObserver` (seuil 0,35) bascule
chaque carte sur sa face arrière à son entrée dans le viewport, décalé de 110 ms
par carte pour former un mouvement. L'observateur se déconnecte ensuite pour cette
carte (`unobserve`), un second passage ne rejoue donc rien : le clic reprend la
main et retourne la carte librement. `aria-pressed` reflète l'état ; la transition
est coupée sous `prefers-reduced-motion`.

Leçon apprise : un `translateZ(0)` (classe `transform-gpu`) placé sur le bouton
écrase le `rotateX(180deg)` imposé par le state — les deux écrivent la propriété
`transform`, c'est l'ordre dans le CSS généré qui gagne, pas l'ordre des classes
dans le JSX. On n'utilise donc plus que la classe arbitraire.

Clés ajoutées dans les trois langues : `rhythmsTitle`, `rhythmsAria`,
`rhythmsHint`.

## 4 quinquies. Retournement vertical, continu et alterné
Refonte du mécanisme : pivoter à 180° sur le bord haut ou bas déplace la carte
hors de sa case sous perspective (boutons mesurés à y = 29 et y = 695 pour des
cases à y = 362). Le pivot est donc **toujours au centre**, la grille ne bouge
jamais.

**Pilotage par le scroll.** L'angle de chaque carte suit sa traversée du viewport :
0° en entrant par le bas, ±180° en sortant par le haut. Descendre retourne donc
les cartes, remonter les redresse — et dans l'autre sens, puisque le mouvement
est continu (mis à jour en `rAF`). Le signe alterne par carte — 1, 3 et 5 d'un
côté, 2 et 4 de l'autre — ce sont les « X » et « -X » inversés. Un clic ajoute un
demi-tour à la carte cliquée.

**Faces.** Au lieu de compter sur `backface-visibility` seul (composition
capricieuse), la face montrée suit le cosinus de l'angle : de face, c'est l'avant ;
de dos, l'arrière ; les deux se fondent en opacité à 90°, quand la carte est de
profil. En complément, la face non montrée n'est tout simplement pas montée dans
le DOM (bascule à mi-transition) : impossible de superposer les deux textes.

**Section.** Le dégradé.irisé de l'ancienne bannière passe sur la section
(`play-gradient`). Titre de section, titre et paragraphe sont centrés, l'astuce
sur le retournement est supprimée (clé `rhythmsHint` retirée des trois
dictionnaires), et les cartes occupent toute la largeur (`lg:grid-cols-5`).
Face avant sans description ; face arrière : une autre photo du rythme, sa région,
son accroche et sa description, sous un voile `bg-forest/78` pour la lisibilité.

**Retouches.** Paragraphe d'intro retiré ; titre de section et sous-titre passés en
blanc (la pastille du `SectionKicker` garde son accent jaune). Cartes 2 et 4
décalées vers le bas (`lg:translate-y-14`), proportion `aspect-[2/3]`. Le clic
porte sa propre transition (700 ms) limitée à la carte cliquée : le scroll suit
sans intermédiaire. Face arrière épurée — la seule description, plus de nom ni
de région — sous un voile renforcé `bg-forest/90`; l'avant garde son voile actuel.

**Photos du dos.** `BELGRADE_RHYTHM_IMAGES_BACK` réutilise pour l'instant les mêmes
fichiers que l'avant, avec un `// TODO agent` explicite : il manque cinq secondes
photos de ces danses.

## 5. Ruban animé — abandonné
Deux tentatives, deux raisons d'abandonner :

- **Dessus la photo à ruban.** La photo porte déjà son ruban peint. Redessiner un
  ruban par-dessus donnait deux rubans concurrents, dont le nouveau traversait le
  socle à plat : la perspective partait en vrille.
- **Version sans ruban.** Avec une photo sans ruban, un ruban SVG pouvait être le
  seul. Le relief (passage arrière masqué par la silhouette) et l'alignement
  donnaient un rendu correct, mais le mouvement était saccadé : une hélice projetée
  ne change pas à la rotation, le ruban devait donc descendre le long de sa spirale,
  ce qui se lisait comme un glissement et non comme un enroulement.

D'où la solution retenue : la lumière seule, en `stroke-dashoffset`.

## Fichiers
- `frontend/public/design/belgrade/statue.jpg`
- `frontend/src/lib/belgrade.ts` — `BELGRADE_STATUE`.
- `frontend/src/components/StatueGlint.tsx` — lumière sur la spirale.
- `frontend/src/app/globals.css` — `togo-statue-glint`, `.statue-glint`.
- `frontend/src/app/[lang]/editions/belgrade-2027/page.tsx` — variante `statue`,
  prop `marquee`, hauteurs.

## Vérification
`npm run typecheck` + `npm run lint` (le build est laissé de côté tant que le
serveur de dev tourne : il réécrit `.next` et casse le serveur, cf. erreur
`Cannot find module './vendor-chunks/...'`). Contrôle dans le DOM : bandeau présent
dans la première bannière, `stroke-dashoffset` qui passe de 1483,76 px à 1325,29 px
en 1,2 s, hauteur de bannière égale à la fenêtre en 1440 px, seconde bannière
intacte.

## Limite connue
En portrait, la fenêtre visible ne montre qu'environ 26 % de la largeur de la
photo : la statue se retrouve au bord gauche. Recentrer le recadrage sur la statue
poserait un problème d'alignement — `object-position` accepte un pourcentage libre,
`preserveAspectRatio` non — il faudrait décaler l'overlay en CSS.

## À part — police d'affichage
`font-display` (Bricolage Grotesque) ne se chargeait plus en local : le log de dev
indiquait `Failed to download Bricolage Grotesque from Google Fonts. Using
fallback font instead.`, et les titres tombaient alors sur `local("Arial")`. Purge
de `.next` puis redémarrage : la police se retélécharge. La production n'avait
jamais été affectée. Si le symptôme revient, purge de `.next` et relance.

## Section « Jeux » (2026-10-08)
Après Rythmes, l'onglet « Jeux » du pilier devient une section pleine largeur :
même titre de section (`pillarsH2`), `h2` = `pillars[1].title` (« Les Jeux. »),
accroche `pillars[1].hook` et `pillars[1].intro`, puis 4 tuiles 2×2. Fond photo
fixe façon Communauté : `public/design/belgrade/jeux-ampe.jpg` (1448 × 1086,
partie d'Ampé convertie en JPEG 82 %, 513 Ko, clé `BELGRADE_IMG.jeuxAmpe`) en
`bg-fixed` + voile `from-black/75 via-black/60 to-black/80`. La clé existante
`BELGRADE_IMG.jeux` (`jeux.jpg`) n'est pas touchée : elle sert encore de
couverture du pilier et dans la galerie.

Nouveau `src/components/GameTiles.tsx` (serveur, pur CSS) : tuiles crème
`rounded-[20px]`, pastille numéro 01–04 `bg-forest text-sun`, nom, `meta` mono,
`hook`. Effet « pion de jeu » au survol (choix validé) : `hover:-translate-y-1.5`
+ bascule alternée `hover:rotate-1` / `hover:-rotate-1` + ombre agrandie +
`ring-sun` ; `motion-reduce` annule le mouvement. Textes à gauche, tuiles à
droite (`lg:grid-cols-[5fr_7fr]`) ; mobile en colonne unique. Vérifié :
typecheck + lint verts, DOM (4 tuiles, classes alternées), captures 1440 et 390.

## Tuiles photo + section haute (2026-10-08)
Section allongée : `py-[130px] lg:py-[170px]`. Tuiles agrandies
(`min-h-[360px] lg:min-h-[420px]`, `p-7`, `rounded-[24px]`, titre
`clamp(26px,2.4vw,34px)`), chacune avec son fond photo `next/image fill` +
voile `from-black/85 via-black/40 to-black/10`, textes passés en crème,
pastille cerclée `ring-cream/30`. Mapping `BELGRADE_GAME_IMAGES` dans
`lib/belgrade.ts`, ordre Adito/Ampé/Akonto/Vététré : `jeux.jpg` (`object-left`),
`jeux-ampe.jpg`, `jeux-enfants.jpg` (nouveau, `ampe12.png` converti JPEG 82 %,
407 Ko, deux fillettes au jeu de mains dans une cour d'école), et pour Vététré
`jeux.jpg` recadré `object-right` en miroir (`-scale-x-100`) —
on y voit des mains qui placent des graines, le geste précis du jeu.
`TODO agent: photo dédiée au Vététré` posé dans `lib/belgrade.ts`. Vérifié :
typecheck + lint verts, captures 1440 (4 photos distinctes et lisibles) et 390
(colonne unique).

## Section « Talents » (2026-10-08)
Après Jeux, l'onglet « Talents » devient une section sur le même dégradé irisé
(`play-gradient`), en miroir : cartes à gauche (`lg:grid-cols-[7fr_5fr]`),
textes à droite ; sur mobile le texte passe d'abord (`order-1`, cartes
`order-2`). Textes repris du pilier (`pillars[2]`, déjà FR/EN/JA) : même titre
de section, « Les Talents. », « Le Togo se crée et se partage. » et le
paragraphe fresques/sculpture/lokpo.

Nouveau `src/components/TalentCards.tsx` : 3 grandes cartes photo
(`min-h-[380px] lg:min-h-[440px]`) en escalier — chacune décalée vers la droite
et le bas en chevauchant la précédente (`ml-4/8 + -mt-8`, `sm:ml-10/20`,
`lg:ml-14/28`), pivotée (`-rotate-1`, `rotate-1`, `-rotate-1`), empilée
(`z-10/20/30`). Mapping `BELGRADE_TALENT_IMAGES` : `fresque.jpg`,
`sculpture.jpg`, `lokpo.jpg` (photos vérifiées : fresque murale, sculpture
bois, canopée textile suspendue). Animation « voile qui se lève » (choix
validé) : `group-hover:scale-[1.06]` sur la photo + voile à
`group-hover:opacity-50` + `ring-sun` ; `motion-reduce` fige le tout. Vérifié :
typecheck + lint verts, captures 1440 (escalier lisible, 3 photos distinctes)
et 390 (colonne unique, texte puis cartes).

## Paquet de cartes cliquable (2026-10-08)
`TalentCards` devient client : les cartes sont réduites (`h-[300px] sm:h-[320px]
lg:h-[340px]`, `p-6`, titre `clamp(24px,2.2vw,30px)`) et empilées en paquet —
la carte du dessus est entière, les deux autres dépassent en bas
(`translate-y-4/8`), rétrécies (`scale 0.97/0.94`), pivotées (`+1°/-1°`) et
assombries (`bg-black/30`). Un clic (ou Entrée/Espace, `role="button"`,
`aria-label` avec le nom du talent suivant) range la carte visible en bas du
paquet en 500 ms (`transition-all`, le `z-index` bascule à mi-course) et la
suivante remonte ; cycle infini. Cartes arrière en `pointer-events-none` et
`aria-hidden`, indice trilingue `belgrade.deckHint` sous le paquet. Le survol
« voile qui se lève » est conservé sur la carte du dessus. Vérifié : typecheck +
lint verts, clic testé dans le DOM (fresques → sculpture), captures 1440 et 390.

## Décollage en deux temps (2026-10-08)
Cartes légèrement agrandies (`h-[320px] sm:h-[340px] lg:h-[360px]`, paquet
`h-[368/388/408px]`). Le changement de carte se fait en deux temps : au clic,
la carte visible décolle d'abord par-dessus le paquet (`LIFT` : `-translate-y-10`,
`scale 1.04`, `z-50`, 280 ms), puis elle replonge en bas de pile pendant que la
suivante remonte — le `z-index` (50 → 10) bascule à mi-course de la seconde
transition, la carte passe donc devant puis derrière. Clics ignorés pendant
l'animation (`leaving`), timer nettoyé à l'unmount. Vérifié dans le DOM :
matrice à mi-décollage `scale 1.024, translateY -24px` (monte bien), carte à
360 px, cycle sculpture → lokpo.

## Centrage + grandes cartes (2026-10-08)
Indice visible sous le paquet retiré (le texte `deckHint` reste en `aria-label`
de la carte du dessus pour les lecteurs d'écran). Cartes encore agrandies :
`h-[360px] sm:h-[380px] lg:h-[400px]`, paquet `h-[408/428/448px]`. Colonne de
texte centrée (`text-center`, pastille + titre + paragraphe centrés, paragraphe
`ml-auto mr-auto`) pour répondre aux cartes, les deux colonnes restant centrées
verticalement (`items-center`). Vérifié : typecheck + lint verts, captures 1440
et 390.

## Section « Cœur du pavillon » (2026-10-09)
Section onglets « Les fondements du pavillon » (`#piliers`, `BelgradePillars`)
retirée de la page (le composant reste dans le code, inutilisé) ; CTA hero
« Explorer le pavillon » repointé vers `#coeur`. Nouvelle section `#coeur` à
son emplacement : fond photo fixe façon Communauté
(`public/design/belgrade/coeur-evala.jpg`, 1376 × 768, lutte Évala convertie
JPEG 82 %, 511 Ko, clé `BELGRADE_IMG.coeurEvala`) + voile
`from-black/75 via-black/60 to-black/80`. En-tête centré (`coeurKicker`,
`coeurTitle`, `coeurPara`, déjà FR/EN/JA dans le dict) puis 4 tuiles valeurs
(`coeurValues`) en `sm:2 cols / lg:4 cols` : `bg-forest/85 backdrop-blur`,
numéro 01–04 jaune, nom crème, description crème/80. Textes EN/JA traduits
(EVALA: More than wrestling… / エヴァラ：格闘を超えて…). Vérifié : typecheck +
lint verts, `#piliers` absent du DOM, CTA `#coeur` présent, captures 1440 (4
tuiles) et 390 (colonne unique).

## Coupe de 6 sections (2026-10-09)
Retirées de la page : Notre mascotte, Au cœur du récit (Evala), L'expérience
envisagée (parcours), Création & technologie, Perspectives & événements,
Rencontre universelle — suppression des deux blocs par plages de lignes
vérifiées (714 → 433 lignes), jonctions Cœur → Galerie → Journal propres. La
page ne compte plus que : Bienvenue, Rythmes, Jeux, Talents, Cœur, Galerie,
Journal (7 `h2` vérifiés dans le DOM). Aucune ancre interne ne pointait vers
les sections retirées. Vérifié : typecheck + lint verts, capture 1440.



## Portrait rond dans la section d'accueil (2026-10-12)
La mascotte en pied (`accueil.jpg`) laisse place à un **portrait cadré en rond**,
à la façon d'une photo de profil : `public/design/belgrade/accueil-portrait.jpg`
(2000 × 2000), nouvelle clé `BELGRADE_IMG.accueilPortrait`.

Cadre : `aspect-square max-w-[420px] rounded-full overflow-hidden`, image en
`fill object-cover` (la source étant déjà carrée, aucun recadrage visible),
liseré crème de 6 px et ombre portée verte pour détacher le disque du fond blanc.

`welcomeAlt` est réécrit dans les trois langues : il décrivait la mascotte bras
ouverts, il décrit maintenant le portrait.

Vérifié dans le DOM : 420 × 420 px, `border-radius: 9999px`, bordure
`6px rgb(243, 241, 234)`, `object-fit: cover`, source `accueil-portrait.jpg`.
`accueil.jpg` reste dans le dossier, plus référencé par la page.

## Rythmes : faces, fluidité, mise en page 70/30 (2026-10-12)
**La photo d'abord.** La plage de retournement était calée sur le *haut* de la
carte (`(0,9 vh − top) / 0,65 vh`) : à l'arrêt devant la section, la carte était
déjà à 180°, c'est-à-dire sur la description. Elle est désormais calée sur le
*centre* (`(0,42 vh − centre) / 0,42 vh`) : tant que la carte occupe la zone de
lecture l'angle vaut 0 et c'est la photo qui est montrée ; le retournement ne
commence qu'en remontant vers le haut de l'écran, et s'annule en redescendant.

**Fluidité.** Le `transform` est écrit directement sur le nœud dans la boucle
`rAF` ; React ne rend plus que lorsque la face visible change (passage du cosinus
par zéro), soit deux fois par demi-tour au lieu d'une fois par frame. Le clic
garde sa transition propre, portée à 900 ms en `cubic-bezier(.22,1,.26,1)`.
Ajout d'un garde-fou `visibilitychange` : une frame demandée pendant que l'onglet
est caché n'est jamais exécutée et bloquait sinon toutes les suivantes.

**Mise en page.** La section passe en deux colonnes `lg:grid-cols-[7fr_3fr]`
(mesuré 885,5 px / 379,5 px). À gauche les cartes en grille 3 × 2 — la colonne du
milieu descend de 40 px pour faire onduler la grille, et la sixième case accueille
la signature du pilier (`05` + `badge`) au lieu d'un vide. À droite un panneau
translucide (`bg-cream/10`, liseré crème, `backdrop-blur`) où les mascottes
débordent du cadre par le bas, avec le logo de la participation dans le coin
inférieur droit (104 px, à 21 px des deux bords — mesuré).

Deux halos flous, jaune à gauche et rouge à droite, donnent du relief au dégradé
irisé sans le charger. En-tête repassé à gauche plutôt qu'au centre, pour
répondre à la colonne des mascottes.

Nouveaux fichiers : `mascottes-duo.webp` (1122 × 1402, détourée) et
`logo-expo-togo.webp` (1125 × 967, blanc sur transparent, 3,3 % de pixels opaques
— vérifié au canvas). Clés `BELGRADE_IMG.mascottesDuo` / `.logoExpoTogo`, textes
alternatifs `mascottesAlt` / `logoAlt` dans les trois langues.

**Section d'accueil** un peu plus haute : `py-[130px] lg:py-[165px]` (840 px
contre 710).

**Limite de vérification.** Le volet navigateur rend `document.hidden === true` :
`requestAnimationFrame` n'y tourne jamais (0 frame mesurée sur 600 ms), le
retournement au scroll n'a donc pas pu être observé en direct. Le calcul a été
vérifié autrement, par le chemin du clic qui appelle le même code sans passer par
`rAF` : hors écran l'angle vaut 180° + demi-tour = 360°, en vue il vaut 0°.

## 9. Rythmes — disposition, mascottes et logo (reprise)

**Animation.** Les cartes se retournent réellement : rotation de 180° autour de
l'axe horizontal, pivot au centre, deux faces distinctes. L'angle suit le
défilement, la plage étant calée sur le *centre* de la carte pour que la photo
soit toujours la première face vue ; un clic retourne la carte à la demande. Le
`transform` est écrit directement sur le nœud dans la boucle `rAF` ; React ne
rend que lorsque la face visible change. Forme d'origine conservée :
`rounded-[24px]`. (Un essai de cartes « blob » déformées au défilement, inspiré
du site d'Expo 2027 Belgrade, a été écarté : ce n'était pas le rendu voulu.)

**Disposition.** Grille de six colonnes à partir de `lg`, chaque carte sur deux
colonnes : trois cartes en haut, les deux dernières centrées en dessous
(colonnes de départ 2 et 4). Même principe sur quatre colonnes en dessous de
`lg`. La sixième tuile de signature (« 05 — Cinq danses, cinq régions ») est
supprimée.

**Mascottes.** Plus de cadre : image posée à même le dégradé, ombre portée
seule. La colonne de droite passe à 36 % et l'image déborde de 14 % vers la
gouttière, ce qui lui donne presque la hauteur du bloc de cartes (644 px contre
696 à 1400 px de large) sans empiéter dessus.

**Logo.** Il appartient au décor, pas au contenu : `aria-hidden`, à 30 %
d'opacité, derrière le contenu, dans le coin inférieur droit d'où il déborde de
la section. `overflow-hidden` le recadre, si bien que sa taille (620 px de
large) n'allonge la section d'aucun pixel — le talon de la section est revenu à
`py-[110px] lg:py-[140px]`.

Fichiers : `frontend/src/components/RhythmCards.tsx`,
`frontend/src/app/[lang]/editions/belgrade-2027/page.tsx`.

## 10. Jeux — règles au survol, hauteur et cadrage du fond

**Hauteur.** Le talon de la section passe de `py-[130px] lg:py-[170px]` à
`py-[104px] lg:py-[136px]` : 68 px de moins sur grand écran, sans toucher aux
tuiles.

**Cadrage du fond.** `bg-center` devient `bg-top` : la photo d'arrière-plan est
cadrée par le haut, on voit enfin le haut de l'image.

**Les règles du jeu.** Chaque tuile porte désormais la description de son jeu,
déjà présente au dictionnaire (`belgrade.pillars[1].items[].text`, FR/EN/JA).
Elle est révélée par un volet vert qui monte du bas de la tuile, posé en absolu
par-dessus la photo : la tuile ne change pas de hauteur, la grille ne bouge
pas. Survol et clavier passent par CSS (`group-hover`,
`group-focus-visible`) ; la touche bascule l'état, d'où le passage de la tuile
en `<button>` avec `aria-expanded`. Rien ne se déplace sous
`prefers-reduced-motion`, le volet apparaît simplement.

Vérifié : le texte tient dans le volet dans les trois langues et à toutes les
largeurs testées (1400, 760 et 390 px), avec 42 px de marge dans le cas le plus
serré (anglais, Akonto, deux colonnes).

Fichiers : `frontend/src/components/GameTiles.tsx`,
`frontend/src/app/[lang]/editions/belgrade-2027/page.tsx`.

## 11. Talents — logo incrusté et descriptions au survol

**Logo.** Pendant de celui de la section Rythmes : même taille (620 px sur
grand écran, 400 à partir de `sm`, 280 en dessous), même traitement — décoratif
donc `aria-hidden`, 30 % d'opacité, derrière le contenu — et même coin,
inférieur **droit**. Il déborde de la section, que `overflow-hidden` recadre :
la hauteur ne change pas. Vérifié à 1400 px : 620 × 533, recadré de 64 px à
droite et 96 px en bas.

**Descriptions.** Chaque carte porte la description de son talent, déjà
présente au dictionnaire (`belgrade.pillars[2].items[].text`, FR/EN/JA). Les
deux gestes sont séparés comme demandé : le **survol** lève un volet vert
par-dessus la photo de la carte du dessus, le **clic** continue de faire passer
à la carte suivante. Le volet est posé en absolu et `pointer-events-none` : la
carte garde sa taille, le paquet ne bouge pas et le clic n'est jamais
intercepté. Seule la carte du dessus porte un volet ; il suit donc le paquet.
Le clavier l'ouvre aussi (`group-focus-visible`). Rien ne se déplace sous
`prefers-reduced-motion`.

Limite assumée : sur écran tactile, où il n'y a pas de survol, la touche fait
tourner le paquet et la description n'est pas atteinte — c'est la répartition
des gestes demandée.

Vérifié : le texte tient dans le volet dans les trois langues, pour les trois
cartes, à 1400, 760 et 390 px de large ; marge la plus serrée 96 px (français,
lokpo, mobile).

Fichiers : `frontend/src/components/TalentCards.tsx`,
`frontend/src/app/[lang]/editions/belgrade-2027/page.tsx`.

## 12. Bannière — version animée du plan de la statue

La bannière de la page Belgrade reçoit en fond une vidéo animée du même plan :
la statue, le ruban aux couleurs du Togo et le ciel au couchant, en boucle et
sans son. La photo `BELGRADE_STATUE` reste posée dessous — elle sert d'affiche
avant le chargement et prend seule le relais sous `prefers-reduced-motion`, où
`.hero-video { display: none }` masque la vidéo (règle déjà au `globals.css`).
Même cadrage que la photo (`object-right`), pour que la statue reste visible en
portrait. Les voiles et le reflet `StatueGlint` sont inchangés.

Préparation du média : la source livrée est un QuickTime (`ftyp qt`) dont la
piste son est en LPCM, deux choses que les navigateurs lisent mal ou pas du
tout en MP4. La piste vidéo étant déjà en H.264 1280 × 720 à 24 i/s, elle a été
remise dans un conteneur MP4 **sans ré-encodage**, la piste son étant écartée —
un fond de bannière est muet de toute façon. Résultat :
`public/videos/belgrade-banniere.mp4`, 10,5 Mo pour 10 s, du même ordre que
`togo-banniere.mp4` (9 Mo).

Vérifié au navigateur : `readyState` 4, 1280 × 720, 10,04 s, `loop` et `muted`
vrais, lecture en cours (le temps courant avance), aucune erreur de média.

Fichiers : `frontend/src/lib/belgrade.ts` (`BELGRADE_STATUE_VIDEO`),
`frontend/src/app/[lang]/editions/belgrade-2027/page.tsx`,
`frontend/public/videos/belgrade-banniere.mp4`.

## 13. Lueur du hero, photos des jeux et des talents, rideau des talents

**Lueur supprimée.** Le reflet qui parcourait le ruban de drapeau de l'ancienne
bannière n'a plus lieu d'être maintenant que le plan est animé : le composant
`StatueGlint` est supprimé, ainsi que ses règles `@keyframes
togo-statue-glint`, `.statue-glint` et son repli `prefers-reduced-motion` au
`globals.css`.

**Jeux.** Nouvelles photos pour les deux dernières tuiles :
`jeux-akonto.webp` (enfants autour d'une toupie) et `jeux-vetetre.webp`
(terrain tracé à la craie, graines alignées, joueurs en tenue). Le choix
d'attribution vient du texte : le Vététré « se pratique aussi en compétition »
et se joue avec des graines, ce que montre la seconde photo ; à confirmer par
le commanditaire. `jeux.jpg` ne sert donc plus qu'une fois, et
`jeux-enfants.jpg` n'est plus utilisée.

**Talents.** Nouvelles photos : `fresque-mosaique.webp` (mur de mosaïque à la
colombe), `sculpture-atelier.webp` (sculpteur sur bois à l'atelier),
`lokpo-tissage.webp` (tissage au métier). `fresque.jpg`, `sculpture.jpg` et
`lokpo.jpg` ne sont plus utilisées.

**Hauteur.** Section `py-[150px] lg:py-[200px]` (contre 130/170) et cartes
`h-[410px] sm:h-[440px] lg:h-[470px]` (contre 360/380/400), le paquet suivant à
`h-[458px] sm:h-[488px] lg:h-[518px]`. La section passe de 788 à 918 px à
1400 px de large.

**Nouvelle animation de la description.** Le volet montant est remplacé par un
**rideau en diagonale** : le découpage du voile est un triangle dont le bord de
fuite est à 45°, qui passe d'un point au coin bas-gauche à une surface
débordant la carte, en 620 ms. Le texte suit derrière, ligne à ligne
(`.talent-line-1` à 250 ms, `.talent-line-2` à 350 ms). Tout est en CSS, piloté
par `.group:hover` et `.group:focus-visible` : aucun rendu React, et le clic
reste réservé au passage à la carte suivante. Sous `prefers-reduced-motion`,
les transitions sont coupées et la description apparaît d'un coup.

Fichiers : `frontend/src/lib/belgrade.ts`,
`frontend/src/components/TalentCards.tsx`,
`frontend/src/app/[lang]/editions/belgrade-2027/page.tsx`,
`frontend/src/app/globals.css`, `frontend/src/components/StatueGlint.tsx`
(supprimé), cinq nouvelles images sous `public/design/belgrade/`.

## 14. Ménage, cœur du pavillon, calendrier officiel, médias & presse

**Ménage.** `BelgradePillars` et `BelgradeGallery` n'avaient plus de
consommateur : composants supprimés, ainsi que les constantes qui ne servaient
qu'à eux (`BELGRADE_PILLAR_COVER`, `BELGRADE_ITEM_IMAGES`,
`BELGRADE_PILLAR_SKINS`, `BELGRADE_GALLERY`, `BelgradeGalleryKind`). Cinq
images devenues orphelines sont effacées : `jeux-enfants.jpg`, `fresque.jpg`,
`sculpture.jpg`, `lokpo.jpg`, `coeur-evala.jpg`. Les six photos de l'ancienne
galerie (`evala`, `danse`, `artisanat`, `jeunesse`, `maquette`, `belgrade`) et
leurs libellés `gal*` au dictionnaire sont **conservés** : ce sont des
photographies d'origine, à rebrancher si une galerie revient.

**Cœur du pavillon.** Fond remplacé par `coeur-lutte.webp` (lutteurs en pleine
projection devant les gradins).

**Calendrier officiel** remplace « Photographies & projets ». Nouveau composant
`BelgradeRoadmap` : chemin vertical, trait à gauche jusqu'à `lg` puis au centre
avec les étapes alternant de part et d'autre. Le trait se trace du haut vers le
bas en 1,5 s et les étapes montent l'une après l'autre (décalage 220 ms) dès
que le bloc entre en vue — observation à usage unique, réglée comme `Reveal`
(`threshold: 0.1`), et tout est posé d'emblée sous `prefers-reduced-motion`.
Couleurs : vert, rouge, jaune ; sur fond blanc le jaune ne se lisant pas, la
troisième étape porte son numéro en vert.

Les trois temps forts sont rangés dans l'ordre du calendrier, et non dans
celui de la demande : 29 juin (journée économique), 30 juin (soirée
d'animation culturelle), 1ᵉʳ juillet (journée nationale). Les textes
d'accompagnement sont rédigés à partir du contenu déjà publié sur la page ;
horaires et lieux restent à préciser, ce que dit le chapeau.

**Médias & presse**, après « Communiqués & journal » : aplat rouge, titre
« Suivez le Togo jusqu'à Belgrade. » avec l'accent en jaune via `AccentTitle`
(et non un découpage à la main, qui ne tenait pas en japonais), et les quatre
documents — dossier de presse, dossier de sponsoring, charte graphique, exposé
thématique.

Les fichiers n'ayant pas été fournis, `BELGRADE_PRESS_DOCS` porte `href: null`
pour les quatre : la ligne s'affiche avec sa mention « bientôt disponible » et
n'est pas un lien. Aucun lien mort n'est publié, conformément à `AGENTS.md`.
Dès que les PDF seront déposés sous `public/documents/`, renseigner `href` les
transforme en liens de téléchargement sans autre changement.

Fichiers : `frontend/src/lib/belgrade.ts`, `frontend/src/i18n/dict.ts`
(clés `road*` et `press*`, FR/EN/JA),
`frontend/src/components/BelgradeRoadmap.tsx` (nouveau),
`frontend/src/app/[lang]/editions/belgrade-2027/page.tsx`,
`frontend/src/components/BelgradePillars.tsx` et `BelgradeGallery.tsx`
(supprimés).

## 15. Thème de la participation, logotype officiel et charte graphique

Nouvelle section placée entre le calendrier officiel et « Communiqués &
journal ».

**Le thème.** « Togo : rythmes, jeux et talents au service de l'inclusion et de
l'innovation », avec l'accent jaune sur la seconde moitié. Il est présenté avec
le thème international dont il est la déclinaison — « Jouer pour l'humanité :
sport et musique pour tous » —, cité d'après le guide d'utilisation du
logotype.

**Le logotype officiel** est dévoilé à cette occasion, en version couleur sur
une plaque blanche : la charte réserve explicitement cette version aux fonds
blancs et clairs, et la mention sous l'image le rappelle. Le texte
d'accompagnement reprend le concept du guide : les trois silhouettes aux
couleurs du drapeau pour les femmes, les hommes et la jeunesse, des formes qui
évoquent le mouvement, le sport, la musique et le dialogue, et le Monument de
l'Indépendance de Lomé au cœur du symbole.

**La charte graphique** est enfin téléchargeable : le PDF fourni est déposé
sous `public/documents/charte-graphique-togo-expo-belgrade-2027.pdf` (25 pages,
1,8 Mo) et le bouton pointe dessus. Vérifié servi en 200 avec le type
`application/pdf`.

Fond vert quadrillé de halos, comme la section Rythmes, pour trancher avec le
blanc du calendrier qui précède.

## 16. Médias & presse — retour au vert et liste réduite

L'aplat rouge revient au vert `forest` (vérifié : `rgb(0, 48, 31)`). La liste
ne garde que le **dossier de presse** et le **dossier de sponsoring** : la
charte graphique a désormais son propre bouton dans la section du thème, et
l'exposé thématique est retiré. `BELGRADE_PRESS_DOCS` passe de quatre à deux
entrées, toujours sans `href` tant que les fichiers ne sont pas fournis.

Fichiers : `frontend/src/app/[lang]/editions/belgrade-2027/page.tsx`,
`frontend/src/lib/belgrade.ts`, `frontend/src/i18n/dict.ts`,
`frontend/public/design/belgrade/logo-togo-expo-couleur.png`,
`frontend/public/documents/charte-graphique-togo-expo-belgrade-2027.pdf`.

## 17. Détails graphiques — essai écarté

Les deux mentions techniques de la section du thème — le poids du PDF et la
règle d'usage du logotype — sont retirées : la première n'apprend rien au
visiteur, la seconde s'adresse aux graphistes, qui trouveront la règle dans la
charte elle-même.

Un habillage graphique a été essayé puis **retiré à la demande du
commanditaire** : galon tissé en pied de section, hachures à la craie, grain
imprimé sur les aplats verts, et un battement à trois temps remplaçant le tiret
des surtitres. Jugé excessif. La page revient à sa base : aplats pleins, tiret
jaune devant les surtitres, et les seules animations déjà en place (cartes,
rideau des talents, galeries).

À retenir si la question revient : l'habillage était fidèle au sujet — le
tissage du pagne, la craie des terrains d'Ampé, la mesure à trois temps — mais
quatre motifs simultanés sur une page déjà riche en photographies et en
animations faisaient trop. Un seul, mieux placé, serait sans doute mieux reçu.
