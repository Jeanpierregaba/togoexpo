# 52 — Suivi d'activité : audience (Umami) + journal WordPress (Simple History)

## Demande
Un suivi d'activité complet de la plateforme. Choix validés : les deux volets,
Umami auto-hébergé pour l'audience.

## Audience — Umami 3.4.1 (auto-hébergé)
- `deploy/docker-compose.yml` : services `umami` et `umami-db` (PostgreSQL 16).
  Secrets `UMAMI_DB_PASSWORD`, `UMAMI_APP_SECRET` dans `deploy/.env`.
- `deploy/Caddyfile` :
  - tableau de bord sur `STATS_DOMAIN` (stats.togoexpo.org, DNS A à créer) ;
  - `togoexpo.org/_a/script.js` et `/_a/api/send` relayés vers Umami (mesure
    servie par le site lui-même ; rien d'autre d'Umami n'est exposé ici).
- Front : `src/lib/analytics.ts` (identifiant du site, `track()`),
  `src/components/Analytics.tsx` chargé dans le layout. Mesure seulement sur
  togoexpo.org (`data-domains`).
- Événements :
  `telechargement` (fichier), `lien-sortant` (site, url), `contact-email`,
  `contact-telephone`, `formulaire-contact` (motif), `inscription-newsletter`,
  `documentaire-lecture` (version), `documentaire-version` (version).
- Sans cookies, IP non conservée : pas de bannière de consentement. Section
  « Mesure d'audience » ajoutée aux mentions légales (FR, EN, JA).

## Journal WordPress — Simple History
Plugin gratuit (wordpress.org) : connexions, contenus créés / modifiés /
supprimés, médias, menus, réglages, utilisateurs, plugins. Ajouté à
`wp/plugins.txt`, installé par WP-CLI sur le serveur.

## Vérif
`npm run audit` ; après déploiement : script et collecte en 200 via /_a/,
événement visible dans Umami ; journal visible dans WordPress.
