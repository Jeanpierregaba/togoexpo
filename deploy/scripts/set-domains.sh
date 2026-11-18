#!/usr/bin/env sh
# Change les domaines du site et du CMS (adresse provisoire -> définitive, par exemple).
# Sur le serveur, dans deploy/ :
#   sh scripts/set-domains.sh <domaine du site> <domaine du CMS>
#   sh scripts/set-domains.sh togoexpo.tg cms.togoexpo.tg
#
# Met à jour deploy/.env, réécrit dans la base WordPress les adresses de
# l'ancien domaine du CMS (images des contenus), puis reconstruit le front et
# relance Caddy, qui demande les nouveaux certificats. Les nouveaux domaines
# doivent déjà pointer vers ce serveur.
set -eu
cd "$(dirname "$0")/.."

SITE="${1:?Usage : sh scripts/set-domains.sh <domaine du site> <domaine du CMS>}"
CMS="${2:?Usage : sh scripts/set-domains.sh <domaine du site> <domaine du CMS>}"
set -a; . ./.env; set +a
OLD_CMS="$CMS_DOMAIN"

sed -i "s#^SITE_DOMAIN=.*#SITE_DOMAIN=$SITE#; s#^CMS_DOMAIN=.*#CMS_DOMAIN=$CMS#" .env
# Relu : Docker Compose donne la priorité aux variables déjà exportées.
set -a; . ./.env; set +a
echo "Site : $SITE    CMS : $CMS"

if [ "$OLD_CMS" != "$CMS" ]; then
  echo "== Adresses en base : $OLD_CMS -> $CMS =="
  docker compose up -d db wordpress
  docker compose run --rm -T wpcli search-replace "https://$OLD_CMS" "https://$CMS" --all-tables --precise --report-changed-only
fi

echo "== Reconstruction du front et relance =="
docker compose up -d --build --force-recreate
docker image prune -f >/dev/null
sh scripts/revalidate.sh >/dev/null && echo "Pages rafraîchies."
