#!/usr/bin/env sh
# Copie le contenu du WordPress local (éditions traduites FR/EN/JA, médias)
# vers le WordPress de production, qui doit déjà être initialisé (wp-init.sh).
# REMPLACE toute la base de production : à faire une seule fois, au départ.
#
# Usage, depuis la racine du projet sur votre Mac (WordPress local démarré) :
#   SERVER=deploy@IP sh deploy/migrate-local-content.sh
set -eu

: "${SERVER:?Indiquez le serveur : SERVER=deploy@IP sh deploy/migrate-local-content.sh}"
DIR="${REMOTE_DIR:-/opt/togoexpo}"
LOCAL_URL="${LOCAL_URL:-http://localhost:8080}"
cd "$(dirname "$0")/.."
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "== Export de la base locale =="
docker compose -p togoexpo -f wp/docker-compose.yml exec -T db \
  sh -c 'mysqldump --no-tablespaces -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' 2>/dev/null \
  | gzip > "$TMP/local.sql.gz"
echo "$(du -h "$TMP/local.sql.gz" | cut -f1) exportés"

echo "== Export des médias locaux =="
docker run --rm -v togoexpo_wp_data:/w:ro alpine tar czf - -C /w/wp-content uploads > "$TMP/uploads.tgz"
echo "$(du -h "$TMP/uploads.tgz" | cut -f1) exportés"

echo "== Envoi vers le serveur =="
ssh "$SERVER" "mkdir -p '$DIR/deploy/import'"
rsync -az "$TMP/local.sql.gz" "$TMP/uploads.tgz" "$SERVER:$DIR/deploy/import/"

echo "== Import sur le serveur =="
ssh "$SERVER" "cd '$DIR/deploy' && LOCAL_URL='$LOCAL_URL' sh scripts/import-local.sh"
