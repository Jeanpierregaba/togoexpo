# 10 — Blog : page « Actualités » et pages d'article

Fiche de tâche (une tâche = une fiche, cf. AGENTS.md). Périmètre : frontend uniquement.

Objectif : la liste des actualités n'avait jamais été habillée (cartes `rounded border
bg-white` du squelette). Elle reprend l'habillage des cartes de l'accueil — aplats jaune /
vert / rouge, médaillon, soulèvement au survol — avec la disposition de l'inspiration
fournie : chapô, filtres par catégorie, recherche, grille de cartes.

## 1. Carte d'article partagée

- `src/components/ActuCard.tsx` : la carte dessinée pour l'accueil (`HomeActus`) devient un
  composant à part, utilisé par l'accueil **et** par la page Actualités. Un seul endroit à
  toucher pour faire évoluer l'habillage.
- Teinte donnée par l'index (`ACTU_SKINS`, rotation jaune → vert → rouge), numéro `01`,
  catégorie réelle du CMS (repli sur le libellé générique), année, extrait sur 4 lignes,
  pastille verte « Lire l'article » et durée de lecture.

## 2. Données : catégories WordPress

- `GET_HOME`, `GET_POSTS` et `GET_POST` remontent `categories { nodes { name slug } }`,
  pour que les cartes affichent la même catégorie partout.
- `PostListItem` gagne `categories: { name, slug }[]` ; `toPosts` ignore la catégorie
  technique `uncategorized*` (bruit d'installation WordPress, jamais affichée).
- Aucun fetch direct : tout passe par `wpQuery` (`src/lib/wp.ts`).

## 3. Page `/actualites`

- Bandeau de tête au gabarit des autres pages internes (fil d'Ariane, pastille, titre
  `clamp(40px,6vw,75px)`, accroche), avec le nombre d'articles publiés. Passé sur
  `PageHero` et une photo de fond en fiche 11.
- `src/components/ActusList.tsx` (client) : filtres par catégorie + recherche instantanée.
  - Filtres construits à partir des catégories réellement présentes dans les articles
    (seuil d'affichage revu en fiche 11 : la barre apparaît dès une catégorie).
  - Recherche sur titre + extrait + catégorie, insensible à la casse et aux accents
    (`norm`, extrait dans `src/lib/text.ts` et partagé avec la FAQ de l'accueil).
  - Compteur `aria-live`, état « aucun résultat » renvoyant vers le contact.
- Grille `md:grid-cols-2 lg:grid-cols-3`, teintes en rotation sur la liste filtrée.

## 4. Pages d'article `/actualites/[slug]`

- Catégorie affichée en pastille jaune dans le bandeau, à côté de la date et de la durée
  de lecture.
- Nouvelle section « À lire aussi » en fin d'article : les trois publications suivantes,
  avec les mêmes cartes colorées que la liste et l'accueil.
- Corps de l'article, fil d'Ariane, JSON-LD et boutons de bas de page inchangés.

## Dictionnaire

`actusIdx` gagne `kicker`, `count`, `all`, `searchPh`, `searchAria`, `clear`, `noResult`,
`noResultCta`, `countOne`, `countMany` ; `actuDetail` gagne `more`. Trois langues.

## Vérification

- `npm run audit` (typecheck + lint + build) vert.
- `/fr/actualites`, `/en/actualites`, `/ja/actualites` : cartes colorées en rotation,
  recherche (terme présent → filtrage, terme absent → état vide), compteur, article
  ouvert depuis la liste, section « À lire aussi » peuplée, aucun débordement horizontal
  de 375 px à 1440 px.
