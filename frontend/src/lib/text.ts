/** Normalisation pour la recherche : minuscules et sans accents, pour qu'« evenements »
 *  trouve « évènements ». Partagée par la FAQ de l'accueil et la liste des actualités. */
export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
