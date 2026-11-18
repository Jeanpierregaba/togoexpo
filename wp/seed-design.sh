#!/usr/bin/env sh
# Contenus issus du dossier "Refonte TogoExpo" : édition future Belgrade 2027
# + images mises en avant (éditions Osaka/Dubaï, actu leadership).
# Idempotent. Usage : sh seed-design.sh (après seed.sh, daemon Docker démarré)
set -e
cd "$(dirname "$0")"
set -a; . ./.env; set +a

cli() { docker compose -p togoexpo run --rm wpcli "$@"; }

echo "== édition future Belgrade 2027 =="
id=$(cli post list --post_type=edition --name=belgrade-2027 --format=ids 2>/dev/null || true)
if [ -z "$id" ]; then
  id=$(cli post create --post_type=edition --post_title="Belgrade 2027" --post_name=belgrade-2027 \
    --post_status=publish --post_content="Le Togo prépare sa participation à l’Expo 2027 Belgrade, exposition spécialisée dédiée au sport et à la musique." --porcelain)
  echo "edition creee : belgrade-2027"
fi
cli post meta set "$id" annee "2027" >/dev/null
cli post meta set "$id" ville "Belgrade" >/dev/null
cli post meta set "$id" pays "Serbie" >/dev/null
cli post meta set "$id" theme "Jouer pour l’humanité : le sport et la musique pour tous" >/dev/null
cli post meta set "$id" dateDebut "2027-05-15" >/dev/null
cli post meta set "$id" dateFin "2027-08-15" >/dev/null
cli post meta set "$id" estEvenementFutur "1" >/dev/null

echo "== édition future Yokohama 2027 =="
yid=$(cli post list --post_type=edition --name=yokohama-2027 --format=ids 2>/dev/null || true)
if [ -z "$yid" ]; then
  yid=$(cli post create --post_type=edition --post_title="Yokohama 2027" --post_name=yokohama-2027 \
    --post_status=publish --post_content="Le Togo prépare sa participation à l’Exposition horticole de Yokohama 2027, consacrée à l’horticulture durable et aux paysages de demain." --porcelain)
  echo "edition creee : yokohama-2027"
fi
cli post meta set "$yid" annee "2027" >/dev/null
cli post meta set "$yid" ville "Yokohama" >/dev/null
cli post meta set "$yid" pays "Japon" >/dev/null
cli post meta set "$yid" theme "Horticulture durable et paysages de demain" >/dev/null
cli post meta set "$yid" dateDebut "2027-03-19" >/dev/null
cli post meta set "$yid" dateFin "2027-09-26" >/dev/null
cli post meta set "$yid" estEvenementFutur "1" >/dev/null

echo "== images mises en avant =="
attach() {
  slug="$1"; ptype="$2"; url="$3"; title="$4"
  pid=$(cli post list --post_type="$ptype" --name="$slug" --format=ids 2>/dev/null || true)
  if [ -z "$pid" ]; then echo "introuvable: $slug"; return; fi
  if [ -n "$(cli post meta get "$pid" _thumbnail_id 2>/dev/null || true)" ]; then echo "image deja la: $slug"; return; fi
  aid=$(cli media import "$url" --title="$title" --porcelain 2>/dev/null || true)
  if [ -z "$aid" ]; then echo "import echec: $url"; return; fi
  cli post meta set "$pid" _thumbnail_id "$aid" >/dev/null
  echo "image #$aid -> $slug"
}
attach "osaka-2025" "edition" "https://live.staticflickr.com/31337/54451350109_525a5b59ec_b.jpg" "Pavillon du Togo Osaka 2025"
attach "dubai-2021" "edition" "https://togoexpo.tg/wp-content/uploads/2025/04/Expo-universelle-2020-a-Dubai.webp" "Pavillon du Togo Dubai 2020"
attach "le-togo-a-osaka-2025" "post" "https://togoexpo.tg/wp-content/uploads/2025/04/TogoExpo-Banniere-3.jpg" "Journee economique Osaka 2025"

echo "== vraies infos + visuels villes (rendez-vous 2027) =="
yid=$(cli post list --post_type=edition --name=yokohama-2027 --format=ids 2>/dev/null || true)
cli post meta set "$yid" theme "Scenery of the Future for Happiness" >/dev/null
cli post update "$yid" --post_content="Un rendez-vous international consacré à l’horticulture, aux paysages et à la place de la nature dans les sociétés de demain." >/dev/null
bid=$(cli post list --post_type=edition --name=belgrade-2027 --format=ids 2>/dev/null || true)
cli post meta set "$bid" theme "Jouer pour l’humanité — Sport et musique pour tous" >/dev/null
cli post update "$bid" --post_content="Le Togo partagera la richesse de ses expressions culturelles, musicales et sportives dans un rendez-vous placé sous le signe de la rencontre entre les peuples." >/dev/null
attach "yokohama-2027" "edition" "https://upload.wikimedia.org/wikipedia/commons/7/79/Minato_Mirai_-_Yokohama_Skyline_March_2025.jpg" "Yokohama Minato Mirai"
attach "belgrade-2027" "edition" "https://upload.wikimedia.org/wikipedia/commons/c/c8/Belgrade_%E2%80%93_Kalemegdan_%282021%29_01.jpg" "Belgrade Kalemegdan"

echo "== validation =="
curl -sf "${WP_URL:-http://localhost:8080}/graphql" -H 'Content-Type: application/json' \
  -d '{"query":"query{editions(first:10){nodes{slug editionFields{annee ville estEvenementFutur dateDebut} featuredImage{node{sourceUrl}}}}}"}' \
  | python3 -c "import json,sys; [print(n['slug'], n['editionFields']['annee'], 'futur' if n['editionFields']['estEvenementFutur'] else '', 'img' if n.get('featuredImage') else 'sans-img') for n in json.load(sys.stdin)['data']['editions']['nodes']]"
