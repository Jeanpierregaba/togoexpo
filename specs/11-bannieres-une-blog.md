# 11 — Bannières uniformisées et article à la une

Fiche de tâche (une tâche = une fiche, cf. AGENTS.md). Périmètre : frontend uniquement.

## 1. Bannière commune aux pages internes

- `src/components/PageHero.tsx` : la bannière dessinée pour la page Togo devient un
  composant partagé — `min-h-[70vh]`, contenu calé en bas (`flex flex-col justify-end`),
  photo en `fill`/`object-cover` chargée en `priority`, voile `bg-forest/60` doublé d'un
  dégradé `from-forest/60 via-forest/20 to-forest`, crédit photo en bas à droite
  (masqué sous `sm`).
- Props : `image`, `labelledBy` (l'`id` du `h1`, pour nommer la région) et `credit`
  facultatif ; le contenu du bandeau reste propre à chaque page.
- Reprise par `/togo`, `/actualites` et `/contact`. Seule l'image change :
  - Togo → `/design/hero-independance.jpg` (inchangée) ;
  - Actualités → `/design/news-banniere.jpg` ;
  - Contact → `/design/slider-decouverte.jpg`.
- Crédits photo ajoutés au dictionnaire (`actusIdx.heroCredit`, `contact.heroCredit`)
  dans les trois langues ; ils décrivent ce que montre la photo, sans affirmer un lieu
  ou une édition qui ne serait pas vérifiable.

## 2. Page Actualités : article à la une

- `src/components/FeaturedActu.tsx` : la publication la plus récente occupe toute la
  largeur, au-dessus des filtres. Même habillage que les cartes (aplat jaune, médaillon
  arrondi, pastille verte « Lire l'article », durée de lecture), mais image et texte
  côte à côte en `lg` (`7fr / 5fr`), empilés en dessous.
- La une est exclue de la liste filtrée : `ActusList` reçoit `posts.slice(1)` et
  `startIndex={1}`, ce qui fait continuer la numérotation (02, 03…) et la rotation des
  teintes (vert, rouge, jaune…).
- Un seul article publié : la une s'affiche seule, sans bloc de liste.

## 3. Filtres et recherche

- La barre de filtres s'affiche dès qu'une catégorie existe en CMS (auparavant masquée
  en dessous de deux catégories), sur la même ligne que le champ de recherche
  (`flex flex-wrap items-center justify-between`). Sous `sm`, la recherche passe à la
  ligne.

## Vérification

- `npm run audit` (typecheck + lint + build) vert.
- `/fr|/en|/ja` sur `/togo`, `/actualites`, `/contact` : bannière à 70 vh avec la bonne
  photo et le bon crédit ; page Actualités avec la une pleine largeur, filtres actifs
  (« Actus » → 1 article) alignés avec la recherche ; aucun débordement horizontal
  de 375 px à 1440 px.

## Bannières blog + contact (2026-10-09)
- Blog (`/actualites`) : `public/design/news-banniere.jpg` remplacée par la photo
  de la fête sur scène (`_ARI6492.jpg`, drapeaux Togo/Japon, 1920 px, JPEG 82 %,
  796 Ko). Le fichier sert aussi au slider « découvrir » (`lib/design.ts`) : il
  affiche désormais le même visuel, rôle inchangé.
- Contact : nouvelle `public/design/contact-banniere.jpg` (`_ARI5298.jpg`,
  percussionnistes sur scène, 1920 px, 829 Ko) ; `slider-decouverte.jpg`
  (utilisée par le slider Togo) n'est pas touchée.
- Crédits retirés des deux bannières (prop `credit` + clés `heroCredit`
  FR/EN/JA des blocs `actusIdx` et `contact`) : le crédit blog décrivait
  l'ancienne photo, celui du contact aussi (« Route de la plage, Lomé »).
- Cache : après écrasement à nom constant, l'optimiseur `/_next/image` sert
  l'ancienne version — recharger avec `ignoreCache` pour contrôler.
- Vérifié : typecheck + lint verts, captures `/fr/actualites` et `/fr/contact`
  (nouvelles photos, sans crédit).
