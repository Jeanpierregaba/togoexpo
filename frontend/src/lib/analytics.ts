/**
 * Mesure d'audience : Umami, auto-hébergé sur le VPS (sans cookies, sans
 * donnée personnelle conservée). Le script et l'envoi des données passent par
 * togoexpo.org/_a/ (Caddy les relaie vers Umami) : rien ne part chez un tiers.
 *
 * L'identifiant du site est public : il figure de toute façon dans la page.
 */
export const UMAMI_WEBSITE_ID = 'ea49070f-7dd5-4819-9e9c-c98bae50d868';
export const UMAMI_PATH = '/_a';
/** Seul le site en production est mesuré (ni le local, ni les aperçus). */
export const UMAMI_DOMAINS = 'togoexpo.org';

type Props = Record<string, string | number | boolean>;
type Umami = { track: (event: string, data?: Props) => void };

/** Envoie un événement nommé ; sans effet si le script n'est pas chargé. */
export function track(event: string, data?: Props) {
  if (typeof window === 'undefined') return;
  (window as Window & { umami?: Umami }).umami?.track(event, data);
}
