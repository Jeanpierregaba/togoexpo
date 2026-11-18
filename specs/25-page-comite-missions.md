# 25 — Page « Le Comité d'organisation — Missions & objectifs »

## Objectif
Sur la page d'accueil, section « Rayonnement & diplomatie », le lien
« Missions & objectifs du Comité → » menait vers `/editions`. Il doit mener vers
une page dédiée au Comité National Permanent, reprenant le contenu des deux
pages de l'ancien site :
- https://togoexpo.tg/le-comite-dorganisation/
- https://togoexpo.tg/missions-objectifs/

## Route
`/[lang]/comite` — trois langues, `revalidate = 300`, `langAlternates`,
ajoutée aux chemins statiques du `sitemap`.

## Contenu
**Bannière.** Fil d'Ariane, surtitre « Rayonnement & diplomatie », titre
« Le Comité National Permanent », sous-titre reprenant son intitulé officiel.

**Composition.** Reprise littérale de la liste de l'ancien site : trois
ministères avec leurs directions et organismes rattachés (Commerce → CETEF-Lomé,
Commerce extérieur, Artisanat, SAZOF ; Culture et Tourisme → Promotion
touristique ; Économie et Finances → Finances, Douanes), puis cinq organismes
membres de plein droit (CCI-Togo, FNCAT, Fédération des chambres des métiers,
Association des entreprises de zone franche, Conseil national du patronat).
Mention finale : « Le Comité est présidé par un Bureau, dirigé par le
Représentant du Ministre chargé du Commerce. »

**Missions.** Les quatre missions principales, en vis-à-vis numéroté :
sélection des foires, budget de participation, sensibilisation des opérateurs,
coordination des préparatifs.

> **Point de vigilance** — sur l'ancien site, les missions 03 et 04 affichent par
> erreur le texte des missions 01 et 02 (copier-coller resté en place). Les
> intitulés sont donc repris tels quels, mais leurs deux descriptions ont été
> rédigées d'après l'intitulé. À valider par le Comité.

**Appel à l'action.** Deux liens : le calendrier des participations
(`/editions`) et le formulaire partenaire (`/contact`).

## Mouvement
Rien de nouveau : `Reveal`, surtitres `SectionKicker`, `AccentTitle`. La
composition se dévoile ministère par ministère ; les missions au défilement.

## Fichiers autorisés
- `frontend/src/app/[lang]/comite/page.tsx` (nouveau)
- `frontend/src/components/Mission.tsx` (destination du lien)
- `frontend/src/i18n/dict.ts` (bloc `comite`, trois langues)
- `frontend/src/app/sitemap.ts`

## Vérification
`npm run audit` + contrôle des trois langues et du lien depuis l'accueil.
