import type { Lang } from '@/i18n/lang';
import { osaka } from '@/lib/archive-osaka';
import { ARCHIVES_SR } from '@/lib/archives-sr';

/**
 * Les participations passées racontées, et non plus seulement listées.
 *
 * Cinq éditions — Osaka 2025 (dans `archive-osaka.ts`, plus riche : parcours
 * du pavillon, chiffres, témoignages, mini-médiathèque), Dubaï 2021, Milan
 * 2015, Shanghai 2010, Hanovre 2000 — qui partagent la même trame : une bannière, les deux thèmes en vis-à-vis,
 * quelques repères chiffrés, des sections de récit, les temps forts datés, puis
 * le renvoi vers l'album Flickr. Le contenu est ici, la mise en page dans
 * `ArchiveEdition` : une seule page sert les cinq éditions et les trois
 * langues.
 *
 * Ce contenu ne vient pas du CMS : il a été fourni rédigé. Il reste donc en
 * dur, comme les textes des deux éditions 2027.
 * TODO agent: brancher WP — remonter ces récits dans le CMS quand le modèle
 * de contenu « édition » accueillera des sections libres.
 */

/** Une section de récit : un titre, un mot mis en avant, des paragraphes. */
export type ArchiveBlock = { title: string; accent?: string; paras: string[] };

/** Un temps fort daté de la participation. */
export type ArchiveMoment = { date: string; title: string; paras: string[] };

export type ArchiveContent = {
  /** Ville seule, pour les fils d'Ariane et la liste des autres éditions. */
  city: string;
  /** Surtitre de bannière : « Expo 2020 Dubaï · Émirats arabes unis ». */
  kicker: string;
  dates: string;
  title: string;
  accent: string;
  lead: string;
  themeExpo: string;
  themeTogo: string;
  /** Repères chiffrés tirés du récit ; absents si l'édition n'en fournit pas. */
  facts?: { v: string; l: string }[];
  /** Sections de récit avant les temps forts. */
  blocks: ArchiveBlock[];
  momentsTitle: string;
  momentsAccent: string;
  moments: ArchiveMoment[];
  /** Sections de récit après les temps forts. */
  after: ArchiveBlock[];
  galleryTitle: string;
  galleryAccent: string;
  galleryPara: string;
  /** Le parcours du pavillon, étape par étape — Osaka seulement à ce jour. */
  sequence?: { title: string; accent: string; lead: string; items: { t: string; d: string }[] };
  /** Les chiffres de la participation, quand un bilan les donne. */
  figures?: { title: string; accent: string; items: { v: string; l: string }[] };
  /** Paroles recueillies sur place. */
  voices?: { quote: string; by: string }[];
  /** Légendes des photographies de l'édition, dans l'ordre de `photos`. */
  photoAlts?: string[];
};

/** Une photographie de la mini-médiathèque, avec ses dimensions réelles. */
export type ArchivePhoto = { src: string; w: number; h: number };

export type ArchiveEdition = {
  slug: string;
  year: number;
  image: string;
  imageAlt: string;
  /** Mini-médiathèque : absente, la section album se réduit au lien Flickr. */
  photos?: ArchivePhoto[];
  /* Les quatre champs suivants désignent des photographies par leur rang dans
     `photos`. Ils n'ont de sens que si `photos` est fourni. */
  /** Diaporama de la bannière. */
  heroSlides?: number[];
  /** Photographie de chaque section de récit, dans l'ordre ; `null` = aucune. */
  storyPhotos?: (number | null)[];
  /** Photographies de chaque temps fort, dans l'ordre. */
  momentPhotos?: number[][];
  /** Bande de photographies qui glisse entre deux sections. */
  strip?: number[];
  fr: ArchiveContent;
  en: ArchiveContent;
  ja: ArchiveContent;
};

export const ARCHIVE_SLUGS = ['osaka-2025', 'dubai-2021', 'milan-2015', 'shanghai-2010', 'hanovre-2000'] as const;
export type ArchiveSlug = (typeof ARCHIVE_SLUGS)[number];

export function isArchiveSlug(slug: string): slug is ArchiveSlug {
  return (ARCHIVE_SLUGS as readonly string[]).includes(slug);
}

/** Album public du Comité : une seule galerie pour toutes les participations. */
export const FLICKR_ALBUM = 'https://www.flickr.com/photos/190367340@N06/';

const dubai: ArchiveEdition = {
  slug: 'dubai-2021',
  year: 2021,
  image: '/design/ed-dubai.webp',
  imageAlt: 'Pavillon du Togo — Expo 2020 Dubaï',
  fr: {
    city: 'Dubaï',
    kicker: 'Expo 2020 Dubaï · Émirats arabes unis',
    dates: '1er octobre 2021 — 31 mars 2022',
    title: 'Le Togo à Dubaï : le numérique au service des populations',
    accent: 'le numérique au service des populations',
    lead: 'À l’Expo 2020 Dubaï, le Togo a partagé sa vision d’un développement porté par le numérique, l’innovation et les talents de ses habitants. Une participation pour faire découvrir le pays, présenter ses initiatives et créer de nouvelles relations économiques.',
    themeExpo: 'Connecter les esprits, construire le futur',
    themeTogo: 'L’inclusion du numérique dans le développement des populations',
    facts: [
      { v: 'Mobilité', l: 'district du pavillon' },
      { v: '03', l: 'journées thématiques' },
      { v: '02', l: 'accords de coopération signés' },
    ],
    blocks: [
      {
        title: 'Un pavillon entre innovation et identité',
        accent: 'innovation et identité',
        paras: [
          'Installé dans le district Mobilité, le pavillon togolais invitait les visiteurs à découvrir comment le numérique peut faciliter l’accès aux services, soutenir les activités économiques et améliorer la vie quotidienne.',
          'Éducation numérique, identification électronique, paiements sociaux par mobile, agriculture et digitalisation du port de Lomé : le parcours présentait plusieurs facettes de cette transformation.',
          'Cette ouverture sur l’avenir s’accompagnait d’une découverte de l’identité togolaise, à travers le Koutammakou, les fêtes traditionnelles et l’histoire des Nana Benz.',
        ],
      },
    ],
    momentsTitle: 'Les temps forts de la participation',
    momentsAccent: 'temps forts',
    moments: [
      {
        date: '19 décembre 2021',
        title: 'Une journée consacrée aux opportunités économiques',
        paras: [
          'La Journée économique du Togo a réuni des représentants institutionnels, des acteurs du secteur privé et des partenaires internationaux.',
          'Elle a permis de présenter les opportunités d’investissement et plusieurs projets structurants, notamment la Plateforme industrielle d’Adétikopé, l’Agropole de Kara, le Data Center et les infrastructures énergétiques.',
        ],
      },
      {
        date: '21 décembre 2021',
        title: 'Le Togo à l’honneur',
        paras: [
          'La Journée nationale du Togo a été conduite par Victoire Tomégah-Dogbé, alors Première ministre, représentant le président de la République.',
          'La cérémonie et les visites des pavillons ont mis en lumière les ambitions économiques et la richesse culturelle du pays. Le groupe Toofan a apporté une touche musicale à ce rendez-vous.',
        ],
      },
      {
        date: 'Février 2022',
        title: 'Les startups togolaises prennent la parole',
        paras: [
          'La Journée du numérique et des startups a donné une visibilité internationale aux solutions développées par les entrepreneurs togolais.',
          'Des initiatives dans la santé, les transports et la robotique ont été présentées, avec notamment la participation de Gozem et d’eConvivial.',
        ],
      },
    ],
    after: [
      {
        title: 'Des échanges prolongés par des accords de coopération',
        accent: 'accords de coopération',
        paras: [
          'Lors de la Journée économique, la Chambre de commerce et d’industrie du Togo a signé deux accords de coopération : l’un avec la Fédération des chambres de commerce et d’industrie des Émirats arabes unis, l’autre avec la Chambre de commerce nationale polono-arabe.',
          'Ces accords ont posé les bases de nouveaux échanges entre les milieux d’affaires.',
        ],
      },
    ],
    galleryTitle: 'Revivre Dubaï en images',
    galleryAccent: 'en images',
    galleryPara:
      'Le pavillon, les rencontres économiques et la Journée nationale : retrouvez les images de cette étape de la présence togolaise sur la scène internationale.',
  },
  en: {
    city: 'Dubai',
    kicker: 'Expo 2020 Dubai · United Arab Emirates',
    dates: '1 October 2021 — 31 March 2022',
    title: 'Togo in Dubai: digital technology in the service of people',
    accent: 'digital technology in the service of people',
    lead: 'At Expo 2020 Dubai, Togo shared its vision of development driven by digital technology, innovation and the talents of its people. A participation designed to make the country better known, present its initiatives and build new economic relationships.',
    themeExpo: 'Connecting Minds, Creating the Future',
    themeTogo: 'Bringing digital technology into the development of communities',
    facts: [
      { v: 'Mobility', l: 'pavilion district' },
      { v: '03', l: 'themed days' },
      { v: '02', l: 'cooperation agreements signed' },
    ],
    blocks: [
      {
        title: 'A pavilion between innovation and identity',
        accent: 'innovation and identity',
        paras: [
          'Set in the Mobility district, the Togolese pavilion invited visitors to discover how digital technology can ease access to services, support economic activity and improve everyday life.',
          'Digital education, electronic identification, mobile social payments, agriculture and the digitalisation of the port of Lomé: the visit showed several faces of that transformation.',
          'This outlook on the future came with a discovery of Togolese identity, through the Koutammakou, traditional festivals and the story of the Nana Benz.',
        ],
      },
    ],
    momentsTitle: 'The highlights of the participation',
    momentsAccent: 'highlights',
    moments: [
      {
        date: '19 December 2021',
        title: 'A day devoted to economic opportunities',
        paras: [
          'Togo’s Economic Day brought together institutional representatives, private-sector players and international partners.',
          'It was an opportunity to present investment opportunities and several structuring projects, among them the Adétikopé Industrial Platform, the Kara Agropolis, the Data Centre and energy infrastructure.',
        ],
      },
      {
        date: '21 December 2021',
        title: 'Togo in the spotlight',
        paras: [
          'Togo’s National Day was led by Victoire Tomégah-Dogbé, then Prime Minister, representing the President of the Republic.',
          'The ceremony and the pavilion visits highlighted the country’s economic ambitions and cultural wealth. The band Toofan brought a musical touch to the occasion.',
        ],
      },
      {
        date: 'February 2022',
        title: 'Togolese startups take the floor',
        paras: [
          'The Digital and Startup Day gave international visibility to the solutions built by Togolese entrepreneurs.',
          'Initiatives in health, transport and robotics were presented, with Gozem and eConvivial among the participants.',
        ],
      },
    ],
    after: [
      {
        title: 'Exchanges carried further by cooperation agreements',
        accent: 'cooperation agreements',
        paras: [
          'During the Economic Day, the Chamber of Commerce and Industry of Togo signed two cooperation agreements: one with the Federation of UAE Chambers of Commerce and Industry, the other with the Polish-Arab National Chamber of Commerce.',
          'These agreements laid the groundwork for new exchanges between the two business communities.',
        ],
      },
    ],
    galleryTitle: 'Dubai in pictures',
    galleryAccent: 'in pictures',
    galleryPara:
      'The pavilion, the economic meetings and the National Day: browse the images of this chapter of Togo’s presence on the international stage.',
  },
  ja: {
    city: 'ドバイ',
    kicker: 'ドバイ国際博覧会2020 · アラブ首長国連邦',
    dates: '2021年10月1日 — 2022年3月31日',
    title: 'ドバイのトーゴ：人々の暮らしに生きるデジタル',
    accent: '人々の暮らしに生きるデジタル',
    lead: 'ドバイ国際博覧会2020でトーゴは、デジタル、イノベーション、そして人材に支えられた開発の展望を発信しました。国を知ってもらい、取り組みを紹介し、新たな経済関係を築くための参加です。',
    themeExpo: '心をつなぎ、未来を創る',
    themeTogo: '人々の開発にデジタルを取り込む',
    facts: [
      { v: 'モビリティ', l: 'パビリオンの地区' },
      { v: '03', l: 'テーマデー' },
      { v: '02', l: '締結された協力協定' },
    ],
    blocks: [
      {
        title: 'イノベーションとアイデンティティのあいだで',
        accent: 'アイデンティティ',
        paras: [
          'モビリティ地区に設けられたトーゴ館は、デジタルがサービスへのアクセスを容易にし、経済活動を支え、日々の暮らしを改善しうることを来場者に示しました。',
          'デジタル教育、電子身分証、モバイルによる社会給付、農業、そしてロメ港のデジタル化 — 展示はこの変化のいくつもの側面を紹介しました。',
          '未来へのまなざしとともに、クタマク、伝統の祭り、ナナ・ベンズの歴史を通じてトーゴのアイデンティティにも触れられました。',
        ],
      },
    ],
    momentsTitle: '参加のハイライト',
    momentsAccent: 'ハイライト',
    moments: [
      {
        date: '2021年12月19日',
        title: '経済の機会に捧げられた一日',
        paras: [
          'トーゴ経済デーには、政府関係者、民間セクターの事業者、国際的なパートナーが集まりました。',
          '投資機会に加え、アデティコペ工業団地、カラ・アグロポール、データセンター、エネルギー基盤などの重点事業が紹介されました。',
        ],
      },
      {
        date: '2021年12月21日',
        title: 'トーゴ・ナショナルデー',
        paras: [
          'ナショナルデーは、大統領の代理として当時の首相ヴィクトワール・トメガ＝ドグベが主導しました。',
          '式典と各パビリオンの訪問は、国の経済的な意欲と文化的な豊かさを浮かび上がらせました。グループToofanが音楽で彩りを添えました。',
        ],
      },
      {
        date: '2022年2月',
        title: 'トーゴのスタートアップが語る',
        paras: [
          'デジタル・スタートアップデーは、トーゴの起業家が生み出した解決策に国際的な注目を集めました。',
          '医療、交通、ロボティクスの取り組みが紹介され、GozemやeConvivialも参加しました。',
        ],
      },
    ],
    after: [
      {
        title: '協力協定へと続いた対話',
        accent: '協力協定',
        paras: [
          '経済デーに際し、トーゴ商工会議所は二つの協力協定に署名しました。一つはアラブ首長国連邦商工会議所連合と、もう一つはポーランド・アラブ全国商業会議所とのものです。',
          'これらの協定は、双方の経済界の新しい交流の土台となりました。',
        ],
      },
    ],
    galleryTitle: '写真で振り返るドバイ',
    galleryAccent: '写真で',
    galleryPara:
      'パビリオン、経済関係の会合、ナショナルデー — 国際舞台におけるトーゴのこの歩みを写真でご覧ください。',
  },
};

const milan: ArchiveEdition = {
  slug: 'milan-2015',
  year: 2015,
  image: '/design/ed-milan.jpg',
  imageAlt: 'Arbre de vie — Expo Milano 2015',
  fr: {
    city: 'Milan',
    kicker: 'Expo Milano 2015 · Italie',
    dates: '1er mai — 31 octobre 2015',
    title: 'Le Togo à Milan : une terre qui nourrit, des savoir-faire qui se partagent',
    accent: 'des savoir-faire qui se partagent',
    lead: 'À l’Exposition universelle de Milan, le Togo a mis en lumière ses richesses agricoles et ses traditions alimentaires. Une invitation à découvrir les produits de ses terres, les savoir-faire de ses populations et leur contribution à la sécurité alimentaire.',
    themeExpo: 'Nourrir la planète, énergie pour la vie',
    themeTogo:
      'La contribution des céréales et tubercules à la sécurité alimentaire et nutritionnelle des populations du Togo',
    facts: [
      { v: '07', l: 'céréales et tubercules présentés' },
      { v: 'Pôle', l: '« Céréales et tubercules »' },
    ],
    blocks: [
      {
        title: 'Un pavillon consacré aux céréales et aux tubercules',
        accent: 'céréales et aux tubercules',
        paras: [
          'Installé au sein du pôle « Céréales et tubercules », le pavillon togolais présentait des produits essentiels à l’alimentation du pays : maïs, riz, sorgho, millet, fonio, igname et manioc.',
          'Les visiteurs étaient invités à découvrir les cultures agricoles, les méthodes de production et les recettes qui donnent à ces produits toute leur place dans la vie quotidienne.',
          'À travers ce parcours, le Togo partageait un patrimoine où agriculture, cuisine et culture se rencontrent.',
        ],
      },
      {
        title: 'Du champ à l’assiette, un patrimoine à découvrir',
        accent: 'un patrimoine à découvrir',
        paras: [
          'La participation togolaise mettait en avant les connaissances et les pratiques associées aux produits locaux.',
          'Au-delà de leur valeur alimentaire, ces céréales et tubercules racontent les gestes des producteurs, les traditions culinaires et les moments de partage autour du repas.',
          'Le pavillon ouvrait ainsi une fenêtre sur le Togo, ses ressources et les liens entre alimentation et développement.',
        ],
      },
    ],
    momentsTitle: 'La Journée nationale du Togo',
    momentsAccent: 'Journée nationale',
    moments: [
      {
        date: '21 août 2015',
        title: 'Le Togo à l’honneur',
        paras: [
          'La Journée nationale du Togo a été lancée par Faure Gnassingbé, alors président de la République, avec une visite du pavillon togolais.',
          'Ce rendez-vous a permis de présenter le potentiel agricole du pays et de rappeler l’importance de l’agriculture face aux enjeux alimentaires.',
          'Le programme annoncé associait parade, dégustations de mets locaux, animations culturelles, défilés de mode et prestations musicales, notamment avec l’artiste Jimmy Hope.',
        ],
      },
    ],
    after: [
      {
        title: 'L’alimentation comme lien entre les peuples',
        accent: 'lien entre les peuples',
        paras: [
          'À Milan, le Togo a inscrit sa participation dans une réflexion mondiale : comment nourrir les populations tout en valorisant les ressources et les savoir-faire de chaque territoire ?',
          'Ses produits agricoles et ses traditions alimentaires ont donné un visage concret à cette ambition, en faisant de la découverte du pays une expérience de rencontre et de partage.',
        ],
      },
    ],
    galleryTitle: 'Revivre Milan en images',
    galleryAccent: 'en images',
    galleryPara:
      'Découvrez le pavillon togolais, les produits présentés et les temps forts de la Journée nationale du Togo.',
  },
  en: {
    city: 'Milan',
    kicker: 'Expo Milano 2015 · Italy',
    dates: '1 May — 31 October 2015',
    title: 'Togo in Milan: a land that feeds, know-how that is shared',
    accent: 'know-how that is shared',
    lead: 'At the Milan World Expo, Togo put its agricultural wealth and food traditions in the spotlight. An invitation to discover the produce of its land, the know-how of its people and their contribution to food security.',
    themeExpo: 'Feeding the Planet, Energy for Life',
    themeTogo:
      'The contribution of cereals and tubers to the food and nutritional security of the people of Togo',
    facts: [
      { v: '07', l: 'cereals and tubers presented' },
      { v: 'Cluster', l: '“Cereals and tubers”' },
    ],
    blocks: [
      {
        title: 'A pavilion devoted to cereals and tubers',
        accent: 'cereals and tubers',
        paras: [
          'Set within the “Cereals and tubers” cluster, the Togolese pavilion presented produce essential to the country’s diet: maize, rice, sorghum, millet, fonio, yam and cassava.',
          'Visitors were invited to discover the crops, the growing methods and the recipes that give these foods their place in everyday life.',
          'Through this journey, Togo shared a heritage where farming, cooking and culture meet.',
        ],
      },
      {
        title: 'From field to plate, a heritage to discover',
        accent: 'a heritage to discover',
        paras: [
          'The Togolese participation highlighted the knowledge and practices attached to local produce.',
          'Beyond their nutritional value, these cereals and tubers tell of the growers’ gestures, of culinary traditions and of the moments shared around a meal.',
          'The pavilion thus opened a window onto Togo, its resources and the links between food and development.',
        ],
      },
    ],
    momentsTitle: 'Togo’s National Day',
    momentsAccent: 'National Day',
    moments: [
      {
        date: '21 August 2015',
        title: 'Togo in the spotlight',
        paras: [
          'Togo’s National Day was opened by Faure Gnassingbé, then President of the Republic, with a visit to the Togolese pavilion.',
          'The occasion presented the country’s agricultural potential and recalled the importance of farming in the face of food challenges.',
          'The announced programme combined a parade, tastings of local dishes, cultural performances, fashion shows and music, notably with the artist Jimmy Hope.',
        ],
      },
    ],
    after: [
      {
        title: 'Food as a bond between peoples',
        accent: 'a bond between peoples',
        paras: [
          'In Milan, Togo set its participation within a global question: how can populations be fed while making the most of each territory’s resources and know-how?',
          'Its farm produce and food traditions gave that ambition a tangible face, turning the discovery of the country into an experience of encounter and sharing.',
        ],
      },
    ],
    galleryTitle: 'Milan in pictures',
    galleryAccent: 'in pictures',
    galleryPara: 'Discover the Togolese pavilion, the produce on show and the highlights of Togo’s National Day.',
  },
  ja: {
    city: 'ミラノ',
    kicker: 'ミラノ国際博覧会2015 · イタリア',
    dates: '2015年5月1日 — 10月31日',
    title: 'ミラノのトーゴ：恵みの大地、分かち合う技',
    accent: '分かち合う技',
    lead: 'ミラノ国際博覧会でトーゴは、農の豊かさと食の伝統を紹介しました。大地の産物、人々の技、そして食料安全保障への貢献に触れていただく機会です。',
    themeExpo: '地球に食料を、生命にエネルギーを',
    themeTogo: 'トーゴの人々の食料・栄養の安全保障に穀物と根菜が果たす役割',
    facts: [
      { v: '07', l: '紹介された穀物と根菜' },
      { v: 'クラスター', l: '「穀物と根菜」' },
    ],
    blocks: [
      {
        title: '穀物と根菜に捧げられたパビリオン',
        accent: '穀物と根菜',
        paras: [
          '「穀物と根菜」クラスターに置かれたトーゴ館では、国の食を支える産物 — トウモロコシ、米、ソルガム、ミレット、フォニオ、ヤムイモ、キャッサバ — が紹介されました。',
          '来場者は、作物、栽培の方法、そしてこれらの産物を日々の食卓に欠かせないものにしているレシピに触れました。',
          'この道筋を通して、トーゴは農業と料理と文化が出会う遺産を分かち合いました。',
        ],
      },
      {
        title: '畑から皿へ、受け継がれてきたもの',
        accent: '受け継がれてきたもの',
        paras: [
          'トーゴの参加は、地元の産物にまつわる知識と実践に光を当てました。',
          '栄養としての価値を超えて、これらの穀物と根菜は、生産者の手仕事、料理の伝統、食卓を囲むひとときを物語ります。',
          'パビリオンは、トーゴという国と、その資源、そして食と開発のつながりへの窓を開きました。',
        ],
      },
    ],
    momentsTitle: 'トーゴ・ナショナルデー',
    momentsAccent: 'ナショナルデー',
    moments: [
      {
        date: '2015年8月21日',
        title: 'トーゴが主役の一日',
        paras: [
          'ナショナルデーは、当時の大統領フォール・ニャシンベによるトーゴ館の訪問で幕を開けました。',
          'この日は国の農業の可能性を示し、食料をめぐる課題に対する農業の重要性を改めて伝えました。',
          '発表された内容は、パレード、郷土料理の試食、文化公演、ファッションショー、そしてアーティストJimmy Hopeらによる音楽でした。',
        ],
      },
    ],
    after: [
      {
        title: '人びとを結ぶ食',
        accent: '人びとを結ぶ',
        paras: [
          'ミラノでトーゴは、世界共通の問いに参加を重ねました。各地の資源と技を活かしながら、どのように人々を養うのか。',
          '農産物と食の伝統はその問いに具体的な姿を与え、国を知ることを出会いと分かち合いの経験に変えました。',
        ],
      },
    ],
    galleryTitle: '写真で振り返るミラノ',
    galleryAccent: '写真で',
    galleryPara: 'トーゴ館、紹介された産物、そしてナショナルデーのハイライトをご覧ください。',
  },
};

const shanghai: ArchiveEdition = {
  slug: 'shanghai-2010',
  year: 2010,
  image: '/design/ed-shanghai.jpg',
  imageAlt: 'Pavillon de la Chine — Expo Shanghai 2010',
  fr: {
    city: 'Shanghai',
    kicker: 'Expo Shanghai 2010 · Chine',
    dates: '1er mai — 31 octobre 2010',
    title: 'Le Togo à Shanghai : Lomé, une ville à découvrir, un avenir à construire',
    accent: 'un avenir à construire',
    lead: 'À l’Exposition universelle de Shanghai, le Togo a placé les enjeux urbains au cœur de sa participation. À travers Lomé, sa capitale, le pays invitait les visiteurs à découvrir son identité et ses ambitions pour des villes plus agréables à vivre et plus dynamiques.',
    themeExpo: 'Une ville meilleure, une vie meilleure',
    themeTogo: 'Prospérité de l’économie urbaine',
    facts: [
      { v: '250 m²', l: 'surface du pavillon' },
      { v: 'Zone C', l: 'pavillon collectif de l’Afrique' },
    ],
    blocks: [
      {
        title: 'Un pavillon ouvert sur les transformations de Lomé',
        accent: 'les transformations de Lomé',
        paras: [
          'Installé dans le pavillon collectif de l’Afrique, en zone C, l’espace togolais occupait une superficie de 250 m².',
          'Son parcours mettait en perspective le passé, le présent et l’avenir de Lomé. Il présentait les transformations urbaines et les projets destinés à améliorer les infrastructures, l’assainissement et les conditions de vie.',
          'À travers cette présentation, le Togo partageait une ambition : faire de la ville un espace de développement économique, de création d’emplois et de bien-être pour ses habitants.',
        ],
      },
    ],
    momentsTitle: 'La Journée nationale du Togo',
    momentsAccent: 'Journée nationale',
    moments: [
      {
        date: '20 août 2010',
        title: 'Le Togo et la Chine côte à côte',
        paras: [
          'Le 20 août, le Togo a célébré sa Journée nationale à l’exposition en présence de Faure Gnassingbé, alors président de la République, et du ministre chinois des Affaires étrangères, Yang Jiechi.',
          'Ce rendez-vous a mis à l’honneur le pays et sa participation. Il a également donné lieu à des échanges sur les relations entre le Togo et la Chine et sur leur volonté de renforcer la coopération bilatérale.',
        ],
      },
    ],
    after: [
      {
        title: 'La culture togolaise à la rencontre des visiteurs',
        accent: 'à la rencontre des visiteurs',
        paras: [
          'La participation togolaise associait la présentation des projets urbains à la découverte des expressions culturelles du pays.',
          'Le programme annoncé prévoyait la présence de douze mannequins pour accueillir les visiteurs et mettre en valeur des tenues traditionnelles togolaises et africaines, ainsi que des prestations de la troupe de ballet Ziguidi.',
          'Une manière de faire découvrir le Togo à travers ses villes, mais aussi ses créations, ses rythmes et ses talents.',
        ],
      },
      {
        title: 'Imaginer une meilleure vie en ville',
        accent: 'une meilleure vie en ville',
        paras: [
          'À Shanghai, le Togo a inscrit son parcours dans une réflexion internationale sur l’avenir des villes.',
          'Sa participation invitait à considérer le développement urbain dans toutes ses dimensions : les infrastructures, les activités économiques, la qualité de vie et la préservation de l’identité culturelle.',
        ],
      },
    ],
    galleryTitle: 'Revivre Shanghai en images',
    galleryAccent: 'en images',
    galleryPara: 'Le pavillon, la Journée nationale et les animations culturelles, retrouvés en photographies.',
  },
  en: {
    city: 'Shanghai',
    kicker: 'Expo Shanghai 2010 · China',
    dates: '1 May — 31 October 2010',
    title: 'Togo in Shanghai: Lomé, a city to discover, a future to build',
    accent: 'a future to build',
    lead: 'At the Shanghai World Expo, Togo placed urban questions at the heart of its participation. Through Lomé, its capital, the country invited visitors to discover its identity and its ambitions for cities that are more liveable and more dynamic.',
    themeExpo: 'Better City, Better Life',
    themeTogo: 'Prosperity of the urban economy',
    facts: [
      { v: '250 m²', l: 'pavilion floor area' },
      { v: 'Zone C', l: 'joint African pavilion' },
    ],
    blocks: [
      {
        title: 'A pavilion open onto the transformation of Lomé',
        accent: 'the transformation of Lomé',
        paras: [
          'Set inside the joint African pavilion, in zone C, the Togolese space covered an area of 250 m².',
          'Its route put the past, present and future of Lomé in perspective. It presented the city’s transformations and the projects meant to improve infrastructure, sanitation and living conditions.',
          'Through this presentation, Togo shared one ambition: to make the city a space of economic development, job creation and well-being for its inhabitants.',
        ],
      },
    ],
    momentsTitle: 'Togo’s National Day',
    momentsAccent: 'National Day',
    moments: [
      {
        date: '20 August 2010',
        title: 'Togo and China side by side',
        paras: [
          'On 20 August, Togo celebrated its National Day at the Expo in the presence of Faure Gnassingbé, then President of the Republic, and of the Chinese Minister of Foreign Affairs, Yang Jiechi.',
          'The occasion honoured the country and its participation. It also gave rise to exchanges on relations between Togo and China and on their wish to strengthen bilateral cooperation.',
        ],
      },
    ],
    after: [
      {
        title: 'Togolese culture meeting its visitors',
        accent: 'meeting its visitors',
        paras: [
          'The Togolese participation paired the presentation of urban projects with a discovery of the country’s cultural expressions.',
          'The announced programme featured twelve models welcoming visitors and showcasing traditional Togolese and African dress, along with performances by the Ziguidi ballet company.',
          'A way of making Togo known through its cities, but also through its creations, its rhythms and its talents.',
        ],
      },
      {
        title: 'Imagining a better life in the city',
        accent: 'a better life in the city',
        paras: [
          'In Shanghai, Togo set its participation within an international reflection on the future of cities.',
          'It invited visitors to consider urban development in all its dimensions: infrastructure, economic activity, quality of life and the preservation of cultural identity.',
        ],
      },
    ],
    galleryTitle: 'Shanghai in pictures',
    galleryAccent: 'in pictures',
    galleryPara: 'The pavilion, the National Day and the cultural performances, seen again in photographs.',
  },
  ja: {
    city: '上海',
    kicker: '上海国際博覧会2010 · 中国',
    dates: '2010年5月1日 — 10月31日',
    title: '上海のトーゴ：ロメ、知るべき街、築くべき未来',
    accent: '築くべき未来',
    lead: '上海国際博覧会でトーゴは、都市の課題を参加の中心に据えました。首都ロメを通して、国のかたちと、より住みやすく活気ある都市への意欲を紹介しました。',
    themeExpo: 'より良い都市、より良い生活',
    themeTogo: '都市経済の繁栄',
    facts: [
      { v: '250 m²', l: 'パビリオンの面積' },
      { v: 'ゾーンC', l: 'アフリカ共同館' },
    ],
    blocks: [
      {
        title: 'ロメの変化に開かれたパビリオン',
        accent: 'ロメの変化',
        paras: [
          'ゾーンCのアフリカ共同館に置かれたトーゴの空間は、250平方メートルの広さを占めていました。',
          '展示はロメの過去・現在・未来を並べ、都市の変化と、インフラ・衛生・生活環境の改善を目指す事業を紹介しました。',
          'そこでトーゴが分かち合ったのは一つの志です。都市を、経済の発展と雇用の創出、そして住民の幸福の場にすること。',
        ],
      },
    ],
    momentsTitle: 'トーゴ・ナショナルデー',
    momentsAccent: 'ナショナルデー',
    moments: [
      {
        date: '2010年8月20日',
        title: 'トーゴと中国、肩を並べて',
        paras: [
          '8月20日、トーゴは当時の大統領フォール・ニャシンベと中国の楊潔篪外交部長を迎え、会場でナショナルデーを祝いました。',
          'この日は国と参加に光を当てるとともに、トーゴと中国の関係、そして二国間協力の強化に向けた対話の機会となりました。',
        ],
      },
    ],
    after: [
      {
        title: '来場者と出会うトーゴの文化',
        accent: 'トーゴの文化',
        paras: [
          'トーゴの参加は、都市事業の紹介と国の文化表現の発見を結びつけていました。',
          '発表された内容では、12名のモデルが来場者を迎え、トーゴとアフリカの伝統衣装を披露し、バレエ団Ziguidiの公演も行われる予定でした。',
          '都市を通して、そして創作とリズムと才能を通して、トーゴを知ってもらうための構成です。',
        ],
      },
      {
        title: '都市でのより良い暮らしを思い描く',
        accent: 'より良い暮らし',
        paras: [
          '上海でトーゴは、都市の未来をめぐる国際的な議論に自らの歩みを重ねました。',
          'インフラ、経済活動、生活の質、そして文化的アイデンティティの保全 — 都市開発をあらゆる側面から考えることを促す参加でした。',
        ],
      },
    ],
    galleryTitle: '写真で振り返る上海',
    galleryAccent: '写真で',
    galleryPara: 'パビリオン、ナショナルデー、文化公演を写真でご覧ください。',
  },
};

const hanovre: ArchiveEdition = {
  slug: 'hanovre-2000',
  year: 2000,
  image: '/design/ed-hanovre.jpg',
  imageAlt: 'Site de l’Exposition universelle de Hanovre 2000',
  fr: {
    city: 'Hanovre',
    kicker: 'Expo Hanovre 2000 · Allemagne',
    dates: '1er juin — 31 octobre 2000',
    title: 'Le Togo à Hanovre : l’eau au service de la vie',
    accent: 'l’eau au service de la vie',
    lead: 'À l’Exposition universelle de Hanovre, le Togo a mis en lumière un enjeu essentiel au développement des populations : l’accès à une eau suffisamment propre et disponible pour répondre aux besoins alimentaires et sanitaires. Dans une exposition placée sous le thème « Homme, Nature, Technologie », la participation togolaise présentait des solutions locales et invitait les visiteurs à découvrir une partie du patrimoine national.',
    themeExpo: 'Homme, Nature, Technologie',
    themeTogo: 'Nutrition et santé au Togo par le biais d’un approvisionnement en eau suffisamment propre',
    facts: [
      { v: '100 m²', l: 'surface du pavillon' },
      { v: 'Hall 12', l: 'Hall de l’Afrique' },
    ],
    blocks: [
      {
        title: 'L’eau, fil conducteur de la participation togolaise',
        accent: 'fil conducteur',
        paras: [
          'Le Togo avait choisi pour thème : « Nutrition et santé au Togo par le biais d’un approvisionnement en eau suffisamment propre ».',
          'Ce choix reliait la gestion de l’eau à des besoins concrets : soutenir la production agricole, contribuer à l’alimentation et préserver la santé. Il donnait une traduction pratique au thème général de l’exposition, en associant les ressources naturelles, les solutions techniques et les conditions de vie.',
        ],
      },
      {
        title: 'Des équipements et des savoir-faire locaux',
        accent: 'savoir-faire locaux',
        paras: [
          'Installé dans le Hall de l’Afrique, au sein du hall 12, le pavillon togolais occupait une superficie de 100 m².',
          'Les visiteurs pouvaient y découvrir des équipements liés au captage et à l’utilisation de l’eau, principalement fabriqués au Togo. Cette présentation mettait en valeur les capacités locales à développer des installations répondant aux besoins du territoire.',
          'Une représentation artistique du cycle de l’eau complétait le parcours. Elle expliquait notamment pourquoi les forages jouent un rôle important dans l’approvisionnement et l’irrigation de certaines régions arides d’Afrique.',
        ],
      },
      {
        title: 'Une rencontre avec l’histoire du pays',
        accent: 'l’histoire du pays',
        paras: [
          'Le parcours ne se limitait pas aux équipements techniques. Des objets prêtés par le musée de Lomé apportaient un éclairage sur l’histoire du Togo.',
          'Cette présence patrimoniale permettait aux visiteurs de découvrir le pays sous plusieurs angles : ses ressources, ses savoir-faire et sa mémoire. Elle associait la présentation de solutions utiles à la découverte d’une identité nationale.',
        ],
      },
    ],
    momentsTitle: 'La Journée nationale du Togo',
    momentsAccent: 'Journée nationale',
    moments: [
      {
        date: '25 octobre 2000',
        title: 'Un repère de la participation',
        paras: [
          'La Journée nationale du Togo était fixée au 25 octobre 2000, quelques jours avant la clôture de l’exposition.',
          'Cette date constitue l’un des repères de la participation togolaise à Hanovre, aux côtés du thème national et du parcours présenté dans le pavillon.',
        ],
      },
    ],
    after: [
      {
        title: 'Une étape de la présence togolaise aux expositions internationales',
        accent: 'présence togolaise',
        paras: [
          'À Hanovre, le Togo a partagé une approche concrète du développement : partir d’une ressource essentielle, montrer ses usages et présenter les solutions permettant de mieux répondre aux besoins des populations.',
          'Cette participation témoigne d’un dialogue entre environnement, technologie et patrimoine, avec l’eau comme lien entre l’alimentation, la santé et la vie quotidienne.',
        ],
      },
    ],
    galleryTitle: 'Revivre Hanovre en images',
    galleryAccent: 'en images',
    galleryPara: 'Le pavillon, les équipements présentés et les objets du musée de Lomé, retrouvés en photographies.',
  },
  en: {
    city: 'Hanover',
    kicker: 'Expo Hanover 2000 · Germany',
    dates: '1 June — 31 October 2000',
    title: 'Togo in Hanover: water in the service of life',
    accent: 'water in the service of life',
    lead: 'At the Hanover World Expo, Togo highlighted an issue essential to the development of its people: access to water clean enough and plentiful enough to meet food and health needs. In an exhibition held under the theme “Humankind, Nature, Technology”, the Togolese participation presented local solutions and invited visitors to discover part of the national heritage.',
    themeExpo: 'Humankind, Nature, Technology',
    themeTogo: 'Nutrition and health in Togo through a supply of sufficiently clean water',
    facts: [
      { v: '100 m²', l: 'pavilion floor area' },
      { v: 'Hall 12', l: 'Hall of Africa' },
    ],
    blocks: [
      {
        title: 'Water, the thread of the Togolese participation',
        accent: 'the thread',
        paras: [
          'Togo had chosen as its theme: “Nutrition and health in Togo through a supply of sufficiently clean water”.',
          'That choice tied water management to concrete needs: supporting farm production, contributing to food supply and protecting health. It gave a practical reading of the Expo’s general theme, bringing together natural resources, technical solutions and living conditions.',
        ],
      },
      {
        title: 'Locally made equipment and know-how',
        accent: 'know-how',
        paras: [
          'Set in the Hall of Africa, within hall 12, the Togolese pavilion covered an area of 100 m².',
          'Visitors could discover equipment for collecting and using water, mostly manufactured in Togo. The display highlighted local capacity to develop installations answering the needs of the territory.',
          'An artistic representation of the water cycle completed the route. It explained in particular why boreholes play an important role in supply and irrigation in some arid regions of Africa.',
        ],
      },
      {
        title: 'An encounter with the country’s history',
        accent: 'the country’s history',
        paras: [
          'The route was not limited to technical equipment. Objects on loan from the museum of Lomé shed light on the history of Togo.',
          'This heritage presence allowed visitors to discover the country from several angles: its resources, its know-how and its memory. It paired useful solutions with the discovery of a national identity.',
        ],
      },
    ],
    momentsTitle: 'Togo’s National Day',
    momentsAccent: 'National Day',
    moments: [
      {
        date: '25 October 2000',
        title: 'A landmark of the participation',
        paras: [
          'Togo’s National Day was set for 25 October 2000, a few days before the Expo closed.',
          'That date stands as one of the landmarks of the Togolese participation in Hanover, alongside the national theme and the route presented in the pavilion.',
        ],
      },
    ],
    after: [
      {
        title: 'One step in Togo’s presence at international exhibitions',
        accent: 'Togo’s presence',
        paras: [
          'In Hanover, Togo shared a concrete approach to development: start from an essential resource, show its uses and present the solutions that better answer people’s needs.',
          'This participation bears witness to a dialogue between environment, technology and heritage, with water as the link between food, health and daily life.',
        ],
      },
    ],
    galleryTitle: 'Hanover in pictures',
    galleryAccent: 'in pictures',
    galleryPara: 'The pavilion, the equipment on display and the objects from the museum of Lomé, seen again in photographs.',
  },
  ja: {
    city: 'ハノーファー',
    kicker: 'ハノーファー国際博覧会2000 · ドイツ',
    dates: '2000年6月1日 — 10月31日',
    title: 'ハノーファーのトーゴ：生命のための水',
    accent: '生命のための水',
    lead: 'ハノーファー国際博覧会でトーゴは、人々の開発に欠かせない課題に光を当てました。食と健康の必要を満たすだけの、清潔で十分な水へのアクセスです。「人間・自然・技術」をテーマとする博覧会で、トーゴは地域に根ざした解決策を示し、国の遺産の一端を紹介しました。',
    themeExpo: '人間・自然・技術',
    themeTogo: '十分に清潔な水の供給によるトーゴの栄養と健康',
    facts: [
      { v: '100 m²', l: 'パビリオンの面積' },
      { v: 'ホール12', l: 'アフリカ・ホール' },
    ],
    blocks: [
      {
        title: '参加の縦糸となった水',
        accent: '縦糸',
        paras: [
          'トーゴが選んだテーマは「十分に清潔な水の供給によるトーゴの栄養と健康」でした。',
          'この選択は、水の管理を具体的な必要 — 農業生産を支え、食を担い、健康を守ること — に結びつけました。自然資源、技術的な解決策、生活環境を重ね合わせ、博覧会の総合テーマに実践的な答えを与えたのです。',
        ],
      },
      {
        title: '地元でつくられた設備と技',
        accent: '設備と技',
        paras: [
          'ホール12のアフリカ・ホールに置かれたトーゴ館は、100平方メートルの広さを占めていました。',
          '来場者は、主にトーゴで製造された取水と利水の設備を見ることができました。土地の必要に応える設備を自ら生み出す力を示す展示です。',
          '水循環の芸術的な表現も展示を補い、アフリカの乾燥地域において井戸が給水と灌漑に果たす役割を説明しました。',
        ],
      },
      {
        title: '国の歴史との出会い',
        accent: '国の歴史',
        paras: [
          '展示は技術的な設備だけにとどまりませんでした。ロメ博物館から貸与された品々が、トーゴの歴史に光を当てました。',
          'この遺産の存在により、来場者は資源、技、そして記憶という複数の角度から国を知ることができました。有用な解決策の提示と、国のアイデンティティの発見とが結びついたのです。',
        ],
      },
    ],
    momentsTitle: 'トーゴ・ナショナルデー',
    momentsAccent: 'ナショナルデー',
    moments: [
      {
        date: '2000年10月25日',
        title: '参加の節目',
        paras: [
          'トーゴのナショナルデーは、閉幕の数日前にあたる2000年10月25日に定められていました。',
          'この日付は、国のテーマとパビリオンの展示とともに、ハノーファーにおけるトーゴの参加の節目のひとつです。',
        ],
      },
    ],
    after: [
      {
        title: '国際博覧会におけるトーゴの歩みの一歩',
        accent: 'トーゴの歩み',
        paras: [
          'ハノーファーでトーゴが示したのは、具体的な開発の考え方でした。欠かせない資源から出発し、その用い方を見せ、人々の必要により良く応える解決策を提示すること。',
          'この参加は、環境・技術・遺産の対話を物語ります。水が、食と健康と日々の暮らしを結ぶものとして。',
        ],
      },
    ],
    galleryTitle: '写真で振り返るハノーファー',
    galleryAccent: '写真で',
    galleryPara: 'パビリオン、展示された設備、ロメ博物館の品々を写真でご覧ください。',
  },
};

export const ARCHIVES: Record<ArchiveSlug, ArchiveEdition> = {
  'osaka-2025': osaka,
  'dubai-2021': dubai,
  'milan-2015': milan,
  'shanghai-2010': shanghai,
  'hanovre-2000': hanovre,
};

/** Contenu d'une édition dans une langue. */
export function archiveContent(slug: ArchiveSlug, lang: Lang): ArchiveContent {
  return lang === 'sr' ? ARCHIVES_SR[slug] : ARCHIVES[slug][lang];
}

/** Les autres participations, pour le pied de page de l'édition. */
export function otherArchives(slug: ArchiveSlug): ArchiveEdition[] {
  return ARCHIVE_SLUGS.filter((s) => s !== slug).map((s) => ARCHIVES[s]);
}
