# 07 — Accueil : cartes du blog et refonte de la FAQ

Fiche de tâche (une tâche = une fiche, cf. AGENTS.md). Périmètre : frontend uniquement.

## 1. Section « 05 — Actualités » : cartes façon « Découvrir le Togo »

Reprendre exactement l'habillage des cartes de `TogoCards` :

- Aplat de couleur en rotation (jaune `bg-sun`, vert `bg-pine`, rouge `bg-blood`),
  défini dans `ACTU_SKINS` (`src/lib/design.ts`), appliqué par index d'article.
- Carte `rounded-[28px] p-3`, image en médaillon `rounded-[20px]` au ratio 4/3,
  soulèvement de la carte au survol (`hover:-translate-y-2`) et zoom de l'image
  (`group-hover:scale-105`).
- Pastille verte « Lire l'article » avec flèche qui glisse au survol, comme le
  « En savoir plus » des cartes Togo.
- Métadonnée mono `01 · Actualité · 2026`, titre display, extrait CMS limité à
  4 lignes (`line-clamp-4`), durée de lecture en bas de carte.
- Article sans visuel : médaillon vert foncé portant l'année en jaune (comportement
  existant conservé).
- En-tête de section : accroche (`actusHome.para`, trois langues) ajoutée à côté du
  bouton « Toutes les actualités ».

## 2. Section « 06 — Questions fréquentes » : disposition de l'inspiration

- En-tête : titre + accroche à gauche (colonne `max-w-[52ch]` pour que le bouton
  tienne sur la même ligne en desktop), bouton vert foncé « Contacter le Comité »
  (icône enveloppe jaune + flèche) à droite, vers `/contact`.
- Champ de recherche pleine largeur (icône loupe, bouton d'effacement), filtrage
  instantané sur catégorie + question + réponse, insensible à la casse et aux accents
  (`normalize('NFD')`). Compteur de résultats (`aria-live`) et état « aucun résultat »
  avec renvoi vers le formulaire de contact.
- Fiches : carte blanche `rounded-[26px]` avec ombre portée, grille
  `numéro | catégorie + question | chevron`. Numéro figé sur l'index d'origine (stable
  pendant la recherche), catégorie en mono rouge, question en display.
- Ouverture : une seule fiche à la fois, animation `grid-template-rows: 0fr → 1fr`
  (500 ms, `cubic-bezier(.16,1,.3,1)`), badge et chevron qui passent en vert/jaune,
  chevron pivoté à 180°.
- Dictionnaire : `faq.items` passe de `[question, réponse]` à `{ cat, q, a }` et gagne
  `para`, `cta`, `searchPh`, `searchAria`, `clear`, `noResult`, `noResultCta`,
  `countOne`, `countMany` — dans les trois langues. `FAQS` (donnée morte dans
  `design.ts`) supprimée.
- Accessibilité : `aria-expanded` / `aria-controls`, panneau replié marqué
  `aria-hidden`, champ de recherche étiqueté, transitions neutralisées en
  `prefers-reduced-motion`.

## Vérification

- `npm run audit` (typecheck + lint + build) vert.
- Accueil FR / EN / JA : cartes jaune-vert-rouge sur les articles du CMS, recherche FAQ
  (« pavillon » → 1 fiche, « evenements » sans accents → 2 fiches, chaîne inconnue →
  état vide), ouverture / fermeture des fiches, aucun débordement horizontal
  de 375 px à 1024 px.
