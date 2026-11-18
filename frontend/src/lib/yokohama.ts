// Visuels de la participation du Togo à GREEN×EXPO 2027 Yokohama.
// Les libellés vivent dans le dictionnaire (`yokohama`), seuls les chemins sont ici.

export const YOKOHAMA_IMG = {
  baobab: '/design/yokohama/baobab.jpg',
  hysope: '/design/yokohama/hysope.jpg',
  phyllanthus: '/design/yokohama/phyllanthus.jpg',
  cafe: '/design/yokohama/cafe.jpg',
  cacao: '/design/yokohama/cacao.jpg',
  koutammakou: '/design/yokohama/koutammakou.jpg',
  pavillon: '/design/yokohama/pavillon-concept.jpg',
  logo: '/design/yokohama/logo-togo-expo-yokohama.webp',
} as const;

/**
 * Binômes latins des cinq plantes, dans l'ordre de `dict.yokohama.plants`.
 * Ils ne vivent pas au dictionnaire : la nomenclature botanique est la même
 * dans les trois langues.
 *
 * Le café togolais est massivement du robusta, d'où `Coffea canephora` ; la
 * plaquette technique ne précise pas l'espèce, à confirmer si de l'arabica
 * entre dans le récit.
 */
export const YOKOHAMA_LATIN = [
  'Adansonia digitata',
  'Hoslundia opposita',
  'Phyllanthus amarus',
  'Coffea canephora',
  'Theobroma cacao',
] as const;

/** Ordre des cinq plantes de l'herbier, aligné sur `dict.yokohama.plants`. */
export const YOKOHAMA_PLANTS = [
  YOKOHAMA_IMG.baobab,
  YOKOHAMA_IMG.hysope,
  YOKOHAMA_IMG.phyllanthus,
  YOKOHAMA_IMG.cafe,
  YOKOHAMA_IMG.cacao,
] as const;

/**
 * Plaquettes d'information des plantes de savoirs, à déposer dans
 * `public/documents/`. `null` tant que le fichier n'est pas fourni : le bouton
 * s'affiche alors inactif, avec la mention « bientôt disponible ».
 */
export const YOKOHAMA_BROCHURES: Record<'baobab' | 'hysope' | 'phyllanthus', string | null> = {
  baobab: null,
  hysope: null,
  phyllanthus: null,
};

/** Ouverture officielle de GREEN×EXPO 2027 (compte à rebours). */
export const YOKOHAMA_OPENING = '2027-03-19T10:00:00+09:00';
