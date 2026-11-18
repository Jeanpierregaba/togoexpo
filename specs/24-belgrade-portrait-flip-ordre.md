# 24 — Belgrade : portrait animé, retournement au survol, ordre des sections

## Objectif
Trois ajustements sur `/[lang]/editions/belgrade-2027`, demandés après la mise en
ligne du 13 octobre 2026.

## 1. Section « Du Togo, pour le monde » — animation du portrait
Le portrait rond de la mascotte (`accueil-portrait.jpg`) est figé. Au survol :
- la photo s'agrandit doucement dans son cercle (`scale` 1.07, 700 ms) ;
- un anneau pointillé vert apparaît autour du cercle et se met à tourner
  lentement (18 s par tour) ; hors survol l'anneau est effacé et son animation
  en pause, donc aucun calcul permanent ;
- l'ombre portée se creuse et le liseré passe du crème au jaune.

Le survol porte sur le conteneur (`group`), pas sur la photo : l'anneau, posé en
dehors du cercle, reste donc allumé quand le curseur l'effleure. Sous
`prefers-reduced-motion` : aucun agrandissement, aucune rotation.

## 2. Section « Rythmes » — retournement au survol
Jusqu'ici l'angle des cartes suivait le défilement et le clic ajoutait un
demi-tour. Nouvelle règle, plus simple et plus prévisible :
- **survol / focus clavier** → la carte se retourne et montre sa seconde face ;
- **sortie du curseur** → elle reprend sa face initiale ;
- **clic / toucher** → retournement verrouillé (seul moyen sur écran tactile),
  reflété par `aria-pressed`.

Le calage sur le défilement est retiré : deux pilotes pour un même angle se
contredisaient (une carte déjà retournée par le défilement se serait *dé*tournée
au survol). L'angle devient un état React simple, la transition est portée par
CSS, et les faces ne sont plus cachées à la main : `backface-visibility` suffit
dès lors que le `transform` ne sort plus de React.

Tailles : les cartes passent de `3/4` à `7/10` (+7 % de hauteur, 260 × 372 px
au lieu de 260 × 347 px sur un écran de 1440) et la description de 13 à 15 px.
La croissance se fait en hauteur et non en largeur : élargir la colonne des
cartes aurait rétréci celle des mascottes, qui doivent rester presque aussi
hautes que le bloc de cartes (665 px mesurés, soit 87 % des 768 px du bloc) et
qui débordent déjà jusqu'au bord de l'écran.

## 3. Ordre des sections
`#theme` (Thème de la participation) remonte juste après « Du Togo, pour le
monde », avant `#rythmes` : on annonce le thème avant de détailler les trois
piliers qui le servent. Ordre final : bannière, accueil, **thème**, rythmes,
jeux, talents, cœur du pavillon, calendrier, journal, presse, communauté.

## Fichiers autorisés
- `frontend/src/app/[lang]/editions/belgrade-2027/page.tsx`
- `frontend/src/components/RhythmCards.tsx`
- `frontend/src/app/globals.css`

## Vérification
`npm run audit` + relevé dans le navigateur : ordre des sections, angle des
cartes au survol et au retrait, absence de rognage des mascottes.
