# TogoExpo — Refonte headless WP + Next

## Principe
- `wp/` = CMS seul. Le client n'y fait que : Éditions, Événements, Actus, Médias, FAQ, Partenaires.
- `frontend/` = site public Next.js 14 App Router. 100% du design ici.
- Pas de conversion Next -> thème WP. Deux blocs qui communiquent via WPGraphQL.

## Démarrage
```sh
# 1. CMS local
cp wp/.env.example wp/.env
docker compose -f wp/docker-compose.yml up -d
# installer plugins listés dans wp/plugins.txt, créer CPT selon wp/content-model.json

# 2. Front
cd frontend
cp .env.example .env.local
npm install
npm run dev
npm run audit
```

## Formulaire de contact
`/contact` + `POST /api/contact` (validation + honeypot anti-spam).
- Dev sans clé : la demande est journalisée côté serveur (`delivered:false`).
- Prod : renseigner `RESEND_API_KEY` + `CONTACT_TO_EMAIL` dans l'hébergeur
  (Vercel : variables d'environnement), domaine d'envoi `togoexpo.tg` à valider dans Resend.

## Règles issues de l'audit togoexpo.tg
- Countdown jamais à 0 par défaut : si date passée -> "Événement terminé — bilan".
- Pas de date 01/01/1970 : date obligatoire côté WP.
- Orthographe : Osaka (pas 0saka), Accueil (pas Acceuil), futur (pas future), Shanghai 2010 / Milan 2015.
- LinkedIn : URL publique uniquement, jamais /admin/.
- FR/EN : vraies routes, jamais `#`.
- FAQ : jamais de Lorem ipsum.

## Structure
```
wp/         docker-compose, plugins.txt, content-model.json, acf-json/
frontend/   Next + Tailwind + graphql-request + framer-motion
specs/      specs par page pour pilotage agentique
```
