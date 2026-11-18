// Données statiques issues du dossier "Refonte TogoExpo" (TogoExpo.dc.html).
// Le contenu éditorial (éditions, actus) vient du CMS ; les libellés vitrine restent ici.

// Navigation : voir `nav` dans src/i18n/dict.ts (libellés traduits).

export type Slide = {
  id: string;
  title: [string, string];
  para: string;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
  countdown?: { label: string; target: string };
  image: string;
  imageAlt: string;
  variant?: 'brand';
};

export const SLIDES: Slide[] = [
  {
    id: 'togo-expo',
    variant: 'brand',
    title: ['TOGO', 'EXPO'],
    para: 'Être une plateforme avant-gardiste en matière d’exposition, salon et foire ; l’écosystème Togo Expo a été mise en œuvre.',
    cta1: { label: 'En savoir plus', href: '/a-propos' },
    cta2: { label: 'Le Comité', href: '/a-propos#comite' },
    image: '/design/hero-togo-expo.jpg',
    imageAlt: 'Danseurs et jeunes portant les drapeaux du Togo et du Japon devant l’écran Woezon',
  },
  {
    id: 'decouverte',
    title: ['Le Togo.', 'Toute une richesse à découvrir.'],
    para: 'Une terre de cultures, de talents et de rencontres. Découvrez le Togo, à la rencontre du monde.',
    cta1: { label: 'Explorer le Togo', href: '/togo' },
    cta2: { label: 'Voir le calendrier', href: '/#rendez-vous' },
    countdown: { label: 'Yokohama 2027', target: '2027-03-19T10:00:00+09:00' },
    image: '/design/hero-colombe-paix.webp',
    imageAlt: 'Le monument de la Paix et sa colombe, au crépuscule sur Lomé',
  },
  {
    id: 'savoir-faire',
    title: ['Le Togo,', 'une richesse qui se révèle.'],
    para: 'A travers ses produits, ses créations et ses initiatives, le Togo partage avec le monde l’energie de ses talents.',
    cta1: { label: 'Investir au Togo', href: '/togo#investir' },
    cta2: { label: 'Voir le calendrier', href: '/#rendez-vous' },
    countdown: { label: 'Belgrade 2027', target: '2027-05-15T10:00:00+02:00' },
    image: '/design/hero-port-lome.jpg',
    imageAlt: 'Terminal à conteneurs du port autonome de Lomé au crépuscule',
  },
  {
    id: 'rencontres',
    title: ['Le Togo se découvre.', 'Et se garde en mémoire.'],
    para: 'D’une exposition à l’autre, le Togo fait voyager ses cultures, ses ambitions, et ses savoir-faire.',
    cta1: { label: 'Nos prochains rendez-vous', href: '/#rendez-vous' },
    cta2: { label: 'Voir le calendrier', href: '/#rendez-vous' },
    countdown: { label: 'Riyad 2030', target: '2030-10-01T10:00:00+03:00' },
    image: '/design/hero-parade-osaka.jpg',
    imageAlt: 'Parade togolaise dans l’anneau de bois de l’Expo 2025 Osaka',
  },
];

// Prochain rendez-vous mis en avant (design + JSON-LD du dossier).
export const NEXT_EVENT = {
  name: 'Expo 2027 Belgrade',
  place: 'Belgrade, Serbie',
  start: '2027-05-15T10:00:00+02:00',
  end: '2027-08-15T00:00:00+02:00',
};

export const MARQUEE_CITIES = ['Yokohama 2027', 'Belgrade 2027', 'Riyad 2030'];

// Métadonnées vitrine des rendez-vous à venir (types + noms officiels).
export const EVENT_META: Record<string, { type: string; name: string }> = {
  'yokohama-2027': { type: 'Exposition horticole internationale', name: 'GREEN×EXPO 2027 — Yokohama' },
  'belgrade-2027': { type: 'Exposition spécialisée', name: 'Expo 2027 — Belgrade' },
};

// Détails vitrine par édition (complètent les champs CMS). Clé = slug WP.
export const EDITION_DETAILS: Record<
  string,
  { dates: string; togo: string; theme: string; image: string | null; imageAlt: string }
> = {
  'osaka-2025': {
    dates: '13 avril — 13 octobre 2025',
    togo: "Politique d'inclusion et de protection sociale pour une croissance économique forte au Togo",
    theme: 'Concevoir la société du futur, imaginer notre vie de demain',
    image: '/design/ed-osaka.jpg',
    imageAlt: 'Pavillon du Togo — Osaka 2025',
  },
  'dubai-2021': {
    dates: '1er octobre 2021 — 31 mars 2022',
    togo: 'Connecter les esprits, construire le futur',
    theme: 'Connecter les esprits, construire le futur',
    image: '/design/ed-dubai.webp',
    imageAlt: 'Pavillon du Togo — Dubaï 2020',
  },
  'milan-2015': {
    dates: '1er mai — 31 octobre 2015',
    togo: 'Nourrir la planète, énergie pour la vie',
    theme: 'Nourrir la planète, énergie pour la vie',
    image: '/design/ed-milan.jpg',
    imageAlt: 'Arbre de vie — Expo Milano 2015',
  },
  'shanghai-2010': {
    dates: '1er mai — 31 octobre 2010',
    togo: 'Une ville meilleure, une vie meilleure',
    theme: 'Meilleure ville, meilleure vie',
    image: '/design/ed-shanghai.jpg',
    imageAlt: 'Pavillon de la Chine — Expo Shanghai 2010',
  },
  'hanovre-2000': {
    dates: '1er juin — 31 octobre 2000',
    togo: 'Homme, Nature, Technologie',
    theme: 'Homme, Nature, Technologie',
    image: '/design/ed-hanovre.jpg',
    imageAlt: 'Site de l’Expo 2000 — Hanovre',
  },
};

// Crédits photo des visuels d’archives (Wikimedia Commons).
export const EDITION_CREDITS: Record<string, string> = {
  'milan-2015': 'Costantino Beretta, Wikimedia Commons (CC BY 3.0)',
  'shanghai-2010': 'Gary Lee Todd, Wikimedia Commons (CC0)',
  'hanovre-2000': 'J.-H. Janßen, Wikimedia Commons (CC BY-SA 3.0)',
};

export const PILLARS = [
  {
    n: '01',
    t: 'Un pays engagé sur la scène mondiale',
    d: 'Le Togo s’affirme comme un acteur clé de la communauté internationale, toujours présent aux grands rendez-vous mondiaux.',
  },
  {
    n: '02',
    t: 'L’innovation togolaise à l’honneur',
    d: 'Faire connaître au monde l’ingéniosité togolaise à travers des inventions et des réalisations marquantes.',
  },
  {
    n: '03',
    t: 'Un tremplin pour les opportunités',
    d: 'Profiter des expositions pour promouvoir les investissements et valoriser la richesse culturelle du Togo.',
  },
];

// Chaque onglet de « Découvrir le Togo » porte son propre diaporama de 3 photos.
export const TOGO_CARDS = [
  {
    n: '01 · Culture',
    title: 'Un patrimoine vivant',
    text: 'Le Koutammakou, pays des Batammariba, est inscrit au patrimoine mondial de l’UNESCO. Fêtes traditionnelles, tissage, sculpture et musiques rythment les 5 régions du pays.',
    images: ['/design/togo/culture/1.jpg', '/design/togo/culture/2.jpg', '/design/togo/culture/3.jpg'],
    linkLabel: 'Explorer la culture togolaise',
    href: '/togo#culture',
    bg: 'bg-sun text-forest',
    sub: 'text-[#2B2A1A]',
    dot: 'bg-sun',
  },
  {
    n: '02 · Tourisme',
    title: 'Du littoral aux plateaux',
    text: 'Les plages de Lomé, le lac Togo et Togoville, les cascades et forêts de Kpalimé, le mont Agou : un pays compact, à parcourir du sud au nord en quelques jours.',
    images: ['/design/togo/tourisme/1.jpg', '/design/togo/tourisme/2.jpg', '/design/togo/tourisme/3.jpg'],
    linkLabel: 'Préparer son séjour',
    href: '/togo#tourisme',
    bg: 'bg-pine text-cream',
    sub: 'text-mist',
    dot: 'bg-pine',
  },
  {
    n: '03 · Économie',
    title: 'Un hub logistique ouest-africain',
    text: 'Port en eau profonde de Lomé, Plateforme Industrielle d’Adétikopé, guichet unique du CFE : les points d’entrée pour investir et produire au Togo.',
    images: ['/design/togo/economie/1.jpg', '/design/togo/economie/2.jpg', '/design/togo/economie/3.jpg'],
    linkLabel: 'Investir avec Togo Invest',
    href: 'https://togoinvest.tg/',
    bg: 'bg-blood text-cream',
    sub: 'text-mist',
    dot: 'bg-blood',
  },
];

// Habillages des cartes « Actualités » : même palette que les cartes Togo
// (jaune, vert, rouge), appliquée en rotation sur les articles venus du CMS.
export const ACTU_SKINS = [
  { bg: 'bg-sun text-forest', sub: 'text-[#2B2A1A]' },
  { bg: 'bg-pine text-cream', sub: 'text-mist' },
  { bg: 'bg-blood text-cream', sub: 'text-mist' },
];

// Mosaïque de la galerie d'accueil (style Pinterest).
// `ar` = ratio d'affichage de la tuile (recadrage object-cover), choisi pour
// alterner portraits et paysages dans les colonnes.
// Libellés (tag + légende) : voir `mediaWall.tiles` dans src/i18n/dict.ts.
export type GalleryTile = { src: string; ar: string };

export const MEDIA_GALLERY: GalleryTile[] = [
  { src: '/design/hero-parade-osaka.jpg', ar: '4/5' },
  { src: '/design/ed-osaka.jpg', ar: '1/1' },
  { src: '/design/slider-decouverte.jpg', ar: '3/4' },
  { src: '/design/tile-4.jpg', ar: '4/3' },
  { src: '/design/comite.webp', ar: '3/2' },
  { src: '/design/tile-5.jpg', ar: '4/5' },
  { src: '/design/tile-6.jpg', ar: '4/3' },
  { src: '/design/ed-dubai.webp', ar: '3/2' },
  { src: '/design/tile-3.jpg', ar: '1/1' },
  { src: '/design/tourisme-plateaux.png', ar: '4/5' },
  { src: '/design/tile-7.jpg', ar: '3/2' },
  { src: '/design/ed-shanghai.jpg', ar: '4/3' },
  { src: '/design/ed-milan.jpg', ar: '3/2' },
  { src: '/design/ed-hanovre.jpg', ar: '4/5' },
  { src: '/design/slider-horizons.jpg', ar: '3/2' },
  { src: '/design/hero-expose.jpg', ar: '4/3' },
  { src: '/design/news-banniere.jpg', ar: '5/4' },
  { src: '/design/city-yokohama.jpg', ar: '4/3' },
  { src: '/design/city-belgrade.jpg', ar: '4/5' },
];

// Menu déroulant « Archives » : construit par langue dans src/components/SiteHeader.tsx.

export const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/TogoExpoOfficiel/' },
  { label: 'Instagram', href: 'https://www.instagram.com/togoexpoofficiel/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/106336470/' },
  { label: 'Flickr', href: 'https://www.flickr.com/photos/190367340@N06/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@togoexpoofficiel7522' },
];

export const USEFUL_LINKS = [
  { label: 'Portail pays', href: 'https://togo.gouv.tg/' },
  { label: 'Ministère du Commerce', href: 'https://commerce.gouv.tg/' },
  { label: 'Togo Invest', href: 'https://togoinvest.tg/' },
  { label: 'CETEF', href: 'https://cetef.tg/' },
  { label: 'CCIT', href: 'https://www.ccit.tg/' },
  { label: 'PIA', href: 'https://pia-togo.com/fr/' },
  { label: 'CFE', href: 'https://cfetogo.tg/' },
];
