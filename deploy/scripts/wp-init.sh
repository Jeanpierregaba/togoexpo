#!/usr/bin/env sh
# Installe et configure le WordPress de production (relançable sans risque).
# Sur le serveur, dans deploy/ : sh scripts/wp-init.sh
#
# Installe WordPress en français, les extensions du CMS headless (WPGraphQL,
# Polylang, WPGraphQL Polylang, importeur WordPress), les permaliens, et crée
# les langues FR (par défaut), EN et JA si elles n'existent pas encore.
set -eu
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a

cli() { docker compose run --rm -T wpcli "$@"; }

echo "== Démarrage de WordPress =="
docker compose up -d db wordpress
i=0
until docker compose exec -T wordpress test -f /var/www/html/wp-config.php 2>/dev/null; do
  i=$((i + 1)); [ "$i" -gt 60 ] && { echo "WordPress ne démarre pas." >&2; exit 1; }
  sleep 2
done

echo "== Installation =="
if cli core is-installed >/dev/null 2>&1; then
  echo "déjà installé"
else
  cli core install --url="https://$CMS_DOMAIN" --title="TogoExpo CMS" \
    --admin_user="$WP_ADMIN_USER" --admin_password="$WP_ADMIN_PASSWORD" \
    --admin_email="$WP_ADMIN_EMAIL" --skip-email
fi
cli language core install fr_FR --activate >/dev/null 2>&1 || true
cli option update timezone_string Africa/Lome >/dev/null
# Le CMS n'a pas de site public : rien à indexer.
cli option update blog_public 0 >/dev/null
cli rewrite structure '/%postname%/' >/dev/null

echo "== Extensions =="
for p in wp-graphql polylang wordpress-importer; do
  cli plugin is-installed "$p" >/dev/null 2>&1 || cli plugin install "$p" >/dev/null
  cli plugin activate "$p" >/dev/null 2>&1 || true
done
if ! cli plugin is-installed wp-graphql-polylang >/dev/null 2>&1; then
  cli plugin install https://github.com/valu-digital/wp-graphql-polylang/archive/refs/tags/v0.7.1.zip >/dev/null
fi
cli plugin activate wp-graphql-polylang >/dev/null 2>&1 || true
cli plugin list --status=active --fields=name,version

echo "== Langues (FR par défaut, EN, JA) =="
if [ "$(cli eval 'echo count(pll_languages_list());')" = "0" ]; then
  cli eval-file /setup/i18n-setup.php
else
  echo "déjà configurées : $(cli eval 'echo implode(",", pll_languages_list());')"
fi
# Les éditions (type de contenu `edition`) se traduisent aussi.
cli eval-file /setup/i18n-cpt.php >/dev/null

echo
echo "WordPress prêt : https://$CMS_DOMAIN/wp-admin"
