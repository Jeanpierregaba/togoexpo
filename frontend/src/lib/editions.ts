export type Edition = {
  annee: number;
  ville: string;
  pays: string;
  theme: string;
  slug: string;
};

export type FuturEdition = {
  ville: string;
  pays: string;
  annee: number;
  theme: string;
  dateDebut?: string;
  dateFin: string;
};

export type ActuItem = {
  slug: string;
  title: string;
};

// Fallback hors-ligne aligné sur le dossier refonte : Expo 2027 Belgrade.
export const MOCK_FUTUR: FuturEdition = {
  ville: 'Belgrade',
  pays: 'Serbie',
  annee: 2027,
  theme: 'Jouer pour l’humanité : le sport et la musique pour tous',
  dateDebut: '2027-05-15T10:00:00+02:00',
  dateFin: '2027-08-15T00:00:00+02:00',
};

// TODO agent: brancher WP — fallback hors-ligne des prochains rendez-vous (CMS injoignable, ex. preview Vercel).
export const MOCK_UPCOMING: EditionDetail[] = [
  {
    annee: 2027, ville: 'Yokohama', pays: 'Japon', theme: 'Scenery of the Future for Happiness',
    slug: 'yokohama-2027', dateDebut: '2027-03-19T10:00:00+09:00', dateFin: '2027-09-26T00:00:00+09:00',
    pavillon: 'Le Togo participe à GREEN×EXPO 2027, exposition horticole internationale : nature, agriculture durable et innovations vertes autour du thème « Scenery of the Future for Happiness ».',
    image: { src: '/design/event-yokohama-2027-mascot.jpg', alt: 'Mascotte cœur entourée d’un globe fleuri et du ruban togolais' },
  },
  {
    annee: 2027, ville: 'Belgrade', pays: 'Serbie', theme: 'Jouer pour l’humanité — le sport et la musique pour tous',
    slug: 'belgrade-2027', dateDebut: '2027-05-15T10:00:00+02:00', dateFin: '2027-08-15T00:00:00+02:00',
    pavillon: 'Le Togo participe à l’exposition spécialisée Expo 2027 Belgrade : jeunesse, sport, musique et culture autour du thème « Jouer pour l’humanité ».',
    image: { src: '/design/event-belgrade-2027-dance.jpg', alt: 'Danseur togolais et deux enfants en cape sur un fond graphique' },
  },
];

// TODO agent: brancher WP — rendez-vous mock EN/JA (CMS injoignable, ex. preview Vercel).
export const MOCK_UPCOMING_EN: EditionDetail[] = [
  {
    annee: 2027, ville: 'Yokohama', pays: 'Japan', theme: 'Scenery of the Future for Happiness',
    slug: 'yokohama-2027-en', dateDebut: '2027-03-19T10:00:00+09:00', dateFin: '2027-09-26T00:00:00+09:00',
    pavillon: 'Togo takes part in GREEN×EXPO 2027, the international horticultural exhibition: nature, sustainable agriculture and green innovation.',
    image: { src: '/design/event-yokohama-2027-mascot.jpg', alt: 'Heart mascot surrounded by a flower-covered globe and the Togolese ribbon' },
  },
  {
    annee: 2027, ville: 'Belgrade', pays: 'Serbia', theme: 'Playing for Humanity: sport and music for all',
    slug: 'belgrade-2027-en', dateDebut: '2027-05-15T10:00:00+02:00', dateFin: '2027-08-15T00:00:00+02:00',
    pavillon: 'Togo takes part in the specialised Expo 2027 Belgrade: youth, sport, music and culture.',
    image: { src: '/design/event-belgrade-2027-dance.jpg', alt: 'Togolese dancer and two children wearing capes on a graphic background' },
  },
];

export const MOCK_UPCOMING_JA: EditionDetail[] = [
  {
    annee: 2027, ville: '横浜', pays: '日本', theme: 'Scenery of the Future for Happiness（幸せな未来の風景）',
    slug: 'yokohama-2027-ja', dateDebut: '2027-03-19T10:00:00+09:00', dateFin: '2027-09-26T00:00:00+09:00',
    pavillon: 'トーゴは国際園芸博覧会GREEN×EXPO 2027に参加します。自然、持続可能な農業、グリーンイノベーションを発信します。',
    image: { src: '/design/event-yokohama-2027-mascot.jpg', alt: '花に覆われた地球とトーゴのリボンに囲まれたハートのマスコット' },
  },
  {
    annee: 2027, ville: 'ベオグラード', pays: 'セルビア', theme: '人類のためにプレーする：すべての人のためのスポーツと音楽',
    slug: 'belgrade-2027-ja', dateDebut: '2027-05-15T10:00:00+02:00', dateFin: '2027-08-15T00:00:00+02:00',
    pavillon: 'トーゴはベオグラード専門博覧会2027に参加します。若者、スポーツ、音楽、文化を発信します。',
    image: { src: '/design/event-belgrade-2027-dance.jpg', alt: 'グラフィック背景の前に立つトーゴのダンサーとマントを着た二人の子ども' },
  },
];

export const MOCK_EDITIONS: Edition[] = [
  { annee: 2025, ville: 'Osaka', pays: 'Japon', theme: 'Inclusion et protection sociale', slug: 'osaka-2025' },
  { annee: 2021, ville: 'Dubaï', pays: 'EAU', theme: 'Connecter les esprits, construire le futur', slug: 'dubai-2021' },
  { annee: 2015, ville: 'Milan', pays: 'Italie', theme: 'Nourrir la planète, énergie pour la vie', slug: 'milan-2015' },
  { annee: 2010, ville: 'Shanghai', pays: 'Chine', theme: 'Une ville meilleure, une vie meilleure', slug: 'shanghai-2010' },
  { annee: 2000, ville: 'Hanovre', pays: 'Allemagne', theme: 'Homme, Nature, Technologie', slug: 'hanovre-2000' },
];

// TODO agent: brancher WP — fallbacks hors-ligne EN/JA (CMS injoignable, ex. preview Vercel).
export const MOCK_EDITIONS_EN: Edition[] = [
  { annee: 2025, ville: 'Osaka', pays: 'Japan', theme: 'Inclusion and social protection', slug: 'osaka-2025-en' },
  { annee: 2021, ville: 'Dubai', pays: 'UAE', theme: 'Connecting Minds, Creating the Future', slug: 'dubai-2021-en' },
  { annee: 2015, ville: 'Milan', pays: 'Italy', theme: 'Feeding the Planet, Energy for Life', slug: 'milan-2015-en' },
  { annee: 2010, ville: 'Shanghai', pays: 'China', theme: 'Better City, Better Life', slug: 'shanghai-2010-en' },
  { annee: 2000, ville: 'Hanover', pays: 'Germany', theme: 'Humankind, Nature, Technology', slug: 'hanovre-2000-en' },
];

export const MOCK_EDITIONS_JA: Edition[] = [
  { annee: 2025, ville: '大阪', pays: '日本', theme: 'インクルージョンと社会保障', slug: 'osaka-2025-ja' },
  { annee: 2021, ville: 'ドバイ', pays: 'UAE', theme: '心をつなぎ、未来を創る', slug: 'dubai-2021-ja' },
  { annee: 2015, ville: 'ミラノ', pays: 'イタリア', theme: '地球に食料を、生命にエネルギーを', slug: 'milan-2015-ja' },
  { annee: 2010, ville: '上海', pays: '中国', theme: 'より良い都市、より良い生活', slug: 'shanghai-2010-ja' },
  { annee: 2000, ville: 'ハノーファー', pays: 'ドイツ', theme: '人間・自然・技術', slug: 'hanovre-2000-ja' },
];

export const MOCK_ACTUS: ActuItem[] = [];

export type EditionDetail = Edition & {
  dateDebut: string;
  dateFin: string;
  pavillon: string;
  videoUrl?: string;
  image?: { src: string; alt: string };
};

export const MOCK_EDITION_DETAILS: Record<string, EditionDetail> = {
  'osaka-2025': {
    annee: 2025, ville: 'Osaka', pays: 'Japon', theme: 'Inclusion et protection sociale', slug: 'osaka-2025',
    dateDebut: '2025-04-13', dateFin: '2025-10-13',
    pavillon: "Le pavillon du Togo met en avant l'inclusion et la protection sociale comme moteurs de croissance : artisanat, agro-transformation et opportunités d'investissement.",
  },
  'dubai-2021': {
    annee: 2021, ville: 'Dubaï', pays: 'EAU', theme: 'Connecter les esprits, construire le futur', slug: 'dubai-2021',
    dateDebut: '2021-10-01', dateFin: '2022-03-31',
    pavillon: "À Dubaï, le Togo présente sa connectivité, sa logistique portuaire et son écosystème startup comme portes d'entrée de l'Afrique de l'Ouest.",
  },
  'milan-2015': {
    annee: 2015, ville: 'Milan', pays: 'Italie', theme: 'Nourrir la planète, énergie pour la vie', slug: 'milan-2015',
    dateDebut: '2015-05-01', dateFin: '2015-10-31',
    pavillon: "À Milan, le Togo valorise son agriculture durable, ses produits du terroir et sa sécurité alimentaire.",
  },
  'shanghai-2010': {
    annee: 2010, ville: 'Shanghai', pays: 'Chine', theme: 'Une ville meilleure, une vie meilleure', slug: 'shanghai-2010',
    dateDebut: '2010-05-01', dateFin: '2010-10-31',
    pavillon: "À Shanghai, le Togo expose sa culture urbaine, son artisanat et sa vision des villes durables.",
  },
  'hanovre-2000': {
    annee: 2000, ville: 'Hanovre', pays: 'Allemagne', theme: 'Homme, Nature, Technologie', slug: 'hanovre-2000',
    dateDebut: '2000-06-01', dateFin: '2000-10-31',
    pavillon: "À Hanovre, le Togo affirme sa présence sur la scène mondiale autour du dialogue entre homme, nature et technologie.",
  },
  // TODO agent: brancher WP — fallback hors-ligne des fiches 2027 (CMS injoignable, ex. preview Vercel).
  'yokohama-2027': {
    annee: 2027, ville: 'Yokohama', pays: 'Japon', theme: 'Scenery of the Future for Happiness', slug: 'yokohama-2027',
    dateDebut: '2027-03-19T10:00:00+09:00', dateFin: '2027-09-26T00:00:00+09:00',
    pavillon: 'Le Togo participe à GREEN×EXPO 2027, exposition horticole internationale : nature, agriculture durable et innovations vertes autour du thème « Scenery of the Future for Happiness ».',
    image: { src: '/design/city-yokohama.jpg', alt: 'Minato Mirai de nuit — Yokohama' },
  },
  'belgrade-2027': {
    annee: 2027, ville: 'Belgrade', pays: 'Serbie', theme: 'Jouer pour l’humanité — le sport et la musique pour tous', slug: 'belgrade-2027',
    dateDebut: '2027-05-15T10:00:00+02:00', dateFin: '2027-08-15T00:00:00+02:00',
    pavillon: 'Le Togo participe à l’exposition spécialisée Expo 2027 Belgrade : jeunesse, sport, musique et culture autour du thème « Jouer pour l’humanité ».',
    image: { src: '/design/city-belgrade.jpg', alt: 'Forteresse de Kalemegdan sur le Danube — Belgrade' },
  },
};

export function getMockEditionDetail(slug: string): EditionDetail | undefined {
  return MOCK_EDITION_DETAILS[slug];
}

// TODO agent: brancher WP — détails mock EN/JA (CMS injoignable, ex. preview Vercel).
// Les champs traduits disponibles hors-ligne (ville/pays/thème, + pavillon pour 2027)
// écrasent la fiche FR ; le reste retombe sur le FR plutôt que d'inventer du contenu.
export function getMockEditionDetailLang(slug: string, lang: 'fr' | 'en' | 'ja' = 'fr'): EditionDetail | undefined {
  const suffix = lang === 'fr' ? '' : `-${lang}`;
  const base = MOCK_EDITION_DETAILS[slug.replace(/-(en|ja)$/, '')];
  if (!base || lang === 'fr') return base;
  const list = lang === 'en' ? MOCK_EDITIONS_EN : MOCK_EDITIONS_JA;
  const upcoming = lang === 'en' ? MOCK_UPCOMING_EN : MOCK_UPCOMING_JA;
  const translated = list.find((e) => e.slug === `${base.slug}${suffix}`);
  const futur = upcoming.find((e) => e.slug === `${base.slug}${suffix}`);
  return {
    ...base,
    slug: `${base.slug}${suffix}`,
    ville: futur?.ville ?? translated?.ville ?? base.ville,
    pays: futur?.pays ?? translated?.pays ?? base.pays,
    theme: futur?.theme ?? translated?.theme ?? base.theme,
    pavillon: futur?.pavillon ?? base.pavillon,
  };
}
