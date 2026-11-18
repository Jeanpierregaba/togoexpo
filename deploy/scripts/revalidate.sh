#!/usr/bin/env sh
# Purge le cache du site pour qu'il relise WordPress (après un déploiement ou
# un import). À lancer sur le serveur, dans deploy/ : sh scripts/revalidate.sh
set -eu
cd "$(dirname "$0")/.."

i=0
until docker compose exec -T front wget -qO /dev/null http://127.0.0.1:3000/fr 2>/dev/null; do
  i=$((i + 1))
  [ "$i" -gt 30 ] && { echo "Le front ne répond pas." >&2; exit 1; }
  sleep 2
done

docker compose exec -T front sh -c \
  'wget -qO- --header "x-revalidate-secret: $REVALIDATE_SECRET" --post-data "" http://127.0.0.1:3000/api/revalidate'
echo
