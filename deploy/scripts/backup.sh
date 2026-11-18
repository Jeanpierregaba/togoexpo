#!/usr/bin/env sh
# Sauvegarde la base WordPress et les médias dans /opt/togoexpo/backups,
# en gardant les 14 dernières. Sur le serveur, chaque nuit à 3 h :
#   (crontab -l 2>/dev/null; echo "0 3 * * * sh /opt/togoexpo/deploy/scripts/backup.sh >/dev/null 2>&1") | crontab -
# Pensez à copier régulièrement ce dossier hors du serveur.
set -eu
cd "$(dirname "$0")/.."
OUT="${BACKUP_DIR:-/opt/togoexpo/backups}"
STAMP="$(date +%Y-%m-%d_%H%M)"
mkdir -p "$OUT"

docker compose exec -T db sh -c 'mysqldump --no-tablespaces --single-transaction -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' 2>/dev/null \
  | gzip > "$OUT/db_$STAMP.sql.gz"
docker compose exec -T wordpress tar czf - -C /var/www/html/wp-content uploads > "$OUT/uploads_$STAMP.tgz"

ls -1t "$OUT"/db_*.sql.gz | tail -n +15 | xargs -r rm -f
ls -1t "$OUT"/uploads_*.tgz | tail -n +15 | xargs -r rm -f
echo "Sauvegarde : $OUT/db_$STAMP.sql.gz, $OUT/uploads_$STAMP.tgz"
