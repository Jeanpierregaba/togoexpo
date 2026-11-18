# 28 — Yokohama : logotype et herbier en panneaux

Page : `/[lang]/editions/yokohama-2027`. Fichiers : `page.tsx` de la page,
`src/components/YokohamaPlate.tsx`, `src/lib/yokohama.ts`, `src/i18n/dict.ts`,
`public/design/yokohama/logo-togo-expo-yokohama.webp`.

## Demande
1. « Notre participation » : retirer le filet sous le titre.
2. Après cette section, une section qui met en valeur le logotype du Togo pour
   cette exposition, comme sur la page de Belgrade.
3. « L'herbier du projet » : nouveau design, plus moderne, immersif et animé.
   Plus de texte (message clé) par plante : le détail aura sa propre section.

## Réalisation
- **Logotype** (`#logotype`, fond blanc — la version couleur est faite pour les
  fonds clairs). Texte à gauche, planche à droite ; sous la planche, quatre
  légendes reliées par un trait à chacune des lettres de « TOGO ».
  Les légendes (eau, pousse, terre, planète) sont une **lecture du visuel**, à
  remplacer par l'explication officielle de la charte quand elle sera fournie.
- **Herbier** (`#cinq-plantes`, fond vert). Cinq panneaux photo côte à côte ; le
  panneau ouvert prend la place, les autres deviennent des lisières avec le nom
  à la verticale. Ouverture au survol, au focus, au clic ; flèches, Début, Fin
  au clavier. Défilement automatique (5,2 s, trait jaune de pose) tant que
  personne n'y touche et que la section est à l'écran ; il s'arrête au premier
  geste. Mobile : panneaux empilés, ouverture en hauteur.
- `claim` et `para` des plantes restent au dictionnaire pour la future section
  de détail ; ils ne sont plus affichés ici.
- `prefers-reduced-motion` : ni défilement automatique ni zoom.

## Vérification
`npm run audit` ; contrôle navigateur à 1440 px et en mobile.

## Complément — « Les plantes, gardiennes de nos savoirs »
- Retirés : la mention « Survolez ou touchez un panneau pour l'ouvrir » sous
  l'herbier ; la section « Le stand du Togo » (chiffres + plan) — composant
  `YokohamaStand` retiré, clés `stand*` supprimées ; les mini-sections
  « Plante emblématique » et « Savoirs vivants » (clés `roots*`, `know*`).
- Nouvelle section `#savoirs`, juste après l'herbier : titre, description, puis
  trois planches alternées (baobab, hysope d'Afrique, phyllanthus) — photo,
  catégorie, nom, accroche, deux paragraphes, bouton « Télécharger la
  plaquette ». Contenus FR fournis ; EN et JA traduits.
- Plaquettes : `YOKOHAMA_BROCHURES` dans `src/lib/yokohama.ts`. Tant qu'un
  chemin vaut `null`, le bouton est affiché inactif avec « bientôt
  disponible » (pas de lien `#`). Déposer les PDF dans `public/documents/` et
  renseigner les chemins.
- Le bouton « Découvrir notre vision » de la bannière pointe désormais vers
  `#vision-togo` (l'ancre `#pavillon` n'existe plus).

## Complément — boutons, coins, « Les cultures, richesses de nos terres »
- Bouton « Télécharger la plaquette » redessiné (`DownloadButton` dans la page) :
  pastille verte, flèche dans un disque jaune, mention PDF. Sans fichier, même
  dessin, `aria-disabled`, pas de lien ; plus de mention « bientôt disponible ».
- Coins décoratifs des photos en jaune (`border-sun`).
- Nouvelle section `#cultures` après `#savoirs` : titre, description, six
  chiffres clés en bandeau vert (montée des chiffres), puis café et cacao —
  photo collante, accroche, deux chiffres, deux paragraphes, invitation au
  pavillon encadrée de jaune.
- Les astérisques (* / **) du texte fourni renvoient à des sources non
  communiquées : non affichées tant que les sources ne sont pas fournies.
