import type { ArchiveEdition } from '@/lib/archives';

/**
 * Osaka 2025, racontée d'après le « Rapport général de la participation du
 * Togo à l'Exposition universelle Osaka 2025 » du Comité National Permanent
 * (140 pages).
 *
 * **Ce qui est repris.** Le thème et ses objectifs, le pavillon et son
 * parcours, la vie quotidienne, les temps forts datés, les chiffres de
 * fréquentation, les témoignages et le bilan.
 *
 * **Ce qui ne l'est pas.** Le rapport est un document de travail : il contient
 * aussi le budget, les difficultés rencontrées, les incidents de voyage, la
 * comparaison avec les pays voisins et le tableau nominatif des missions. Rien
 * de cela n'a sa place sur une page publique ; ces parties sont laissées de
 * côté, et les particuliers cités dans le rapport ne sont pas nommés ici.
 *
 * Les dix-neuf photographies de la mini-médiathèque sont légendées par la
 * scène qu'elles montrent, dans l'ordre du récit.
 */
export const osaka: ArchiveEdition = {
  slug: 'osaka-2025',
  year: 2025,
  image: '/design/osaka/parade-grand-anneau.jpg',
  imageAlt: 'Parade togolaise sous le Grand Anneau de l’Expo 2025 Osaka',
  photos: [
    { src: '/design/osaka/parade-grand-anneau.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/echassiers.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/lever-drapeaux.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/discours-togo.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/discours-japon.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/concert.jpg', w: 1066, h: 1600 },
    { src: '/design/osaka/nunana-scene.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/nunana-percussions.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/final-batakali.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/public-drapeaux.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/echange-cadeaux.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/batakali-offert.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/photo-officielle.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/pavillon-panneaux.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/pavillon-equipe.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/scene-ouverte.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/tambours-nuit.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/public-nuit.jpg', w: 1600, h: 1066 },
    { src: '/design/osaka/reunion-participants.jpg', w: 1600, h: 1200 },
  ],
  // Parade, final de la Journée nationale, tambours de nuit, public.
  heroSlides: [0, 8, 16, 9],
  // Panneaux du pavillon, équipe et visiteur, (timbres : aucune), photo officielle.
  storyPhotos: [13, 14, null, 12],
  // Seules les photographies dont l'événement est certain sont rattachées à
  // une date : la réunion préparatoire, la scène ouverte du 20 août, la
  // Journée nationale du 21.
  momentPhotos: [[18], [], [], [15, 17], [2, 6, 10], [], [], []],
  strip: [1, 3, 5, 7, 9, 11, 4, 16],
  fr: {
    city: 'Osaka',
    kicker: 'Expo 2025 Osaka, Kansai · Japon',
    dates: '13 avril — 13 octobre 2025',
    title: 'Le Togo à Osaka : sauver des vies, bâtir une croissance qui n’oublie personne',
    accent: 'une croissance qui n’oublie personne',
    lead: 'Pendant six mois, sur l’île de Yumeshima, le Togo a porté à l’Exposition universelle le récit d’un pays qui place la vie humaine au cœur de son développement : couverture santé, filets sociaux, accès à l’énergie et à l’eau. Un pavillon ouvert chaque jour, trois journées phares en août, et un festival dont la coordination lui a été confiée.',
    themeExpo: 'Concevoir la société du futur, imaginer notre vie de demain',
    themeTogo: 'Politique d’inclusion et de protection sociale pour une croissance économique forte',
    facts: [
      { v: '184', l: 'jours d’exposition' },
      { v: 'Commons D', l: 'zone du pavillon' },
      { v: '9 h – 21 h', l: 'ouverture quotidienne' },
    ],
    blocks: [
      {
        title: 'Sauver des vies, un choix qui engage',
        accent: 'un choix qui engage',
        paras: [
          'En réponse à la question posée par l’Exposition, le Togo s’est inscrit dans le sous-thème « Sauver des vies » — compris non comme une urgence sanitaire, mais comme l’action de soustraire les populations aux dangers qui menacent leur existence et leur dignité : la pauvreté, la faim, la marginalisation, le manque d’accès aux soins, à un logement décent ou à une protection sociale.',
          'Ce choix reflète les priorités nationales : la couverture santé universelle, le programme de filets sociaux Novissi, l’électrification rurale, l’accès à l’eau potable et les logements sociaux, inscrits dans la Feuille de route gouvernementale 2025.',
          'Quatre objectifs guidaient la participation : affirmer l’engagement international du Togo, promouvoir un modèle de développement centré sur l’humain, exposer ses innovations sociales, et faire valoir sa culture comme ses opportunités d’investissement.',
        ],
      },
      {
        title: 'Un pavillon vivant, du matin au soir',
        accent: 'vivant',
        paras: [
          'Situé dans la zone Commons D, le pavillon a ouvert au public le 13 avril à 9 h. Photographies et infographies de grand format y montraient les réalisations des programmes sociaux ; des écrans faisaient découvrir les paysages du pays et les visages de ceux que ces politiques ont touchés.',
          'Une équipe de trois personnes basée à Osaka s’y relayait chaque jour sous la supervision du directeur du pavillon, avec l’appui de volontaires japonais mis à disposition par l’organisation pour l’accueil, la traduction et l’orientation.',
          'Les visiteurs pouvaient prendre en main des instruments et des jeux traditionnels, assister à des démonstrations et découvrir le pays dans une projection à 360°. Début août, de nouveaux aménagements ont épuré le parcours et recentré son propos.',
          'Élèves et étudiants, familles, entrepreneurs, délégations officielles : chacun y a trouvé son entrée — la gratuité de l’école primaire pour les uns, le Port autonome de Lomé, l’énergie et le numérique pour les autres.',
        ],
      },
    ],
    sequence: {
      title: 'Un parcours en quatre séquences',
      accent: 'quatre séquences',
      lead: 'Lors de la Journée nationale, le Commissaire général a présenté le pavillon comme une expérience immersive en quatre temps.',
      items: [
        {
          t: 'Le Togo, terre d’accueil et d’avenir',
          d: 'Un pays pacifique, hospitalier et culturellement riche, au carrefour de l’Afrique de l’Ouest, ouvert sur le monde et porté par une jeunesse vibrante.',
        },
        {
          t: 'Un petit pays, de grandes ambitions',
          d: 'Les réformes et les innovations : la digitalisation inclusive avec Novissi, l’électrification solaire rurale avec Cizo, le port de Lomé comme hub logistique régional, une diplomatie de paix.',
        },
        {
          t: 'Quand les politiques deviennent des réalités',
          d: 'Une projection à 360° montre la transformation d’un village togolais par l’accès à l’énergie, à l’éducation et à la santé.',
        },
        {
          t: 'L’au revoir des champions',
          d: 'Artistes, sportifs, créateurs : les figures qui portent les couleurs du Togo à l’international.',
        },
      ],
    },
    momentsTitle: 'Six mois, de l’ouverture à la clôture',
    momentsAccent: 'de l’ouverture à la clôture',
    moments: [
      {
        date: 'Octobre 2022 — janvier 2025',
        title: 'Cinq réunions pour préparer le terrain',
        paras: [
          'Le Togo a pris part aux cinq Réunions internationales des participants organisées par le Bureau International des Expositions et le comité japonais. C’est là que se règlent les questions techniques, logistiques et douanières — et que le pavillon a été calibré sur le sous-thème « Sauver des vies ».',
        ],
      },
      {
        date: '13 avril 2025',
        title: 'Le pavillon ouvre ses portes',
        paras: [
          'Après trois jours d’essai général du site, du 4 au 6 avril, l’Exposition ouvre sur l’île artificielle de Yumeshima. Le pavillon togolais accueille ses premiers visiteurs à 9 h.',
          'Le nom « Togo », qui a un sens en japonais, intrigue : deux visiteurs japonais portant ce nom de famille sont venus le voir.',
        ],
      },
      {
        date: '19 août 2025',
        title: 'La Journée économique',
        paras: [
          'À la Chambre de commerce et d’industrie d’Osaka, une centaine de participants découvrent les opportunités d’investissement au Togo : présentation, panel sur les perspectives économiques, puis rencontres d’affaires prévues pour trente minutes et prolongées jusqu’au cocktail de clôture.',
          'Temps fort de la journée : la signature d’un protocole d’accord entre les chambres de commerce et d’industrie du Togo et d’Osaka, pour échanger des informations et soutenir les entrepreneurs des deux pays.',
        ],
      },
      {
        date: '20 août 2025',
        title: 'La scène ouverte',
        paras: [
          'Sur la scène Pop-up Stage West, la compagnie Nunana et King Mensah présentent le patrimoine artistique togolais. Des volontaires japonais tentent quelques pas de danse aux côtés des artistes, sous les rires et les applaudissements.',
        ],
      },
      {
        date: '21 août 2025',
        title: 'La Journée nationale du Togo',
        paras: [
          'Dès le matin, une parade de danseurs, de tambours et d’échassiers traverse les allées jusqu’au National Day Hall. À 11 h, la cérémonie officielle s’ouvre par les hymnes du Togo et du Japon, devant quelque 500 personnes et les représentants d’une dizaine de pays amis.',
          'Madame Rose Kayi Mivedor-Sambiani, ministre du Commerce, de l’Artisanat et de la Consommation locale et cheffe de la délégation, rappelle une amitié nouée dès 1960. La scène revient ensuite au groupe togolo-japonais Avoudé, à King Mensah, à Nunana et aux échassiers, rejoints par la mascotte Myaku-Myaku et par des Japonais vêtus du batakali.',
        ],
      },
      {
        date: '30 septembre 2025',
        title: 'Le Commons Music Festival',
        paras: [
          'Recommandé pour porter l’organisation des journées des Commons — plus de soixante pays —, le Togo coordonne au Matsuri Arena un festival de musiques et de danses avec le Burkina Faso, la Guinée, Madagascar et la Tunisie, assorti de stands d’artisanat.',
        ],
      },
      {
        date: '11 octobre 2025',
        title: 'Un chêne pour le Togo',
        paras: [
          'L’organisation Forest Civilisation remet symboliquement au Togo le 107e des 130 arbres plantés sur le site, chacun dédié à un pays participant.',
        ],
      },
      {
        date: '13 octobre 2025',
        title: 'La clôture',
        paras: [
          'Après 184 jours, l’Exposition se referme à l’Expo Hall « Shining Hat ». Les drapeaux passent à Riyad 2030, ainsi qu’à Belgrade et Yokohama 2027 — où le Togo a déjà rendez-vous.',
        ],
      },
    ],
    figures: {
      title: 'L’effet des journées nationales, en chiffres',
      accent: 'en chiffres',
      items: [
        { v: '+37,5 %', l: 'de visiteurs par jour au pavillon après les journées nationales' },
        { v: '11 000', l: 'visiteurs quotidiens, contre 8 000 auparavant' },
        { v: '≈ 500', l: 'participants à la Journée nationale' },
        { v: '≈ 120', l: 'participants à la Journée économique' },
        { v: '01', l: 'protocole d’accord entre la CCI-Togo et la CCI d’Osaka' },
        { v: '28 M', l: 'de visiteurs à l’Expo, pour 165 pays et organisations' },
      ],
    },
    voices: [
      {
        quote: 'C’est la première fois que nous voyons ces danses et entendons parler du Togo, c’est fascinant.',
        by: 'Un couple d’Osaka, après le spectacle du 20 août',
      },
      {
        quote:
          'Nous avons particulièrement apprécié le Pavillon du Togo, l’un des rares à situer clairement le pays sur la carte du monde, tout en présentant des informations clés de manière claire et schématique.',
        by: 'Un visiteur français, juillet 2025',
      },
      {
        quote: 'Venez voir. Venez croire. Venez construire avec nous. Bienvenue au Togo.',
        by: 'Le Commissaire général du Togo, Journée nationale',
      },
    ],
    after: [
      {
        title: 'Des timbres de 1970, gardés cinquante ans',
        accent: 'gardés cinquante ans',
        paras: [
          'Parmi les visites les plus marquantes, celle d’un passionné japonais venu présenter une planche de timbres togolais émise pour l’Exposition universelle de 1970 — déjà à Osaka. Il les avait conservés plus de cinquante ans.',
          'Il a raconté leur histoire avec émotion : un geste simple, qui rappelle que les plus petites choses portent parfois les plus grands messages.',
        ],
      },
      {
        title: 'Ce que le Togo rapporte d’Osaka',
        accent: 'd’Osaka',
        paras: [
          'Le Togo s’est présenté comme un pays stable, ambitieux, attaché à l’inclusion sociale et ouvert aux partenariats. L’accord entre chambres de commerce et les contacts d’affaires noués posent des bases concrètes pour les échanges et l’investissement.',
          'Le volet culturel a été un puissant vecteur de diplomatie douce, créant des liens d’amitié et de compréhension mutuelle entre Togolais et Japonais.',
          'L’Exposition a été un point de départ et non une fin : son plein succès se mesurera aux partenariats qui se concrétiseront, et aux prochains rendez-vous — Yokohama et Belgrade, en 2027.',
        ],
      },
    ],
    galleryTitle: 'Osaka en images',
    galleryAccent: 'en images',
    galleryPara:
      'Dix-neuf photographies de la parade, des cérémonies, des concerts et du pavillon. L’album complet est sur Flickr.',
    photoAlts: [
      'Parade togolaise sous le Grand Anneau : échassiers, danseurs et panneaux « Togo »',
      'Échassiers aux couleurs du Togo dans les allées de l’Expo',
      'Lever des drapeaux du Japon et du Togo au National Day Hall',
      'Discours officiel du Togo au pupitre de l’Expo 2025',
      'Discours du représentant japonais au pupitre de l’Expo 2025',
      'Concert sur scène lors des journées du Togo',
      'La compagnie Nunana sur la scène du National Day Hall',
      'Percussionnistes de la compagnie Nunana',
      'Final de la Journée nationale : artistes togolais et Japonais en batakali',
      'Le public agite des drapeaux togolais',
      'Échange de cadeaux entre les délégations togolaise et japonaise',
      'Une tenue batakali offerte à la délégation japonaise',
      'Photographie officielle des deux délégations',
      'Panneaux du pavillon : énergie, agriculture, éducation, santé',
      'L’équipe du pavillon avec un visiteur, autour des instruments traditionnels',
      'La troupe de tambours sur la scène ouverte, de nuit',
      'Tambours et danseurs lors de la prestation du 20 août',
      'Le public de la scène ouverte, à la nuit tombée',
      'La délégation togolaise à la Réunion internationale des participants',
    ],
  },
  en: {
    city: 'Osaka',
    kicker: 'Expo 2025 Osaka, Kansai · Japan',
    dates: '13 April — 13 October 2025',
    title: 'Togo in Osaka: saving lives, building growth that leaves no one behind',
    accent: 'growth that leaves no one behind',
    lead: 'For six months on Yumeshima island, Togo brought to the World Expo the story of a country that puts human life at the heart of its development: health coverage, social safety nets, access to energy and water. A pavilion open every day, three landmark days in August, and a festival it was asked to coordinate.',
    themeExpo: 'Designing Future Society for Our Lives',
    themeTogo: 'A policy of inclusion and social protection for strong economic growth',
    facts: [
      { v: '184', l: 'days of exhibition' },
      { v: 'Commons D', l: 'pavilion zone' },
      { v: '9 am – 9 pm', l: 'open daily' },
    ],
    blocks: [
      {
        title: 'Saving lives, a choice that commits',
        accent: 'a choice that commits',
        paras: [
          'In answer to the question raised by the Expo, Togo placed itself under the sub-theme “Saving Lives” — understood not as a health emergency, but as the act of shielding people from the dangers that threaten their existence and dignity: poverty, hunger, marginalisation, lack of access to care, to decent housing or to social protection.',
          'That choice mirrors national priorities: universal health coverage, the Novissi social safety-net programme, rural electrification, access to drinking water and social housing, all set out in the Government Roadmap 2025.',
          'Four objectives guided the participation: asserting Togo’s international commitment, promoting a people-centred model of development, showcasing its social innovations, and making the case for its culture and its investment opportunities.',
        ],
      },
      {
        title: 'A living pavilion, from morning to night',
        accent: 'living',
        paras: [
          'Set in the Commons D zone, the pavilion opened to the public on 13 April at 9 am. Large-format photographs and infographics showed what the social programmes have achieved; screens revealed the country’s landscapes and the faces of those these policies have reached.',
          'A team of three based in Osaka took turns there every day under the pavilion director’s supervision, supported by Japanese volunteers provided by the organisers for reception, translation and guidance.',
          'Visitors could handle traditional instruments and games, watch demonstrations and discover the country in a 360° projection. In early August, new fittings pared the route down and sharpened its message.',
          'Pupils and students, families, entrepreneurs, official delegations: each found a way in — free primary schooling for some, the Port of Lomé, energy and digital technology for others.',
        ],
      },
    ],
    sequence: {
      title: 'A route in four sequences',
      accent: 'four sequences',
      lead: 'On National Day, the Commissioner General presented the pavilion as an immersive experience in four movements.',
      items: [
        {
          t: 'Togo, a land of welcome and of the future',
          d: 'A peaceful, hospitable and culturally rich country at the crossroads of West Africa, open to the world and carried by a vibrant youth.',
        },
        {
          t: 'A small country, great ambitions',
          d: 'Reforms and innovations: inclusive digitalisation with Novissi, rural solar electrification with Cizo, the port of Lomé as a regional logistics hub, a diplomacy of peace.',
        },
        {
          t: 'When policies become realities',
          d: 'A 360° projection shows a Togolese village transformed by access to energy, education and health.',
        },
        {
          t: 'The champions’ farewell',
          d: 'Artists, athletes, creators: the figures who carry Togo’s colours abroad.',
        },
      ],
    },
    momentsTitle: 'Six months, from opening to closing',
    momentsAccent: 'from opening to closing',
    moments: [
      {
        date: 'October 2022 — January 2025',
        title: 'Five meetings to prepare the ground',
        paras: [
          'Togo took part in all five International Participants Meetings held by the Bureau International des Expositions and the Japanese committee. This is where technical, logistical and customs matters are settled — and where the pavilion was tuned to the “Saving Lives” sub-theme.',
        ],
      },
      {
        date: '13 April 2025',
        title: 'The pavilion opens its doors',
        paras: [
          'After a three-day full test of the site, from 4 to 6 April, the Expo opens on the artificial island of Yumeshima. The Togolese pavilion welcomes its first visitors at 9 am.',
          'The name “Togo”, which has a meaning in Japanese, sparks curiosity: two Japanese visitors bearing it as a family name came to see the pavilion.',
        ],
      },
      {
        date: '19 August 2025',
        title: 'Economic Day',
        paras: [
          'At the Osaka Chamber of Commerce and Industry, around a hundred participants discover investment opportunities in Togo: a presentation, a panel on the economic outlook, then business meetings scheduled for thirty minutes that ran on until the closing reception.',
          'The highlight of the day: the signing of a memorandum of understanding between the chambers of commerce and industry of Togo and Osaka, to exchange information and support entrepreneurs from both countries.',
        ],
      },
      {
        date: '20 August 2025',
        title: 'The open stage',
        paras: [
          'On the Pop-up Stage West, the Nunana company and King Mensah present Togo’s artistic heritage. Japanese volunteers try a few dance steps alongside the artists, to laughter and applause.',
        ],
      },
      {
        date: '21 August 2025',
        title: 'Togo’s National Day',
        paras: [
          'From the morning, a parade of dancers, drums and stilt walkers crosses the avenues to the National Day Hall. At 11 am, the official ceremony opens with the anthems of Togo and Japan, before some 500 people and representatives of a dozen friendly countries.',
          'Ms Rose Kayi Mivedor-Sambiani, Minister of Trade, Crafts and Local Consumption and head of the delegation, recalls a friendship dating back to 1960. The stage then goes to the Togolese-Japanese group Avoudé, King Mensah, Nunana and the stilt walkers, joined by the mascot Myaku-Myaku and by Japanese guests dressed in the batakali.',
        ],
      },
      {
        date: '30 September 2025',
        title: 'The Commons Music Festival',
        paras: [
          'Recommended to lead the organisation of the Commons days — more than sixty countries — Togo coordinates at the Matsuri Arena a festival of music and dance with Burkina Faso, Guinea, Madagascar and Tunisia, along with craft stalls.',
        ],
      },
      {
        date: '11 October 2025',
        title: 'An oak for Togo',
        paras: [
          'The organisation Forest Civilisation symbolically presents Togo with the 107th of the 130 trees planted on the site, each dedicated to a participating country.',
        ],
      },
      {
        date: '13 October 2025',
        title: 'The closing',
        paras: [
          'After 184 days, the Expo closes at the Expo Hall “Shining Hat”. The flags pass to Riyadh 2030, and to Belgrade and Yokohama 2027 — where Togo already has a date.',
        ],
      },
    ],
    figures: {
      title: 'The effect of the national days, in figures',
      accent: 'in figures',
      items: [
        { v: '+37.5%', l: 'daily visitors to the pavilion after the national days' },
        { v: '11,000', l: 'visitors a day, up from 8,000' },
        { v: '≈ 500', l: 'participants on National Day' },
        { v: '≈ 120', l: 'participants on Economic Day' },
        { v: '01', l: 'memorandum between the Togo and Osaka chambers of commerce' },
        { v: '28 M', l: 'Expo visitors, for 165 countries and organisations' },
      ],
    },
    voices: [
      {
        quote: 'It is the first time we have seen these dances and heard about Togo — it is fascinating.',
        by: 'A couple from Osaka, after the 20 August show',
      },
      {
        quote:
          'We particularly appreciated the Togo Pavilion, one of the few to place the country clearly on the world map while presenting key information in a clear, schematic way.',
        by: 'A French visitor, July 2025',
      },
      {
        quote: 'Come and see. Come and believe. Come and build with us. Welcome to Togo.',
        by: 'The Commissioner General of Togo, National Day',
      },
    ],
    after: [
      {
        title: 'Stamps from 1970, kept for fifty years',
        accent: 'kept for fifty years',
        paras: [
          'Among the most memorable visits was that of a Japanese enthusiast who came to show a sheet of Togolese stamps issued for the 1970 World Expo — already in Osaka. He had kept them for more than fifty years.',
          'He told their story with emotion: a simple gesture, and a reminder that the smallest things sometimes carry the greatest messages.',
        ],
      },
      {
        title: 'What Togo brings back from Osaka',
        accent: 'from Osaka',
        paras: [
          'Togo presented itself as a stable, ambitious country, committed to social inclusion and open to partnerships. The agreement between chambers of commerce and the business contacts made lay concrete foundations for trade and investment.',
          'The cultural programme was a powerful vehicle of soft diplomacy, creating bonds of friendship and mutual understanding between Togolese and Japanese people.',
          'The Expo was a starting point, not an end: its full success will be measured by the partnerships that take shape, and at the next gatherings — Yokohama and Belgrade, in 2027.',
        ],
      },
    ],
    galleryTitle: 'Osaka in pictures',
    galleryAccent: 'in pictures',
    galleryPara:
      'Nineteen photographs of the parade, the ceremonies, the concerts and the pavilion. The full album is on Flickr.',
    photoAlts: [
      'Togolese parade under the Grand Ring: stilt walkers, dancers and “Togo” signs',
      'Stilt walkers in Togo’s colours along the Expo avenues',
      'Raising of the flags of Japan and Togo at the National Day Hall',
      'Togo’s official speech at the Expo 2025 lectern',
      'Speech by the Japanese representative at the Expo 2025 lectern',
      'Concert on stage during Togo’s days',
      'The Nunana company on the National Day Hall stage',
      'Drummers of the Nunana company',
      'National Day finale: Togolese artists and Japanese guests in batakali',
      'The audience waving Togolese flags',
      'Exchange of gifts between the Togolese and Japanese delegations',
      'A batakali garment offered to the Japanese delegation',
      'Official photograph of the two delegations',
      'Pavilion panels: energy, agriculture, education, health',
      'The pavilion team with a visitor, around traditional instruments',
      'The drum troupe on the open stage, at night',
      'Drums and dancers during the 20 August performance',
      'The open-stage audience after nightfall',
      'The Togolese delegation at the International Participants Meeting',
    ],
  },
  ja: {
    city: '大阪',
    kicker: '2025年大阪・関西万博 · 日本',
    dates: '2025年4月13日 — 10月13日',
    title: '大阪のトーゴ：いのちを救い、誰も取り残さない成長を築く',
    accent: '誰も取り残さない成長を築く',
    lead: '夢洲での6か月間、トーゴは万博で、人のいのちを開発の中心に置く国の歩みを伝えました。医療保障、社会的セーフティネット、エネルギーと水へのアクセスです。毎日開かれたパビリオン、8月の三つの主要な日、そして運営を任されたフェスティバル。',
    themeExpo: 'いのち輝く未来社会のデザイン',
    themeTogo: '力強い経済成長のための包摂と社会保障の政策',
    facts: [
      { v: '184', l: '会期日数' },
      { v: 'コモンズD', l: 'パビリオンのゾーン' },
      { v: '9時 – 21時', l: '毎日開館' },
    ],
    blocks: [
      {
        title: '「いのちを救う」という選択',
        accent: '選択',
        paras: [
          '万博が投げかけた問いに対し、トーゴはサブテーマ「いのちを救う」に参加しました。それは医療の緊急事態という意味ではなく、貧困、飢え、周縁化、医療や適切な住まい、社会保障へのアクセスの欠如といった、人の生存と尊厳を脅かす危険から人々を守る営みとして捉えられています。',
          'この選択は国の優先課題を映しています。国民皆保険、社会的セーフティネット「ノヴィシ」、農村電化、安全な飲料水へのアクセス、公営住宅 — いずれも「政府ロードマップ2025」に位置づけられた取り組みです。',
          '参加には四つの目的がありました。トーゴの国際的な関与を示すこと、人間中心の開発モデルを発信すること、社会的イノベーションを紹介すること、そして文化と投資機会を伝えることです。',
        ],
      },
      {
        title: '朝から夜まで、生きたパビリオン',
        accent: '生きたパビリオン',
        paras: [
          'コモンズDゾーンに置かれたパビリオンは、4月13日午前9時に一般公開されました。大判の写真とインフォグラフィックが社会政策の成果を示し、スクリーンには国の風景と、その政策が届いた人々の表情が映し出されました。',
          '大阪を拠点とする3名のチームが、パビリオン館長の監督のもと毎日交代で運営にあたり、主催者が派遣した日本人ボランティアが案内、通訳、誘導を支えました。',
          '来場者は伝統楽器や遊びに実際に触れ、実演を見て、360度の映像で国を体験できました。8月初めには新しいしつらえにより、展示がすっきりと整理され、主題がより明確になりました。',
          '児童・学生、家族連れ、事業者、公式代表団 — それぞれが自分の入口を見つけました。ある人には初等教育の無償化、別の人にはロメ自治港、エネルギー、デジタルです。',
        ],
      },
    ],
    sequence: {
      title: '四つの場面からなる展示',
      accent: '四つの場面',
      lead: 'ナショナルデーに、政府代表はパビリオンを四つの場面からなる没入型の体験として紹介しました。',
      items: [
        {
          t: 'トーゴ、歓迎と未来の地',
          d: '西アフリカの十字路に位置する、平和でもてなしの心にあふれ、文化の豊かな国。世界に開かれ、活気ある若者に支えられています。',
        },
        {
          t: '小さな国、大きな志',
          d: '改革とイノベーション — ノヴィシによる包摂的なデジタル化、シゾによる農村の太陽光電化、地域の物流拠点としてのロメ港、平和の外交。',
        },
        {
          t: '政策が現実になるとき',
          d: '360度の映像が、エネルギー・教育・医療へのアクセスによって変わるトーゴの村を映し出します。',
        },
        {
          t: 'チャンピオンたちの見送り',
          d: 'アーティスト、スポーツ選手、クリエイター — トーゴの色を世界で掲げる人々。',
        },
      ],
    },
    momentsTitle: '開幕から閉幕まで、6か月',
    momentsAccent: '6か月',
    moments: [
      {
        date: '2022年10月 — 2025年1月',
        title: '準備を整えた五回の会合',
        paras: [
          'トーゴは、博覧会国際事務局と日本側の組織委員会が開いた五回の国際参加者会議すべてに出席しました。技術、物流、通関の課題が調整される場であり、パビリオンをサブテーマ「いのちを救う」に合わせて練り上げた場でもあります。',
        ],
      },
      {
        date: '2025年4月13日',
        title: 'パビリオン開館',
        paras: [
          '4月4日から6日までの3日間の総合テストを経て、人工島・夢洲で万博が開幕。トーゴ館は午前9時に最初の来場者を迎えました。',
          '日本語でも意味を持つ「トーゴ」という名は関心を集め、同じ響きの姓を持つ日本人来場者が二人訪れました。',
        ],
      },
      {
        date: '2025年8月19日',
        title: '経済デー',
        paras: [
          '大阪商工会議所で、約100名の参加者がトーゴの投資機会に触れました。プレゼンテーション、経済展望に関するパネル、そして30分の予定が閉会レセプションまで続いた商談です。',
          'この日の山場は、トーゴ商工会議所と大阪商工会議所による覚書の署名でした。情報を交換し、両国の事業者を支援するためのものです。',
        ],
      },
      {
        date: '2025年8月20日',
        title: 'オープンステージ',
        paras: [
          'ポップアップステージ西で、ヌナナ舞踊団とキング・メンサーがトーゴの芸術遺産を披露しました。日本人ボランティアもアーティストと並んで踊りに挑戦し、笑いと拍手に包まれました。',
        ],
      },
      {
        date: '2025年8月21日',
        title: 'トーゴ・ナショナルデー',
        paras: [
          '朝から、踊り手、太鼓、竹馬の一行がナショナルデーホールまで会場を練り歩きました。午前11時、トーゴと日本の国歌で公式式典が始まり、約500名と十数か国の友好国の代表が見守りました。',
          '代表団長を務めるローズ・カイ・ミヴェドール＝サンビアニ商業・手工業・国内消費大臣は、1960年に始まった友好の歴史に触れました。続いて舞台は、トーゴと日本の混成グループ「アヴデ」、キング・メンサー、ヌナナ、竹馬の演者へ。公式キャラクターのミャクミャクと、伝統衣装バタカリをまとった日本の人々も加わりました。',
        ],
      },
      {
        date: '2025年9月30日',
        title: 'コモンズ・ミュージック・フェスティバル',
        paras: [
          '60か国以上が参加するコモンズの催しの旗振り役に推されたトーゴは、EXPOアリーナ「Matsuri」で、ブルキナファソ、ギニア、マダガスカル、チュニジアとともに音楽と踊りのフェスティバルを運営しました。工芸品の出店も並びました。',
        ],
      },
      {
        date: '2025年10月11日',
        title: 'トーゴに贈られた一本のナラ',
        paras: [
          '団体「フォレスト・シビリゼーション」が、会場に植えられた130本のうち107本目の木をトーゴに象徴的に贈呈しました。一本一本が参加国に捧げられています。',
        ],
      },
      {
        date: '2025年10月13日',
        title: '閉幕',
        paras: [
          '184日間の会期を終え、万博はEXPOホール「シャインハット」で幕を閉じました。旗は2030年のリヤド、そして2027年のベオグラードと横浜へ — トーゴがすでに参加を決めている場所です。',
        ],
      },
    ],
    figures: {
      title: '数字で見るナショナルデーの効果',
      accent: '数字で見る',
      items: [
        { v: '+37.5%', l: 'ナショナルデー後のパビリオン1日あたり来場者の増加' },
        { v: '11,000', l: '1日あたりの来場者（それ以前は8,000）' },
        { v: '≈ 500', l: 'ナショナルデーの参加者' },
        { v: '≈ 120', l: '経済デーの参加者' },
        { v: '01', l: 'トーゴ商工会議所と大阪商工会議所の覚書' },
        { v: '2,800万', l: '万博の来場者（165の国と機関）' },
      ],
    },
    voices: [
      {
        quote: 'こうした踊りを見るのも、トーゴの話を聞くのも初めてです。とても魅力的です。',
        by: '大阪のご夫婦、8月20日の公演のあとで',
      },
      {
        quote:
          'トーゴ館は特に印象に残りました。世界地図の上で国の位置をはっきり示し、要点を明快に図解している数少ないパビリオンのひとつです。',
        by: 'フランスからの来場者、2025年7月',
      },
      {
        quote: '見に来てください。信じに来てください。ともに築きに来てください。トーゴへようこそ。',
        by: 'トーゴ政府代表、ナショナルデーにて',
      },
    ],
    after: [
      {
        title: '50年守られてきた1970年の切手',
        accent: '1970年の切手',
        paras: [
          '特に心に残る来訪のひとつは、1970年の万博 — これも大阪でした — のために発行されたトーゴの切手シートを見せに来た日本人愛好家でした。50年以上、大切に保管していたのです。',
          '彼は感慨深げにその物語を語りました。ささやかな行為ですが、いちばん小さなものがいちばん大きなメッセージを運ぶことがあると教えてくれます。',
        ],
      },
      {
        title: 'トーゴが大阪から持ち帰るもの',
        accent: '持ち帰るもの',
        paras: [
          'トーゴは、安定し、意欲に満ち、社会的包摂を重んじ、連携に開かれた国として自らを示しました。商工会議所間の合意と築かれた商談の縁は、貿易と投資の具体的な土台となります。',
          '文化の催しはソフト外交の力強い手段となり、トーゴと日本の人々のあいだに友情と相互理解を生みました。',
          '万博は終着点ではなく出発点でした。その成果は、これから形になる連携と、次の舞台 — 2027年の横浜とベオグラード — で測られます。',
        ],
      },
    ],
    galleryTitle: '写真で振り返る大阪',
    galleryAccent: '写真で',
    galleryPara: 'パレード、式典、コンサート、パビリオンの写真19点。アルバム全体はFlickrでご覧いただけます。',
    photoAlts: [
      '大屋根リングの下を進むトーゴのパレード：竹馬、踊り手、「トーゴ」のパネル',
      '会場を歩くトーゴ色の竹馬の演者たち',
      'ナショナルデーホールでの日本とトーゴの国旗掲揚',
      '万博の演台でのトーゴの公式スピーチ',
      '万博の演台での日本側代表のスピーチ',
      'トーゴの日のステージでのコンサート',
      'ナショナルデーホールの舞台に立つヌナナ舞踊団',
      'ヌナナ舞踊団の太鼓奏者たち',
      'ナショナルデーのフィナーレ：トーゴのアーティストとバタカリ姿の日本の人々',
      'トーゴの国旗を振る観客',
      'トーゴと日本の代表団による記念品の交換',
      '日本側代表団に贈られたバタカリ',
      '両代表団の公式記念写真',
      'パビリオンのパネル：エネルギー、農業、教育、医療',
      '伝統楽器を囲むパビリオンのスタッフと来場者',
      '夜のオープンステージに立つ太鼓の一団',
      '8月20日の公演での太鼓と踊り手',
      '日が暮れたオープンステージの観客',
      '国際参加者会議でのトーゴ代表団',
    ],
  },
};
