# 35 — Page À propos (TogoExpo + Comité)

## Demande
Remplacer la page du Comité par une page « À propos » : d'abord TogoExpo (contenu fourni par le client), puis le contenu du Comité existant. Ajouter la page à la navbar.

## Route
- Nouvelle route `src/app/[lang]/a-propos/page.tsx` ; `src/app/[lang]/comite/` supprimé.
- `middleware.ts` : `/comite` → `/a-propos` en 308 (liens entrants préservés).
- Liens mis à jour : `Mission.tsx` et slide « TOGO EXPO » (`lib/design.ts`) → `/a-propos#comite` ; `sitemap.ts`.

## Structure de la page
1. Bannière (`PageHero`, `hero-togo-expo.jpg`) : « TogoExpo, la vitrine des participations internationales du Togo. » + présentation.
2. `#mission` (blanc) : vocation en grand chapeau, puis photo de parade + « Notre mission — Faire rayonner le Togo au-delà de ses frontières ».
3. `#ambitions` (beige) : 5 cartes numérotées (Informer, Valoriser, Partager, Préserver, Connecter) reprenant les 5 ambitions fournies.
4. `#vision` (blanc) : « Une fenêtre ouverte sur le monde » + photo, bouton vers les archives.
5. `#comite` : bannière photo (voile neutre) « Le Comité National Permanent », chapeau et chiffres clés.
6. `#composition` et `#missions` : reprise à l'identique de l'ancienne page Comité.

## Données
- `dict.ts` : nouveau bloc `about` (FR/EN/JA), entrée `nav` « À propos / About / 概要 » en 2e position. Le bloc `comite` est conservé tel quel.
- Titres éditoriaux ajoutés (à valider) : « Cinq ambitions, une même vitrine. », sur-titre « Notre vision » ; libellés courts des ambitions (verbes).

## Navbar
- 6 entrées : liens `whitespace-nowrap`, padding `px-3` sous 1280 px (`xl:px-4`) pour tenir sur une ligne dès 960 px, y compris en japonais.

## Vérif
- `npm run audit` ; `/fr/comite` redirige vers `/fr/a-propos` ; FR/EN/JA rendus ; 375 px sans débordement ; navbar sur une ligne à 960 px (FR, JA).

## Complément — refonte du design (partie TogoExpo)
- Bannière plein écran, titre agrandi, raccourcis vers les chapitres (Notre mission, Nos ambitions, Notre vision, Le Comité) en pastilles translucides.
- `#togoexpo` : vocation en grand chapeau + 3 chiffres animés (`CountUp`) calculés depuis `PARTICIPATIONS` (nombre total, première année, nombre en préparation) — pas de chiffres saisis à la main.
- `#mission` : photo encadrée de deux coins jaunes (zoom léger au survol), texte avec filet jaune à gauche.
- `#ambitions` : index éditorial (numéro rouge, verbe en grand, phrase à droite), ligne blanche + barre jaune au survol.
- `#vision` : collage de deux photos (danse + public aux drapeaux, Osaka 2025), coin jaune, bouton vers les archives.
- Dict : `about.jumpAria`, `jumpComite`, `stats{total,first,prep}`, `windowAlt2` (FR/EN/JA).

## Complément 2 — bannière
- Visuel de fond : photo de l'entrée du pavillon « Republic of Togo » (`public/design/about-pavillon-togo.jpg`, fournie par le client).
- Titre : « Togo Expo, la vitrine des participations togolaises à l'international. » ; « Togo Expo » et « participations togolaises » en jaune (`about.heroAccents`, rendu par `highlight()`), idem EN/JA.
- Les 4 raccourcis sont remplacés par 2 boutons : « Nos prochains rendez-vous » (`/#rendez-vous`, jaune → blanc/rouge au survol) et « Nous contacter » (`/contact`, contour clair).

## Complément 3 — « Togo Expo » en deux mots, nouvelle section vocation
- Textes de la page (bloc `about`, FR/EN/JA, y compris les metas) : « TogoExpo » → « Togo Expo ». Titre d'onglet aligné sur le nouveau titre.
- `#togoexpo` redessinée : photo des panneaux du pavillon (Osaka 2025) avec pastille jaune « Togo Expo » à gauche ; à droite, la vocation en grand avec trois idées surlignées au marqueur jaune (`about.introAccents`, `MARKER`). En dessous, bandeau vert : 3 chiffres animés en jaune + case « Parcourir les archives » (fond jaune au survol).
- `#mission` passe en texte à gauche / photo à droite pour alterner avec la section précédente.

## Complément 4 — vocation
- Paragraphe : « Togo Expo a pour vocation de… » (EN « Togo Expo’s purpose is… », JA « Togo Expo は… ») ; sur-titre « Notre vocation » conservé.
- Photo de gauche remplacée par la parade derrière la pancarte « TOGO » (`public/design/about-parade-togo.jpg`, fournie par le client), cadrage centré sur la pancarte ; pastille « Togo Expo » sous l'image supprimée.

## Complément 5 — photo Mission, ambitions en grille
- `#mission` : photo du public aux drapeaux (`public/design/about-public-drapeaux.jpg`, fournie par le client). Pour éviter le doublon, la petite photo du collage « Vision » devient la parade (`hero-parade-osaka.jpg`) ; textes alternatifs `missionAlt` / `windowAlt2` permutés.
- `#ambitions` : grille 3 colonnes — le titre occupe la 1re case, puis 5 cartes (icône SVG, grand numéro en filigrane, verbe, phrase). Survol : carte verte, icône sur fond jaune, verbe en jaune. Liste `<ol className="contents">` pour garder 5 éléments de liste.

## Complément 6 — photos « Vision »
- Collage `#vision` : grande photo = personnalités et public aux drapeaux (`about-vision-ceremonie.jpg`), médaillon = joueur de kora (`about-vision-kora.jpg`), toutes deux fournies par le client ; textes alternatifs `windowAlt` / `windowAlt2` mis à jour (FR/EN/JA).

## Complément 7 — Comité
- Bannière « Rayonnement & diplomatie » : voile allégé (dégradé gauche → droite `black/60 → transparent` + léger dégradé bas), ombre portée douce sur le texte.
- `#composition` redessinée : en-tête titre / chapeau (filet jaune) ; 3 cartes ministères (pictogramme, « Ministère 0X », directions rattachées en liste, barre jaune au survol) ; 5 tuiles « Organismes membres » numérotées ; la présidence en bandeau vert avec pastille jaune. Dict : `comite.ministryLabel` (FR/EN/JA).

## Complément 8 — section BIE
- Nouvelle section `#bie` après `#composition` (fond blanc, avant les missions sur fond vert) : sur-titre « Le cadre international », titre « Le Bureau international des expositions. », définition en grand (nom du BIE en gras rouge via `highlight`), encart « La Convention » (pictogramme document), lien « Site officiel du BIE ↗ » (https://www.bie-paris.org/). Contenu client ; EN/JA traduits. Dict : `comite.bie*`.
