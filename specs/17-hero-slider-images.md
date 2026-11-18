# 17 — Images du slider hero (accueil)

## Objectif
Remplacer les trois visuels du slider du hero de la page d'accueil par les photos
fournies par le client.

## Visuels
| Slide | Fichier | Sujet |
| --- | --- | --- |
| `decouverte` | `/design/hero-monument-independance.webp` | Monument de l'Indépendance, place du 13-Janvier, Lomé |
| `savoir-faire` | `/design/hero-port-lome.jpg` | Terminal à conteneurs du port autonome de Lomé |
| `rencontres` | `/design/hero-parade-osaka.jpg` | Parade togolaise dans l'anneau de bois de l'Expo 2025 Osaka |

Déposées dans `frontend/public/design/`. Les textes alternatifs des trois slides
(`hero.slides[].alt`, 3 langues) sont réalignés sur les visuels réellement affichés.

## Appel à l'action du slide 2
« Découvrir nos participants » → `/editions` devient « Investir au Togo » →
`/togo#investir` (section « Investir » de la page Togo), traduit en FR / EN / JA.

## Fichiers
- `frontend/src/lib/design.ts` — `SLIDES[].image`, `SLIDES[].imageAlt`, `SLIDES[1].cta1`.
- `frontend/src/i18n/dict.ts` — `hero.slides[].alt` et `hero.slides[1].cta1` (FR/EN/JA).

## Hors périmètre
Les anciens fichiers `slider-decouverte.jpg`, `slider-savoirfaire.jpg` et
`slider-horizons.jpg` restent en place : ils servent encore à la bannière de la
page Contact, à la galerie de la page Togo, aux onglets culture et à la
médiathèque.

## Vérification
`npm run audit` + contrôle des trois `src` rendus dans le DOM du hero.
