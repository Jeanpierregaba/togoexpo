# 12 — Page GREEN×EXPO 2027 Yokohama, et suppression de la page Archives

Fiche de tâche (une tâche = une fiche, cf. AGENTS.md). Périmètre : frontend uniquement.

## 1. Plus de page « Archives »

- Route `src/app/[lang]/archives/` supprimée, ainsi que son bloc `archives` du dictionnaire
  (donnée morte) et `editionDetail.crumbArchives`.
- Dans la barre de navigation, l'entrée « Archives » devient un `<button>` : elle n'ouvre
  plus qu'un menu, ce sont ses éléments qui mènent au contenu. L'état actif suit désormais
  les pages `/editions`.
- En mobile, l'entrée devient un simple intitulé de groupe au-dessus de la liste des
  éditions.
- Liens résiduels retargetés sur `/editions`, qui liste déjà les participations passées :
  bouton « Consulter » du menu, fil d'Ariane et bouton de retour des pages d'édition,
  `EditionsExplorer`, `sitemap.ts`, `api/revalidate`.

## 2. Page GREEN×EXPO 2027 Yokohama

Nouvelle route statique `src/app/[lang]/editions/yokohama-2027/page.tsx`, prioritaire sur
le gabarit dynamique `[slug]` ; l'URL servie par le menu déroulant ne change pas.

Contenu et enchaînement des sections repris de la maquette
`https://togo-expo.ai.studio/#yokohama-2027`, rendus avec nos polices et nos couleurs
(Bricolage Grotesque / Instrument Sans / JetBrains Mono, forest / cream / sun / blood) :

1. Bannière `PageHero` (photo du Koutammakou) : fil d'Ariane, pastille, titre sur deux
   lignes, accroche, dates et lieu, deux boutons d'ancre.
2. Bandeau d'identité en trois colonnes (événement / lieu et calendrier / thème
   international) puis carte de compte à rebours vers l'ouverture.
3. `#vision-togo` — « Notre participation » : texte en colonne large, encart « Thème du
   Togo » et sous-thème, photo du baobab en colonne collante.
4. `#cinq-plantes` — « L'herbier du projet » : cinq fiches (baobab, hysope d'Afrique,
   phyllanthus, café, cacao) en grille de trois, badge de catégorie sur l'image.
5. Deux blocs alternés texte / image : « Des racines pour demain. » et « Préserver les
   plantes. Transmettre les savoirs. »
6. « Les trois piliers » sur fond `mist` : préserver, valoriser, transmettre.
7. « L'espace du pavillon » : texte, trois points numérotés, plan conceptuel en
   `object-contain` (c'est un document, pas une photo) avec sa légende.
8. « Documentation & contenus » : trois fiches marquées « Ressources à venir ».
9. « Communiqués & journal » : encart d'attente.
10. « Photographies & conception » : galerie filtrable (tout / patrimoine naturel /
    visuels de conception), `YokohamaGallery` (client).
11. « Engagement durable » : bandeau vert centré, deux boutons vers `/togo` et `/contact`.

- `CountdownPanel` gagne une variante `light` (carte claire) ; la variante `dark` de la
  section « Rendez-vous » est inchangée.
- `src/lib/yokohama.ts` : chemins des visuels, ordre des plantes, composition de la
  galerie et date d'ouverture (`2027-03-19`). Les libellés restent au dictionnaire.
- Visuels récupérés depuis la maquette (accord explicite de l'auteur du projet) et rangés
  dans `public/design/yokohama/` : baobab, hysope, phyllanthus, café, cacao, Koutammakou,
  plan conceptuel du pavillon.
- Bloc `yokohama` ajouté au dictionnaire dans les trois langues.

### Écarts assumés

- La maquette anime la bannière en diaporama de trois photos : la bannière reprend ici le
  gabarit `PageHero` commun aux autres pages internes (fiche 11), avec une seule image.
- « Découvrir la fiche », sous chaque plante, reste un libellé et non un lien : il n'existe
  pas de page par plante, et les liens morts sont proscrits (AGENTS.md).

## Vérification

- `npm run audit` (typecheck + lint + build) vert.
- `/fr|/en|/ja/editions/yokohama-2027` : onze sections dans l'ordre de la maquette,
  compte à rebours actif, filtres de galerie (6 / 5 / 1), aucun débordement horizontal
  de 375 px à 1440 px.
- `/fr|/en|/ja/archives` en 404 ; entrée « Archives » rendue en `<button>` sans `href` ;
  menu déroulant intact, « GREEN×EXPO 2027 — Yokohama » vers `/editions/yokohama-2027`.
