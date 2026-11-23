import type { Lang } from './lang';

/**
 * Traductions des quelques libellés rédigés en français hors du dictionnaire :
 * textes alternatifs des visuels d'édition, titres des albums Flickr, liens
 * utiles. La clé est le texte français ; sans entrée, il reste en français.
 */
const FIXED: Record<string, { en: string; ja: string; sr: string }> = {
  // Visuels des éditions (lib/design.ts, lib/archives.ts, lib/archive-osaka.ts)
  'Pavillon du Togo — Osaka 2025': { en: 'Togo pavilion — Osaka 2025', ja: 'トーゴ館 — 大阪 2025', sr: 'Павиљон Тога — Осака 2025' },
  'Pavillon du Togo — Dubaï 2020': { en: 'Togo pavilion — Dubai 2020', ja: 'トーゴ館 — ドバイ 2020', sr: 'Павиљон Тога — Дубаи 2020' },
  'Pavillon du Togo — Expo 2020 Dubaï': { en: 'Togo pavilion — Expo 2020 Dubai', ja: 'トーゴ館 — ドバイ万博 2020', sr: 'Павиљон Тога — Експо 2020 Дубаи' },
  'Arbre de vie — Expo Milano 2015': { en: 'Tree of Life — Expo Milano 2015', ja: '生命の木 — ミラノ万博 2015', sr: 'Дрво живота — Експо Милано 2015' },
  'Pavillon de la Chine — Expo Shanghai 2010': { en: 'China pavilion — Expo Shanghai 2010', ja: '中国館 — 上海万博 2010', sr: 'Павиљон Кине — Експо Шангај 2010' },
  'Site de l’Expo 2000 — Hanovre': { en: 'Expo 2000 site — Hanover', ja: 'ハノーバー万博 2000 の会場', sr: 'Простор Експа 2000 — Хановер' },
  'Site de l’Exposition universelle de Hanovre 2000': { en: 'Site of the Hanover 2000 World Expo', ja: 'ハノーバー万博 2000 の会場', sr: 'Простор Светске изложбе Хановер 2000' },
  'Parade togolaise sous le Grand Anneau de l’Expo 2025 Osaka': {
    en: 'Togolese parade under the Grand Ring of Expo 2025 Osaka',
    ja: '大阪・関西万博 2025 の大屋根リングの下を進むトーゴのパレード',
    sr: 'Тоговска парада испод Великог прстена Експа 2025 Осака',
  },
  // Albums Flickr (data/flickr.json)
  'Journée Nationale du Togo': { en: 'Togo National Day', ja: 'トーゴ・ナショナルデー', sr: 'Национални дан Тога' },
  'Culture et Patrimoine': { en: 'Culture and heritage', ja: '文化と遺産', sr: 'Култура и наслеђе' },
  'Decouverte du pavillon du Togo à Osaka': { en: 'Discovering the Togo pavilion in Osaka', ja: '大阪のトーゴ館を訪ねて', sr: 'Обилазак павиљона Тога у Осаки' },
  'Participation du Togo a OSAKA2025': { en: 'Togo’s participation in Osaka 2025', ja: '大阪 2025 へのトーゴの参加', sr: 'Учешће Тога на Експу Осака 2025' },
  // Catégories des articles (WordPress)
  'Actualités Gouvernementales': { en: 'Government news', ja: '政府ニュース', sr: 'Владине вести' },
  'Culture & Tourisme': { en: 'Culture & tourism', ja: '文化・観光', sr: 'Култура и туризам' },
  'Développement Durable': { en: 'Sustainable development', ja: '持続可能な開発', sr: 'Одрживи развој' },
  'Économie & Finances': { en: 'Economy & finance', ja: '経済・金融', sr: 'Економија и финансије' },
  'Entrepreneuriat & Business': { en: 'Entrepreneurship & business', ja: '起業・ビジネス', sr: 'Предузетништво и бизнис' },
  'Événements & Salons': { en: 'Events & fairs', ja: 'イベント・見本市', sr: 'Догађаји и сајмови' },
  'Innovation & Technologie': { en: 'Innovation & technology', ja: 'イノベーション・テクノロジー', sr: 'Иновације и технологија' },
  'Actus': { en: 'News', ja: 'ニュース', sr: 'Вести' },
  // Liens utiles (lib/design.ts)
  'Portail pays': { en: 'Country portal', ja: 'トーゴ政府ポータル', sr: 'Портал Владе Тога' },
  'Ministère du Commerce': { en: 'Ministry of Trade', ja: '商業省', sr: 'Министарство трговине' },
};

export function fixedIn(fr: string, lang: Lang): string {
  return lang === 'fr' ? fr : FIXED[fr]?.[lang] ?? fr;
}
