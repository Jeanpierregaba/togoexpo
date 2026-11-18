# 15 — Hero épuré, pastilles sans numéro et accents de titre

Fiche de tâche (une tâche = une fiche, cf. AGENTS.md). Périmètre : frontend uniquement.

## 1. Bannière d'accueil

- Flèches précédent / suivant et bouton lecture-pause retirés : seules les pastilles
  pilotent encore le diaporama. Les quatre libellés devenus inutiles (`pauseAria`,
  `playAria`, `prevAria`, `nextAria`) sortent du dictionnaire dans les trois langues.
  Les commandes de la carte « Rendez-vous » (`UpcomingEvents`), elles, sont conservées.
- Défilement automatique porté de 5 s à **3 s** (`AUTOPLAY_MS`).
- Correction d'un blocage au toucher : la pause au survol passe de `onMouseEnter` /
  `onMouseLeave` à `onPointerEnter` / `onPointerLeave` filtrés sur `pointerType === 'mouse'`.
  Sur mobile, un `mouseenter` synthétique au toucher n'était jamais suivi d'un
  `mouseleave` et figeait le diaporama définitivement.

Le diaporama et les bandeaux défilants restent coupés quand le système demande
`prefers-reduced-motion` : c'est ce réglage, activé sur le téléphone, qui expliquait leur
immobilité en mobile.

## 2. Pastilles de section

- `src/components/SectionKicker.tsx` : trait horizontal puis nom de la section.
  **Rouge sur fond clair, jaune sur fond vert** (prop `tone`).
- Les sections ne sont plus numérotées : le `●` et le préfixe `NN — ` sont retirés des
  120 pastilles du dictionnaire, dans les trois langues.
- Les 30 points d'affichage du site passent par le composant, y compris la pastille du
  formulaire de contact et celle de la section Communauté.

## 3. Accent de titre

- `AccentTitle` met en avant un mot ou un groupe de mots dans le titre de section :
  **jaune sur fond clair, rouge sur fond vert**.
- Titres déjà en deux lignes : la seconde ligne porte l'accent. Titres d'un seul tenant :
  une clé `…Accent` au dictionnaire désigne le fragment à colorer, dans les trois langues.
  Si le fragment n'est pas trouvé (traduction remaniée), le titre s'affiche tel quel.
- Règle appliquée aux **titres de section** (`h2`/`h3`) de toutes les pages : accueil,
  Togo, Yokohama, Belgrade, et le « À lire aussi » des pages d'article.
- **Les titres de page (`h1`) restent unis**, en blanc : l'accent de couleur ne les touche
  pas. Cela vaut pour les bannières comme pour les pages au gabarit d'origine.
- **Exception demandée** : le titre de la section « Communauté officielle » reste lui aussi
  entièrement blanc, alors que sa pastille suit la règle (jaune sur fond vert).
- Les pages `/editions`, `/mentions-legales` et la page 404 sont encore au gabarit
  d'origine (texte sombre sur le fond vert du corps de page) : leur pastille suit la règle,
  mais ces trois pages méritent une refonte à part entière.

### Point de vigilance

Le jaune `#FFCE00` sur le fond crème `#F3F1EA` donne un contraste de **1,3:1**, là où
WCAG demande 3:1 pour un grand texte. Le choix a été retenu en connaissance de cause ;
les mots accentués sont volontairement très pâles sur les sections claires. Le rouge sur
fond vert, lui, passe (3,4:1).

## Vérification

- `npm run audit` (typecheck + lint + build) vert.
- Accueil : 3 boutons dans la bannière (les pastilles), intervalle mesuré à **3 012 ms**,
  8 pastilles au nouveau format sans numérotation, accent présent sur les 8 titres de
  section avec la bonne couleur selon le fond.
- `/togo`, `/actualites`, `/contact`, `/mediatheque`, `/editions/yokohama-2027`,
  `/editions/belgrade-2027` : plus aucune puce `●` ni numéro de section.
