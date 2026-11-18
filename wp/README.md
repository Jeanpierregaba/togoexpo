# wp/ — CMS headless TogoExpo (T1 concret)

## Accès local (après `sh seed.sh`)
- Admin : http://localhost:8080/wp-admin
- Playground GraphQL : http://localhost:8080/graphql (IDE GraphiQL intégré de wp-graphql)
- Identifiants : voir `wp/.env` (`WP_ADMIN_USER`, `WP_ADMIN_PASSWORD`) — jamais commités avec de vrais secrets.

## Ce que fait `sh seed.sh` (idempotent, relançable)
1. `docker compose -p togoexpo up -d` (MySQL 8 + WP 6.6 + wpcli)
2. Attente HTTP 200 (max 180s)
3. `wp core install` si besoin + permaliens `/%postname%/`
4. Install + activation `wp-graphql`
5. Seed : 5 éditions (CPT `edition` + metas `annee/ville/pays/theme/dateDebut/dateFin/estEvenementFutur`) + catégorie `Actus` + 2 posts datés (jamais 1970)
6. Validation : `{__typename}` + requête type `GET_HOME` (éditions + posts)

## Tester à la main dans le playground
```graphql
{
  editions(first: 10) {
    nodes {
      slug
      title
      editionFields { annee ville pays theme dateDebut dateFin estEvenementFutur }
    }
  }
  posts(first: 5) {
    nodes { slug title date }
  }
}
```
Critère T1 OK : 5 éditions + 2 posts, champs non vides, dates ISO.

## Fichiers
- `docker-compose.yml` : db + wordpress + wpcli (image `wordpress:cli`)
- `mu-plugins/togoexpo-cpt.php` : CPT `edition/evenement/partenaire` + type `EditionFields` exposé en GraphQL. Aucun ACF requis en T1.
- `plugins.txt` : cible complète (slugs gratuits valides ; l'ex-`advanced-custom-fields-pro` exige une licence, phase 2)
- `content-model.json` : modèle de référence pour la phase ACF/Polylang/RankMath
- `setup.sh` : phase 2 (plugins admin). `seed.sh` : socle T1.

## Brancher le front
Dans `frontend/.env.local` :
```
NEXT_PUBLIC_WP_GRAPHQL_URL=http://localhost:8080/graphql
```
Les pages `Accueil/Éditions/Actus/Médiathèque` lisent le CMS via `wpQuery`
(`GET_HOME`/`GET_EDITIONS`/`GET_EDITION`/`GET_POSTS`/`GET_POST`), ISR 300s.

## Revalidation instantanée (webhook)
Sans action, un contenu publié met 300s max à apparaître (ISR).
Pour l'instantané : `POST /api/revalidate?secret=XXX` (secret = `REVALIDATE_SECRET`
du front). En prod, brancher un webhook WP « on publish » vers cette URL
et changer le secret par défaut `change_me`. Testé en local : création d'actu →
webhook → visible sur `/` et `/actualites`, suppression → disparue.

## Dépannage
- Port occupé : changer `WP_PORT` dans `.env`, relancer (URL playground = nouveau port).
- Reset total : `docker compose -p togoexpo down -v && sh seed.sh` (efface db + wp).
- `wp-graphql` inactif : `docker compose -p togoexpo run --rm wpcli plugin activate wp-graphql`.
- ACF/Polylang/RankMath : phase 2, après validation T1.
