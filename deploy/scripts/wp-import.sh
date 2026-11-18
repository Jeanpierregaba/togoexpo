#!/usr/bin/env sh
# Importe les articles de l'ancien site (fichier d'export WordPress, .xml).
# Sur le serveur, dans deploy/, avec le fichier déposé dans deploy/import/ :
#   sh scripts/wp-import.sh import/togoexpo.WordPress.xml
#
# À lancer AVANT la bascule DNS : les images sont téléchargées depuis
# l'ancien site, qui doit encore répondre sur togoexpo.tg.
set -eu
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a

FILE="${1:?Indiquez le fichier : sh scripts/wp-import.sh import/fichier.xml}"
[ -f "$FILE" ] || { echo "Fichier introuvable : $FILE" >&2; exit 1; }
case "$FILE" in import/*) ;; *) echo "Le fichier doit être dans deploy/import/." >&2; exit 1 ;; esac

cli() { docker compose run --rm -T wpcli "$@"; }

echo "== Import (articles + images) =="
cli plugin activate wordpress-importer >/dev/null 2>&1 || true
cli import "/$FILE" --authors=skip --user="$WP_ADMIN_USER"

echo "== Langue : les articles importés sont en français =="
cli eval '
foreach (get_posts(["post_type" => "post", "numberposts" => -1, "post_status" => "any", "fields" => "ids"]) as $id) {
  if (!pll_get_post_language($id)) pll_set_post_language($id, "fr");
}
foreach (get_terms(["taxonomy" => "category", "hide_empty" => false]) as $t) {
  if (!pll_get_term_language($t->term_id)) pll_set_term_language($t->term_id, "fr");
}
echo "ok\n";'

echo "== Images : adresses de l'ancien site -> $CMS_DOMAIN =="
for old in https://togoexpo.tg https://www.togoexpo.tg http://togoexpo.tg http://www.togoexpo.tg; do
  cli search-replace "$old/wp-content/uploads/" "https://$CMS_DOMAIN/wp-content/uploads/" wp_posts wp_postmeta --precise --report-changed-only
done

echo
cli post list --post_type=post --fields=post_name,post_date,post_status --format=table
sh scripts/revalidate.sh >/dev/null 2>&1 || true
