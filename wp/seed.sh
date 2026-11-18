#!/usr/bin/env sh
# T1 TogoExpo — orchestrateur concret : up Docker, install core, wp-graphql,
# seed 5 editions + 2 actus, validation GET_HOME sur /graphql.
# Usage : sh seed.sh   (depuis wp/, Docker démarré)
set -e
cd "$(dirname "$0")"
[ -f .env ] || cp .env.example .env
# shellcheck disable=SC1091
set -a; . ./.env; set +a
PORT="${WP_PORT:-8080}"
URL="${WP_URL:-http://localhost:$PORT}"

cli() { docker compose -p togoexpo run --rm wpcli "$@"; }

echo "== [1/6] docker compose up =="
docker compose -p togoexpo up -d

echo "== [2/6] attente HTTP $URL =="
i=0
until curl -sf -o /dev/null "$URL/wp-includes/images/blank.gif"; do
  i=$((i + 1))
  if [ "$i" -gt 90 ]; then
    echo "ABORT: WP injoignable apres 180s"
    docker compose -p togoexpo logs --tail=50 wordpress || true
    exit 1
  fi
  sleep 2
done
echo "WP repond."

echo "== [3/6] core install (si besoin) + permaliens =="
if ! cli core is-installed >/dev/null 2>&1; then
  cli core install --url="$URL" --title="${WP_TITLE:-TogoExpo CMS}" \
    --admin_user="${WP_ADMIN_USER:-togoexpo}" --admin_password="${WP_ADMIN_PASSWORD:-change_me_admin_123}" \
    --admin_email="${WP_ADMIN_EMAIL:-admin@togoexpo.tg}" --skip-email
  echo "core installe."
else
  echo "core deja installe."
fi
cli rewrite structure '/%postname%/' --hard >/dev/null
cli rewrite flush --hard >/dev/null
echo "permaliens /%postname%/ OK."

echo "== [4/6] plugin wp-graphql =="
cli plugin is-installed wp-graphql >/dev/null 2>&1 || cli plugin install wp-graphql >/dev/null
cli plugin activate wp-graphql >/dev/null
echo "wp-graphql actif : $URL/graphql"

echo "== [5/6] seed contenus =="
seed_edition() {
  slug="$1"; title="$2"; annee="$3"; ville="$4"; pays="$5"; theme="$6"; debut="$7"; fin="$8"; content="$9"
  id=$(cli post list --post_type=edition --name="$slug" --format=ids 2>/dev/null || true)
  if [ -z "$id" ]; then
    id=$(cli post create --post_type=edition --post_title="$title" --post_name="$slug" \
      --post_status=publish --post_content="$content" --porcelain)
    echo "edition creee : $slug"
  else
    echo "edition existante : $slug (maj metas)"
  fi
  cli post meta set "$id" annee "$annee" >/dev/null
  cli post meta set "$id" ville "$ville" >/dev/null
  cli post meta set "$id" pays "$pays" >/dev/null
  cli post meta set "$id" theme "$theme" >/dev/null
  cli post meta set "$id" dateDebut "$debut" >/dev/null
  cli post meta set "$id" dateFin "$fin" >/dev/null
  cli post meta set "$id" estEvenementFutur "0" >/dev/null
}

seed_edition "osaka-2025" "Osaka 2025" "2025" "Osaka" "Japon" "Inclusion et protection sociale" "2025-04-13" "2025-10-13" "Le pavillon du Togo met en avant l’inclusion et la protection sociale comme moteurs de croissance."
seed_edition "dubai-2021" "Dubaï 2021" "2021" "Dubaï" "EAU" "Connecter les esprits, construire le futur" "2021-10-01" "2022-03-31" "À Dubaï, le Togo présente sa connectivité et son écosystème startup."
seed_edition "milan-2015" "Milan 2015" "2015" "Milan" "Italie" "Nourrir la planète, énergie pour la vie" "2015-05-01" "2015-10-31" "À Milan, le Togo valorise son agriculture durable et ses produits du terroir."
seed_edition "shanghai-2010" "Shanghai 2010" "2010" "Shanghai" "Chine" "Une ville meilleure, une vie meilleure" "2010-05-01" "2010-10-31" "À Shanghai, le Togo expose sa culture urbaine et son artisanat."
seed_edition "hanovre-2000" "Hanovre 2000" "2000" "Hanovre" "Allemagne" "Homme, Nature, Technologie" "2000-06-01" "2000-10-31" "À Hanovre, le Togo affirme sa présence autour du dialogue homme, nature et technologie."

cat_id=$(cli term list category --slug=actus --field=term_id 2>/dev/null || true)
if [ -z "$cat_id" ]; then
  cat_id=$(cli term create category "Actus" --slug=actus --porcelain)
  echo "categorie Actus creee."
fi
seed_post() {
  slug="$1"; title="$2"; content="$3"
  id=$(cli post list --post_type=post --name="$slug" --format=ids 2>/dev/null || true)
  if [ -z "$id" ]; then
    cli post create --post_title="$title" --post_name="$slug" --post_status=publish \
      --post_content="$content" --post_category="$cat_id" --porcelain >/dev/null
    echo "actus cree : $slug"
  else
    echo "actus existant : $slug"
  fi
}
seed_post "le-togo-a-osaka-2025" "Le Togo affirme son leadership économique à l’Expo 2025 Osaka" "Retour sur la journée économique du pavillon du Togo à Osaka : investissements, agro-transformation et logistique."
seed_post "bilan-pavillon-togo-osaka-2025" "Bilan du pavillon du Togo à Osaka 2025" "Fréquentation, rencontres B2B et temps forts du pavillon togolais pendant six mois d’exposition."

echo "== [6/6] validation GraphQL =="
curl -sf "$URL/graphql" -H 'Content-Type: application/json' \
  -d '{"query":"{__typename}"}' | python3 -m json.tool || exit 1
curl -sf "$URL/graphql" -H 'Content-Type: application/json' \
  -d '{"query":"query{editions(first:10){nodes{slug editionFields{annee ville pays theme dateDebut dateFin estEvenementFutur}}} posts(first:5){nodes{slug title date}}}"}' \
  | python3 -m json.tool || exit 1

echo ""
echo "T1 OK."
echo "- Admin : $URL/wp-admin (user ${WP_ADMIN_USER:-togoexpo}, mdp dans wp/.env)"
echo "- GraphQL : $URL/graphql"
echo "- Front : NEXT_PUBLIC_WP_GRAPHQL_URL=$URL/graphql dans frontend/.env.local"
