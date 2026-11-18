# 08 — Section « Communauté officielle » et refonte du pied de page

Fiche de tâche (une tâche = une fiche, cf. AGENTS.md). Périmètre : frontend uniquement.

## 1. Nouvelle section « Communauté officielle »

Le bloc réseaux sociaux quitte le pied de page et devient une section autonome,
rendue dans `src/app/[lang]/layout.tsx` juste avant `<SiteFooter>` : elle apparaît donc
sur toutes les pages, comme auparavant.

- `src/components/Community.tsx` (composant serveur) : pastille + titre + accroche à
  gauche, les 6 cercles de réseaux à droite (`lg:grid-cols-[5fr_7fr]`) — Facebook,
  Instagram, LinkedIn, Flickr, YouTube et TikTok.
- Grille des réseaux : trois par ligne, six d'un trait à partir de `xl`, en colonnes de
  largeur égale (`min-w-0`, sans `justify-items-end` : aligner les entrées à droite de leur
  colonne rendait les écarts inégaux puisqu'elles n'ont pas la même largeur).
- Colonnes de la section en `4fr / 8fr` : les six identifiants ont la place de tenir sans
  être coupés en plein mot.
- Pleine largeur d'écran, photo en fond (`/design/communaute-danse.jpg`) et voile
  dégradé noir (75 % → 60 % → 80 %) par-dessus pour la lisibilité.
- Effet « image figée » : `background-attachment: fixed` (`bg-fixed` + `bg-cover`).
  Le fond est accroché au cadre d'affichage, seule la section glisse par-dessus.
  Sur iOS, où l'attachement fixe n'est pas appliqué, l'image défile simplement avec
  la section — dégradation acceptable, aucun JS de parallaxe.
- Libellés déplacés du bloc `footer` vers un bloc `community` du dictionnaire
  (`kicker`, `title`, `para`) dans les trois langues.
- Les identifiants sociaux longs passent en `break-words` : ils se coupent au lieu de
  déborder sur la colonne voisine.

## 2. Pied de page : le CTA partenaire remplace les réseaux

- `PartnerCta.tsx` supprimé et retiré de la page d'accueil ; son contenu (titre
  « Portez les couleurs… », paragraphe, carte lettre d'information)
  est repris dans `SiteFooter.tsx`, **sans** le panneau vert arrondi : il se pose
  directement sur le fond vert du pied de page, qui reste donc uniforme.
- La carte newsletter est conservée, en liseré blanc translucide (`bg-white/[0.04]`).
- Pas de boutons : seuls le titre, le paragraphe et la carte newsletter restent.
  Le titre est en jaune et réduit de 20 % (`clamp(26px,3.2vw,40px)`).
- Le pied de page enchaîne directement sur la section Communauté : la bande blanche de
  100 px a été retirée.
- Le logotype géant « TOGO EXPO » passe en filigrane (`text-cream/25`).
- L'ancre `#partenaire` est portée par ce bloc.
- Barres tricolores, logotype géant « TOGO EXPO » et barre légale inchangés.
- Le CTA partenaire, auparavant limité à l'accueil, est désormais visible sur toutes
  les pages puisqu'il vit dans le pied de page.

## Vérification

- `npm run audit` (typecheck + lint + build) vert.
- Accueil et pages internes, trois langues : section pleine largeur avant le pied de
  page, fond immobile au défilement (le cadrage visible de l'image change selon la
  position de la section, preuve que le fond n'est pas accroché à l'élément),
  pied de page vert avec CTA + newsletter, aucun débordement horizontal
  de 375 px à 1024 px.
