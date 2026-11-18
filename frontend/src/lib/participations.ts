import type { Lang } from '@/i18n/lang';

/**
 * Les participations du Togo aux expositions internationales, de 1967 à 2030,
 * telles que communiquées par le Comité (liste du 18 octobre 2026).
 *
 * TODO agent: brancher WP — la liste vit ici tant que le CMS ne porte pas les
 * éditions antérieures à 2000 ni les expositions horticoles. Les thèmes et
 * dates officiels sont ceux du BIE et de l'AIPH.
 */
export type ParticipationKind = 'universelle' | 'horticole' | 'specialisee';
export type ParticipationStatus = 'past' | 'prep';

type Text = { city: string; country: string; name: string; theme: string; dates: string };

export type Participation = {
  id: string;
  year: number;
  kind: ParticipationKind;
  status: ParticipationStatus;
  /** Slug de la page dédiée, quand elle existe. Sans page, la carte n'est pas un lien. */
  page?: string;
  image?: string;
  credit?: string;
  text: Record<Lang, Text>;
};

export const PARTICIPATIONS: Participation[] = [
  {
    id: 'montreal-1967',
    year: 1967,
    kind: 'universelle',
    status: 'past',
    text: {
      fr: { city: 'Montréal', country: 'Canada', name: 'Expo 67', theme: 'Terre des Hommes', dates: '27 avril — 29 octobre 1967' },
      en: { city: 'Montreal', country: 'Canada', name: 'Expo 67', theme: 'Man and His World', dates: '27 April — 29 October 1967' },
      ja: { city: 'モントリオール', country: 'カナダ', name: 'モントリオール万博', theme: '人間とその世界', dates: '1967年4月27日〜10月29日' },
    },
  },
  {
    id: 'osaka-1970',
    year: 1970,
    kind: 'universelle',
    status: 'past',
    text: {
      fr: { city: 'Osaka', country: 'Japon', name: 'Expo ’70', theme: 'Progrès et harmonie pour l’humanité', dates: '15 mars — 13 septembre 1970' },
      en: { city: 'Osaka', country: 'Japan', name: 'Expo ’70', theme: 'Progress and Harmony for Mankind', dates: '15 March — 13 September 1970' },
      ja: { city: '大阪', country: '日本', name: '日本万国博覧会', theme: '人類の進歩と調和', dates: '1970年3月15日〜9月13日' },
    },
  },
  {
    id: 'hanovre-2000',
    year: 2000,
    kind: 'universelle',
    status: 'past',
    page: 'hanovre-2000',
    image: '/design/ed-hanovre.jpg',
    credit: 'J.-H. Janßen, Wikimedia Commons (CC BY-SA 3.0)',
    text: {
      fr: { city: 'Hanovre', country: 'Allemagne', name: 'Expo 2000', theme: 'Homme, Nature, Technologie', dates: '1er juin — 31 octobre 2000' },
      en: { city: 'Hanover', country: 'Germany', name: 'Expo 2000', theme: 'Humankind, Nature, Technology', dates: '1 June — 31 October 2000' },
      ja: { city: 'ハノーファー', country: 'ドイツ', name: 'ハノーファー万博', theme: '人間・自然・技術', dates: '2000年6月1日〜10月31日' },
    },
  },
  {
    id: 'shanghai-2010',
    year: 2010,
    kind: 'universelle',
    status: 'past',
    page: 'shanghai-2010',
    image: '/design/ed-shanghai.jpg',
    credit: 'Gary Lee Todd, Wikimedia Commons (CC0)',
    text: {
      fr: { city: 'Shanghai', country: 'Chine', name: 'Expo 2010', theme: 'Meilleure ville, meilleure vie', dates: '1er mai — 31 octobre 2010' },
      en: { city: 'Shanghai', country: 'China', name: 'Expo 2010', theme: 'Better City, Better Life', dates: '1 May — 31 October 2010' },
      ja: { city: '上海', country: '中国', name: '上海万博', theme: 'より良い都市、より良い生活', dates: '2010年5月1日〜10月31日' },
    },
  },
  {
    id: 'milan-2015',
    year: 2015,
    kind: 'universelle',
    status: 'past',
    page: 'milan-2015',
    image: '/design/ed-milan.jpg',
    credit: 'Costantino Beretta, Wikimedia Commons (CC BY 3.0)',
    text: {
      fr: { city: 'Milan', country: 'Italie', name: 'Expo Milano 2015', theme: 'Nourrir la planète, énergie pour la vie', dates: '1er mai — 31 octobre 2015' },
      en: { city: 'Milan', country: 'Italy', name: 'Expo Milano 2015', theme: 'Feeding the Planet, Energy for Life', dates: '1 May — 31 October 2015' },
      ja: { city: 'ミラノ', country: 'イタリア', name: 'ミラノ万博', theme: '地球に食料を、生命にエネルギーを', dates: '2015年5月1日〜10月31日' },
    },
  },
  {
    id: 'pekin-2019',
    year: 2019,
    kind: 'horticole',
    status: 'past',
    text: {
      fr: { city: 'Pékin', country: 'Chine', name: 'Expo horticole internationale de Pékin', theme: 'Vivre vert, vivre mieux', dates: '29 avril — 7 octobre 2019' },
      en: { city: 'Beijing', country: 'China', name: 'Beijing International Horticultural Expo', theme: 'Live Green, Live Better', dates: '29 April — 7 October 2019' },
      ja: { city: '北京', country: '中国', name: '北京国際園芸博覧会', theme: '緑の生活、美しい家園', dates: '2019年4月29日〜10月7日' },
    },
  },
  {
    id: 'dubai-2020',
    year: 2020,
    kind: 'universelle',
    status: 'past',
    page: 'dubai-2021',
    image: '/design/ed-dubai.webp',
    text: {
      fr: { city: 'Dubaï', country: 'Émirats arabes unis', name: 'Expo 2020 Dubaï', theme: 'Connecter les esprits, construire le futur', dates: '1er octobre 2021 — 31 mars 2022' },
      en: { city: 'Dubai', country: 'United Arab Emirates', name: 'Expo 2020 Dubai', theme: 'Connecting Minds, Creating the Future', dates: '1 October 2021 — 31 March 2022' },
      ja: { city: 'ドバイ', country: 'アラブ首長国連邦', name: 'ドバイ万博', theme: '心をつなぎ、未来を創る', dates: '2021年10月1日〜2022年3月31日' },
    },
  },
  {
    id: 'doha-2023',
    year: 2023,
    kind: 'horticole',
    status: 'past',
    text: {
      fr: { city: 'Doha', country: 'Qatar', name: 'Expo 2023 Doha', theme: 'Désert vert, meilleur environnement', dates: '2 octobre 2023 — 28 mars 2024' },
      en: { city: 'Doha', country: 'Qatar', name: 'Expo 2023 Doha', theme: 'Green Desert, Better Environment', dates: '2 October 2023 — 28 March 2024' },
      ja: { city: 'ドーハ', country: 'カタール', name: 'ドーハ国際園芸博覧会', theme: '緑の砂漠、より良い環境', dates: '2023年10月2日〜2024年3月28日' },
    },
  },
  {
    id: 'osaka-2025',
    year: 2025,
    kind: 'universelle',
    status: 'past',
    page: 'osaka-2025',
    image: '/design/osaka/parade-grand-anneau.jpg',
    text: {
      fr: { city: 'Osaka', country: 'Japon', name: 'Expo 2025 Osaka, Kansai', theme: 'Concevoir la société du futur, imaginer notre vie de demain', dates: '13 avril — 13 octobre 2025' },
      en: { city: 'Osaka', country: 'Japan', name: 'Expo 2025 Osaka, Kansai', theme: 'Designing Future Society for Our Lives', dates: '13 April — 13 October 2025' },
      ja: { city: '大阪', country: '日本', name: '大阪・関西万博', theme: 'いのち輝く未来社会のデザイン', dates: '2025年4月13日〜10月13日' },
    },
  },
  {
    id: 'yokohama-2027',
    year: 2027,
    kind: 'horticole',
    status: 'prep',
    page: 'yokohama-2027',
    image: '/design/event-yokohama-2027.jpg',
    text: {
      fr: { city: 'Yokohama', country: 'Japon', name: 'GREEN×EXPO 2027', theme: 'Les paysages du futur pour le bonheur', dates: '19 mars — 26 septembre 2027' },
      en: { city: 'Yokohama', country: 'Japan', name: 'GREEN×EXPO 2027', theme: 'Scenery of the Future for Happiness', dates: '19 March — 26 September 2027' },
      ja: { city: '横浜', country: '日本', name: 'GREEN×EXPO 2027', theme: '幸せを創る明日の風景', dates: '2027年3月19日〜9月26日' },
    },
  },
  {
    id: 'belgrade-2027',
    year: 2027,
    kind: 'specialisee',
    status: 'prep',
    page: 'belgrade-2027',
    image: '/design/event-belgrade-2027.jpg',
    text: {
      fr: { city: 'Belgrade', country: 'Serbie', name: 'Expo 2027 Belgrade', theme: 'Jouer pour l’humanité : le sport et la musique pour tous', dates: '15 mai — 15 août 2027' },
      en: { city: 'Belgrade', country: 'Serbia', name: 'Expo 2027 Belgrade', theme: 'Play for Humanity: Sport and Music for All', dates: '15 May — 15 August 2027' },
      ja: { city: 'ベオグラード', country: 'セルビア', name: 'ベオグラード国際博覧会', theme: '人類のための遊び：すべての人にスポーツと音楽を', dates: '2027年5月15日〜8月15日' },
    },
  },
  {
    id: 'riyad-2030',
    year: 2030,
    kind: 'universelle',
    status: 'prep',
    text: {
      fr: { city: 'Riyad', country: 'Arabie saoudite', name: 'Expo 2030 Riyad', theme: 'L’ère du changement : ensemble vers un avenir clairvoyant', dates: '1er octobre 2030 — 31 mars 2031' },
      en: { city: 'Riyadh', country: 'Saudi Arabia', name: 'Expo 2030 Riyadh', theme: 'The Era of Change: Together for a Foresighted Tomorrow', dates: '1 October 2030 — 31 March 2031' },
      ja: { city: 'リヤド', country: 'サウジアラビア', name: 'リヤド万博', theme: '変革の時代：先見の明ある明日へ共に', dates: '2030年10月1日〜2031年3月31日' },
    },
  },
];
