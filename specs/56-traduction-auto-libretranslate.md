# 56 — Brouillon anglais automatique (LibreTranslate)

## Demande
Traduire automatiquement en anglais les nouveaux articles, avec un service
hébergé sur le VPS, et les proposer en brouillon à relire.

## Mise en place
- `deploy/docker-compose.yml` : service `translate` (LibreTranslate v1.9.6),
  réseau interne seulement, français et anglais chargés, 2 Go de mémoire au plus,
  modèles conservés dans le volume `translate_models`.
- `wp/mu-plugins/togoexpo-translate.php` : à la première publication d'un
  article français sans version anglaise, tâche WP-Cron qui crée le brouillon
  anglais (slug `<slug-fr>-en`, même date, image, catégories anglaises, lien
  Polylang) ; avertissement « traduction automatique » dans l'éditeur.
- Commande : `docker compose run --rm wpcli togoexpo translate <id> [--dry-run]`.

## Vérif
Service en bonne santé, traduction d'essai (`--dry-run`) d'un article existant.
