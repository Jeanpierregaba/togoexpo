# 43 — Déploiement sur VPS (front + WordPress sur le même serveur)

## Contexte
Nouveau serveur (VPS nu, Ubuntu/Debian). Le site Next.js et le WordPress headless y tournent tous deux, dans Docker. Procédure complète : `deploy/README.md`.

## Fait
- `deploy/docker-compose.yml` : Caddy (HTTPS automatique), front Next.js (image `frontend/Dockerfile`, serveur autonome), WordPress 6.9 / PHP 8.3, MySQL 8, WP-CLI (profil `tools`). Seul Caddy publie des ports.
- `deploy/Caddyfile` : `SITE_DOMAIN` → front, `www.` → redirection, `CMS_DOMAIN` → WordPress limité à l'admin, l'API et les médias.
- Front : `output: 'standalone'`, `WP_GRAPHQL_INTERNAL_URL` (lecture de WordPress par le réseau interne, `src/lib/wp.ts`), Next.js 14.2.5 → 14.2.35 (correctifs de sécurité, dont le contournement du middleware), `sharp` pour l'optimisation d'images.
- `wp/mu-plugins/togoexpo-revalidate.php` : la version corrigée de la spec 42, branchée en interne (`http://front:3000`).
- Scripts : `server-setup.sh`, `push.sh`, `wp-init.sh`, `migrate-local-content.sh` + `import-local.sh`, `wp-import.sh`, `revalidate.sh`, `backup.sh`.

- Serveur `2.25.13.143` (Ubuntu 26.04) en service le 18/11/2026. D'abord sur les adresses provisoires `togoexpo.2-25-13-143.sslip.io` / `cms.2-25-13-143.sslip.io`, puis passé le jour même sur le nouveau domaine `togoexpo.org` / `cms.togoexpo.org` (zone DNS chez Hostinger, `scripts/set-domains.sh togoexpo.org cms.togoexpo.org`). L'ancien `togoexpo.tg` reste sur l'ancien site en attendant sa redirection.
- CI/CD : dépôt privé `Jeanpierregaba/togoexpo`, `.github/workflows/deploy.yml` (typecheck + lint, puis `deploy/push.sh` par une clé SSH dédiée).

## Vérif
- `npm run audit` OK.
- Pile complète testée en local (domaines `*.localhost`) : redirections, `www`, CMS limité, GraphQL, migration du contenu local (21 éditions FR/EN/JA), lecture par le front avec filtre de langue, publication WordPress → site à jour.
- Non testé : `server-setup.sh` et `push.sh` (il faut le vrai serveur), l'import XML de l'ancien site.
