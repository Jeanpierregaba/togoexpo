#!/usr/bin/env sh
# Appelé par deploy/migrate-local-content.sh : charge import/local.sql.gz et
# import/uploads.tgz dans le WordPress de production, corrige les adresses,
# puis rétablit le compte administrateur de deploy/.env.
set -eu
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a
: "${LOCAL_URL:=http://localhost:8080}"

cli() { docker compose run --rm -T wpcli "$@"; }

echo "-- base de données"
gunzip -c import/local.sql.gz | docker compose exec -T db \
  sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' 2>/dev/null

echo "-- médias"
docker compose exec -T -u 33:33 wordpress sh -c 'rm -rf wp-content/uploads && tar xzf - -C wp-content' < import/uploads.tgz

echo "-- adresses : $LOCAL_URL -> https://$CMS_DOMAIN"
cli search-replace "$LOCAL_URL" "https://$CMS_DOMAIN" --all-tables --precise --report-changed-only

echo "-- extensions"
for p in wp-graphql polylang wp-graphql-polylang wordpress-importer; do
  cli plugin activate "$p" >/dev/null 2>&1 || true
done
cli option update blog_public 0 >/dev/null
cli rewrite structure '/%postname%/' >/dev/null

echo "-- comptes : seul $WP_ADMIN_USER (deploy/.env) reste administrateur"
if cli user get "$WP_ADMIN_USER" --field=ID >/dev/null 2>&1; then
  cli user update "$WP_ADMIN_USER" --user_pass="$WP_ADMIN_PASSWORD" --user_email="$WP_ADMIN_EMAIL" --role=administrator --skip-email >/dev/null
else
  cli user create "$WP_ADMIN_USER" "$WP_ADMIN_EMAIL" --role=administrator --user_pass="$WP_ADMIN_PASSWORD" >/dev/null
fi
ADMIN_ID="$(cli user get "$WP_ADMIN_USER" --field=ID | tr -d '\r')"
for id in $(cli user list --field=ID | tr -d '\r'); do
  [ "$id" = "$ADMIN_ID" ] || cli user delete "$id" --reassign="$ADMIN_ID" --yes >/dev/null
done

rm -f import/local.sql.gz import/uploads.tgz
echo
echo "Contenu importé :"
cli post list --post_type=edition,post --fields=post_type,post_name,post_status --format=table
sh scripts/revalidate.sh >/dev/null 2>&1 || true
