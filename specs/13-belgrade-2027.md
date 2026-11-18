# 13 — Page Expo 2027 Belgrade

Fiche de tâche (une tâche = une fiche, cf. AGENTS.md). Périmètre : frontend uniquement.

Route statique `src/app/[lang]/editions/belgrade-2027/page.tsx`, prioritaire sur le gabarit
dynamique `[slug]` : l'URL servie par le menu « Archives » ne change pas.

## 1. Direction artistique

Contenu repris de la maquette `https://togo-expo.ai.studio/#belgrade-2027`, mise en scène
inspirée du site de l'organisateur `https://expobelgrade2027.org/en`, dans notre charte
(Bricolage Grotesque / Instrument Sans / JetBrains Mono, forest / cream / sun / blood / pine) :

- **Dégradé irisé animé** (`.play-gradient`) composé de nos quatre couleurs, qui dérive
  lentement en fond de bannière et de section finale — l'équivalent du dégradé pastel
  mouvant de l'Expo, transposé à notre palette.
- **Signature géante** : `Play the Togolese Way!` en capitales `clamp(44px,8vw,110px)`,
  puis un bandeau défilant (`.play-marquee`) rythmes · jeux · talents.
- **Cartes galets** (`.play-blob-1/2/3`) : rayons dissymétriques et aplats francs, repris
  du bloc « Expo 2027 in numbers ».
- **Boutons pastille** à pastille fléchée, comme les CTA de l'Expo.
- Animations fluides : flottement de la mascotte (`.play-float`), relance de l'animation
  d'entrée à chaque changement d'onglet (`key` + `.word-in`), survols en élévation.
  Toutes coupées en `prefers-reduced-motion`.

## 2. Mascotte

L'image fournie par le Comité est rangée dans `public/design/mascotte-togo.jpg` et placée
à deux endroits : dans la bannière, posée dans un galet clair qui la détoure visuellement
(l'image a un fond blanc, `object-contain` plutôt que `object-cover`), et dans une section
dédiée sur fond vert qui la relie aux trois piliers du pavillon.

## 3. Sections

1. Bannière « terrain de jeu » : fil d'Ariane, pastille, signature, accroche, dates,
   deux boutons d'ancre, mascotte.
2. Bandeau défilant signature.
3. Quatre galets de repères (événement / destination / dates / thème international) puis
   carte de compte à rebours vers le 15 mai 2027 et lien vers le site officiel de l'Expo.
4. `#participation` — « Le patrimoine en mouvement. » : trois paragraphes, carte « thème
   du pavillon » et carte « signature ».
5. `#piliers` — `BelgradePillars` (client) : onglets Rythmes / Jeux / Talents, visuel
   d'ouverture et fiches (5 danses, 4 jeux, 3 expressions artistiques).
6. La mascotte.
7. Evala : photo, deux paragraphes, les trois valeurs.
8. Les trois temps du parcours (initiation / arène / célébration) en galets colorés, puis
   la vue du projet de pavillon.
9. Création & technologie : deux paragraphes et trois cartes.
10. Perspectives & événements : trois cartes « dates et modalités à venir ».
11. Galerie filtrable `BelgradeGallery` (tout / patrimoine / préparatifs / maquettes).
12. Communiqués & journal : encart d'attente.
13. « Du Togo, pour le monde. » sur dégradé animé, deux boutons.

## 4. Données et visuels

- `src/lib/belgrade.ts` : chemins des visuels, visuel d'ouverture par pilier, composition
  de la galerie, date d'ouverture, URL officielle de l'Expo. Libellés au dictionnaire.
- Visuels récupérés depuis la maquette et rangés dans `public/design/belgrade/`.
- Bloc `belgrade` ajouté au dictionnaire dans les trois langues.
- **Page entièrement statique** : aucun appel `wpQuery`, donc identique en local et en
  production même sans CMS joignable (voir « Déploiement » ci-dessous).

### Écarts assumés

- Les cinq danses et les quatre jeux n'ont pas de visuel propre dans la maquette : leurs
  fiches sont des cartes typographiques, et seul le pilier porte une photo d'ouverture.
  Les trois expressions artistiques ont chacune la leur.

## Vérification

- `npm run audit` (typecheck + lint + build) vert.
- `/fr|/en|/ja/editions/belgrade-2027` : treize sections, onglets des piliers
  (5 / 4 / 3 fiches), filtres de galerie, compte à rebours actif, aucun débordement
  horizontal de 375 px à 1440 px.
