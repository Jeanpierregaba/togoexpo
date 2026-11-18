// Visuels de la participation du Togo à Expo 2027 Belgrade.
// Les libellés vivent dans le dictionnaire (`belgrade`), seuls les chemins sont ici.

export const BELGRADE_IMG = {
  evala: '/design/belgrade/evala.jpg',
  danse: '/design/belgrade/danse.jpg',
  jeux: '/design/belgrade/jeux.jpg',
  artisanat: '/design/belgrade/artisanat.jpg',
  jeunesse: '/design/belgrade/jeunesse.jpg',
  maquette: '/design/belgrade/maquette.jpg',
  concept: '/design/belgrade/belgrade.jpg',
  mascotte: '/design/mascotte-togo.jpg',
  /** Mascotte en pied de page de la section d'accueil, avec sa bulle. */
  accueil: '/design/belgrade/accueil.jpg',
  /** Portrait de la section d'accueil, cadré en rond comme une photo de profil. */
  accueilPortrait: '/design/belgrade/accueil-portrait.jpg',
  /** Le danseur togolais et les deux mascottes de Belgrade, détourés. */
  mascottesDuo: '/design/belgrade/mascottes-duo.webp',
  /** Logo de la participation togolaise, blanc sur fond transparent. */
  logoExpoTogo: '/design/belgrade/logo-expo-togo.webp',
  /** Logotype officiel en couleurs. La charte le réserve aux fonds blancs et
   *  clairs : il est donc toujours posé sur une plaque blanche. */
  logoCouleur: '/design/belgrade/logo-togo-expo-couleur.png',
  /** Partie d'Ampé dans une cour : fond fixe de la section « Jeux ». */
  jeuxAmpe: '/design/belgrade/jeux-ampe.jpg',
  /** Lutteurs en pleine arène : fond fixe de la section « Cœur du pavillon ». */
  coeurLutte: '/design/belgrade/coeur-lutte.webp',
} as const;

/** Les cinq danses, face avant : Agbadza, Bobobo, Takaï, Tchimou, Talkoutk. */
export const BELGRADE_RHYTHM_IMAGES = [
  '/design/belgrade/danse-agbadza.jpg',
  '/design/belgrade/danse-bobobo.jpg',
  '/design/belgrade/danse-takai.jpg',
  '/design/belgrade/danse-tchimou.jpg',
  '/design/belgrade/danse-talkoutk.jpg',
] as const;

/**
 * Les cinq danses, face arrière.
 *
 * TODO agent : il manque cinq secondes photos de ces danses. En attendant, la face
 * arrière réutilise la photo de la face avant avec un cadrage différent
 * (`object-cover` + `scale`), à remplacer dès que les visuels sont fournis.
 */
export const BELGRADE_RHYTHM_IMAGES_BACK = [
  '/design/belgrade/danse-agbadza.jpg',
  '/design/belgrade/danse-bobobo.jpg',
  '/design/belgrade/danse-takai.jpg',
  '/design/belgrade/danse-tchimou.jpg',
  '/design/belgrade/danse-talkoutk.jpg',
] as const;

/** Ouverture officielle d'Expo 2027 Belgrade (compte à rebours). */
export const BELGRADE_OPENING = '2027-05-15T10:00:00+02:00';

/**
 * Fonds photo des quatre tuiles de jeux, dans l'ordre Adito, Ampé, Akonto,
 * Vététré. La position ancre le recadrage `object-cover` sur le sujet.
 *
 * TODO agent: photo dédiée au Vététré. En attendant, la tuile réutilise la
 * partie d'Adito recadrée à droite et miroir (`-scale-x-100`) : on y voit des
 * mains qui placent des graines avec précision, le geste du Vététré.
 */
export const BELGRADE_GAME_IMAGES = [
  { src: '/design/belgrade/jeux.jpg', position: 'object-left' },
  { src: '/design/belgrade/jeux-ampe.jpg', position: 'object-center' },
  { src: '/design/belgrade/jeux-akonto.webp', position: 'object-center' },
  { src: '/design/belgrade/jeux-vetetre.webp', position: 'object-center' },
] as const;

/**
 * Fonds photo des trois tuiles de talents, dans l'ordre fresques, sculpture,
 * lokpo. La position ancre le recadrage `object-cover` sur le sujet.
 */
export const BELGRADE_TALENT_IMAGES = [
  { src: '/design/belgrade/fresque-mosaique.webp', position: 'object-center' },
  { src: '/design/belgrade/sculpture-atelier.webp', position: 'object-center' },
  { src: '/design/belgrade/lokpo-tissage.webp', position: 'object-center' },
] as const;

/**
 * Bannière « statue de Belgrade ». Le visuel fait 1920 × 1080 et porte déjà son
 * ruban de drapeau : il est ancré à droite (`object-right`), la statue étant à
 * 77 % de la largeur, pour qu'elle reste visible sur les écrans en portrait.
 */
export const BELGRADE_STATUE = '/design/belgrade/statue.jpg';

export const BELGRADE_OFFICIAL_URL = 'https://expobelgrade2027.org/en/';

/**
 * Version animée du même plan, jouée en boucle et sans son derrière la
 * bannière : le drapeau ondule, le ciel bouge, le cadrage ne change pas.
 * L'image `BELGRADE_STATUE` reste dessous — elle sert d'affiche avant le
 * chargement et prend seule le relais sous `prefers-reduced-motion`.
 */
export const BELGRADE_STATUE_VIDEO = '/videos/belgrade-banniere.mp4';

/**
 * Documents officiels proposés au téléchargement dans la section « Médias &
 * presse ». L'ordre suit `dict.belgrade.pressDocs`.
 *
 * `href` vaut `null` tant que le fichier n'a pas été fourni : la ligne est
 * alors affichée mais inerte, avec sa mention « bientôt disponible ». Aucun
 * lien mort n'est publié.
 *
 * TODO agent: déposer les PDF sous `public/documents/` et renseigner `href`.
 */
export const BELGRADE_PRESS_DOCS: { href: string | null; weight: string | null }[] = [
  { href: null, weight: null },
  { href: null, weight: null },
];
