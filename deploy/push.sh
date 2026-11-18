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
rsync -az --exclude .env --exclude import --exclude .DS_Store deploy/ "$SERVER:$DIR/deploy/"

ssh "$SERVER" "test -f '$DIR/deploy/.env'" || {
  echo
  echo "Il manque $DIR/deploy/.env sur le serveur. Créez-le à partir du modèle :"
  echo "  ssh $SERVER 'cp $DIR/deploy/.env.example $DIR/deploy/.env && nano $DIR/deploy/.env'"
  echo "puis relancez cette commande."
  exit 1
}

echo "== Build et redémarrage =="
ssh "$SERVER" "cd '$DIR/deploy' && docker compose up -d --build --remove-orphans && docker image prune -f >/dev/null"

echo "== Rafraîchissement des pages depuis WordPress =="
ssh "$SERVER" "cd '$DIR/deploy' && sh scripts/revalidate.sh" || echo "(le site ne répond pas encore : réessayez avec 'sh scripts/revalidate.sh' sur le serveur)"

echo
echo "Déployé."
