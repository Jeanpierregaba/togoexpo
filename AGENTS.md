# AGENTS.md — développement agentique TogoExpo

## Comment travailler
1. Une tâche = une fiche dans `specs/`. Pas de gros prompt "refais tout".
2. Chaque agent doit : lire la spec -> coder -> `npm run audit` (typecheck + lint + build) -> résumer fichiers modifiés + vérif.
3. Frontend seul : ne jamais modifier `wp/` depuis un agent front, et inversement.
4. Données : utiliser `src/graphql/queries.ts` + `src/lib/wp.ts`. Pas de fetch direct sans passer par `wpQuery`.
5. Mock autorisé seulement si CMS indisponible, avec `// TODO agent: brancher WP` explicite.

## Ordre des tâches
1. `specs/01-content-model.md` -> valider WPGraphQL dans playground
2. `specs/02-pages.md` fiche Accueil -> Hero + Countdown + Timeline
3. Fiche Édition -> page `/editions/[slug]` + ISR 300s
4. Fiche Médiathèque + Actus + Contact/Partenaire
5. SEO + i18n + formulaires + Lighthouse >= 90 mobile

## Prompts types
- "Implémente specs/02-pages.md section Hero. Fichiers autorisés : frontend/src/components/Hero.tsx, page.tsx. Vérif : npm run audit."
- "Branche GET_HOME sur wpQuery. Si endpoint injoignable, garde fallback mock avec TODO."

## Interdits
- Pas d'Elementor, pas de nouveau plugin WP sans validation.
- Pas de lien `#`, pas de Lorem ipsum, pas de date 1970.
- Pas de `any` TS sans justification.
