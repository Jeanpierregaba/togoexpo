# 01 — Modèle de contenu (source : wp/content-model.json)

## CPT
- edition : annee*, ville*, pays*, theme, date_debut, date_fin, pavillon_description, galerie, video_url, est_evenement_futur (1 seul true)
- evenement : date* datetime, lieu*, edition_liee, inscription_url
- partenaire : logo* image, site_url, type [institutionnel|prive|media]
- Posts natifs pour Actus : chapeau, image_hero*, a_la_une bool

## Règles GraphQL
- Tout CPT + champ ACF : Show in GraphQL = true
- Slugs stables, dates ISO, images avec altText obligatoire
- Options page `togoexpo_settings` : email, tel, adresse, réseaux sociaux publics

## Validation agent
1. Démarrer WP local, créer 1 édition Osaka 2025 + 1 Dubaï 2021 + 2 actus
2. Tester dans `/graphql` : requêtes GET_HOME et GET_EDITION de `frontend/src/graphql/queries.ts`
3. Critère OK : pas d'erreur, images + dates présentes
