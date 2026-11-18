# 23 — Accueil : diapositives, couleurs de section, retouches

## 1. Bannière d'accueil
Première diapositive sur `/design/hero-colombe-paix.webp` (2000 × 1116) : le
monument de la Paix et sa colombe, au crépuscule sur Lomé.

Les trois titres sont réécrits (`hero.slides[].t1` / `t2`, FR / EN / JA) :

| # | Ligne 1 | Ligne 2 (accent jaune) |
| --- | --- | --- |
| 1 | Le Togo. | Toute une richesse à découvrir. |
| 2 | Le Togo, | une richesse qui se révèle. |
| 3 | Le Togo se découvre. | Et se garde en mémoire. |

`SLIDES[].title` dans `design.ts` est aligné sur ces libellés.

## 2. Une seule couleur d'accent par fond
L'alternance rouge / jaune est abandonnée : sur un fond donné, la pastille de
section et le mot mis en avant portent **la même** couleur, celle qui s'y lit.

| | Fond clair | Fond vert |
| --- | --- | --- |
| Pastille de section | **rouge** | **jaune** |
| Mot mis en avant du titre | **rouge** | **jaune** |

Pourquoi : les deux combinaisons écartées sont illisibles. Jaune `#FFCE00` sur
blanc = 1,26:1 et sur crème = 1,32:1 ; rouge `#D20F34` sur vert forêt = 3,4:1.
WCAG AA demande 4,5:1. Les deux retenues passent : rouge sur blanc = 6,9:1,
jaune sur vert forêt = 11,4:1.

`SectionKicker` et `accentClass` portent la règle, et renvoient désormais la même
valeur pour un ton donné. Dix titres écrivaient encore leur accent en dur
(`<span className="text-sun|text-blood">`) : ils ont été repris un par un, après
vérification du fond de leur section — Yokohama ×5, Mission, FAQ, Médiathèque,
Découvrir le Togo, Éditions.

## 3. Titres `h2` +15 %
Vingt et un titres agrandis de 15 %, arrondis à l'entier — `50px → 57px`,
`clamp(34px,4.6vw,58px) → clamp(39px,5.29vw,67px)`, etc. Les deux constantes
partagées `H2` (Belgrade, Yokohama) sont traitées de la même façon. Les `h1` ne
bougent pas.

## 4. Découvrir le Togo
- La légende du volet illustré perd son lieu et son titre : il ne reste que les
  pastilles de navigation. L'icône de localisation (`PinIcon`) est supprimée.
  Les clés `shots[].place` / `title` restent au dictionnaire, elles servent encore
  d'`aria-label` aux pastilles.
- « En savoir plus » pointe vers `/togo`, quel que soit l'onglet — avant,
  `/togo#culture`, `/togo#tourisme` et le site externe Togo Invest.

## 5. Médiathèque
Première tuile : `tile-2.jpeg` (marché aux fétiches) remplacée par
`hero-parade-osaka.jpg`, la parade togolaise de l'Expo 2025 Osaka, avec sa
légende dans les trois langues. Choix de l'agent faute de visuel fourni —
remplaçable d'un mot.

## 6. Communauté officielle
Les six réseaux passent sur trois colonnes à toutes les tailles (deux rangées de
trois) au lieu d'une seule rangée de six en `xl`. Écarts horizontaux élargis
(`gap-x-6 sm:gap-x-8`).

## Fichiers
- `frontend/public/design/hero-colombe-paix.webp`
- `frontend/src/lib/design.ts` — diapositive 1, première tuile de la galerie.
- `frontend/src/i18n/dict.ts` — titres des diapositives, alt, légende de tuile.
- `frontend/src/components/SectionKicker.tsx` — inversion des deux couleurs.
- `frontend/src/components/TogoCards.tsx` — légende, bouton.
- `frontend/src/components/Community.tsx` — grille 3 colonnes.
- Accents en dur et tailles de `h2` : Mission, HomeFaq, MediaWall,
  EditionsExplorer, UpcomingEvents, HomeActus, FeaturedActu, SiteFooter,
  Community, TogoCards, pages Togo / Yokohama / Belgrade / article.

## Vérification
`npm run audit` + contrôle dans le DOM : trois visuels et trois titres de
diapositive, couleur calculée de chaque pastille et de chaque accent (rouge sur
clair, jaune sur vert), taille des `h2` (57 px contre 50), légende du volet vide, `href` du bouton
`/fr/togo`, première tuile de galerie, grille sociale 3 × 2.
