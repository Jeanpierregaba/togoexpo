#!/usr/bin/env sh
# Envoie le projet sur le serveur, reconstruit et relance le site.
# Usage, depuis la racine du projet sur votre Mac :
#   SERVER=deploy@IP sh deploy/push.sh
#
# Le premier envoi s'arrête si deploy/.env manque sur le serveur.
# Le build Next.js a lieu sur le serveur (quelques minutes).
set -eu

: "${SERVER:?Indiquez le serveur : SERVER=deploy@IP sh deploy/push.sh}"
DIR="${REMOTE_DIR:-/opt/togoexpo}"
cd "$(dirname "$0")/.."

echo "== Envoi des fichiers vers $SERVER:$DIR =="
ssh "$SERVER" "mkdir -p '$DIR/deploy/import' '$DIR/wp'"
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .vercel --exclude '.env*' \
  --exclude tsconfig.tsbuildinfo --exclude 'Refonte TogoExpo' --exclude .DS_Store \
  frontend/ "$SERVER:$DIR/frontend/"
rsync -az --delete --exclude .DS_Store wp/mu-plugins/ "$SERVER:$DIR/wp/mu-plugins/"
rsync -az wp/uploads.ini wp/i18n-setup.php wp/i18n-cpt.php "$SERVER:$DIR/wp/"
# Le .env et les fichiers d'import restent ceux du serveur.
rsync -az --exclude .env --exclude import --exclude .DS_Store --exclude Caddyfile deploy/ "$SERVER:$DIR/deploy/"
# Le Caddyfile est monté seul dans le conteneur Caddy : un fichier remplacé (nouvel
# inode) resterait invisible pour lui. --inplace réécrit le même fichier, que
# Caddy relit ensuite à chaud, sans coupure.
rsync -az --inplace deploy/Caddyfile "$SERVER:$DIR/deploy/Caddyfile"

ssh "$SERVER" "test -f '$DIR/deploy/.env'" || {
  echo
  echo "Il manque $DIR/deploy/.env sur le serveur. Créez-le à partir du modèle :"
  echo "  ssh $SERVER 'cp $DIR/deploy/.env.example $DIR/deploy/.env && nano $DIR/deploy/.env'"
  echo "puis relancez cette commande."
  exit 1
}

echo "== Build et redémarrage =="
# Les images sont construites d'abord, pendant que l'ancien site tourne encore.
# Compose échoue parfois en recréant un conteneur (« container name … already in
# use » sur un nom temporaire `<id>_togoexpo-prod-…`) alors que le nouveau démarre
# bien. On nettoie ces restes et on relance une fois, puis on vérifie que chaque
# service tourne sur sa dernière image.
ssh "$SERVER" "DIR='$DIR' sh -s" <<'REMOTE'
set -eu
cd "$DIR/deploy"
docker compose build
if ! docker compose up -d --remove-orphans; then
  echo "Compose a échoué au redémarrage : nettoyage puis seconde tentative."
  sleep 3
  docker ps -a --format '{{.Names}}' | grep -E '^[0-9a-f]+_togoexpo-prod-' | xargs -r docker rm -f
  docker compose up -d --remove-orphans
fi
for svc in $(docker compose config --services); do
  cid=$(docker compose ps -q "$svc")
  [ -z "$cid" ] && continue
  running=$(docker inspect -f '{{.Image}}' "$cid")
  wanted=$(docker image inspect -f '{{.Id}}' "$(docker inspect -f '{{.Config.Image}}' "$cid")")
  if [ "$running" != "$wanted" ]; then
    echo "$svc tourne sur une ancienne image : recréation."
    docker compose up -d --no-deps --force-recreate "$svc"
  fi
done
docker image prune -f >/dev/null
docker compose ps --format '{{.Service}}: {{.Status}}'
REMOTE

echo "== Configuration Caddy =="
# Le nouveau fichier est d'abord validé dans un conteneur jetable, puis
# rechargé à chaud (sans effet si rien n'a changé). Si le conteneur voit encore
# un ancien fichier, il est recréé pour monter le bon (coupure de quelques secondes).
ssh "$SERVER" "cd '$DIR/deploy' && docker compose run --rm --no-deps -T caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1 || { echo 'Caddyfile invalide : configuration inchangée.'; exit 1; }; \
  if docker compose exec -T caddy cat /etc/caddy/Caddyfile | cmp -s - Caddyfile; then \
    docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1 && echo 'Caddy rechargé.'; \
  else \
    docker compose up -d --force-recreate caddy && echo 'Caddy recréé avec le nouveau Caddyfile.'; \
  fi"

echo "== Rafraîchissement des pages depuis WordPress =="
ssh "$SERVER" "cd '$DIR/deploy' && sh scripts/revalidate.sh" || echo "(le site ne répond pas encore : réessayez avec 'sh scripts/revalidate.sh' sur le serveur)"

echo
echo "Déployé."
