# 26 — Les quatre participations passées racontées

## Objectif
Donner à Dubaï 2021, Milan 2015, Shanghai 2010 et Hanovre 2000 de vraies pages
de récit, à la place de la fiche générique `/editions/[slug]` (bandeau vert,
photo, un paragraphe, encadré de métadonnées). Les textes ont été fournis
rédigés, section par section ; ils sont repris littéralement.

## Une page, quatre éditions
Les quatre récits partagent la même trame, donc la même mise en page :

1. **Bannière** pleine hauteur sur la photo de l'édition, voile vert en
   diagonale : fil d'Ariane, surtitre (« Expo 2020 Dubaï · Émirats arabes
   unis »), dates, titre avec son mot mis en avant, chapeau.
2. **Les deux thèmes** en vis-à-vis — celui de l'exposition, celui de la
   participation togolaise — séparés par un filet qui se trace.
3. **Les repères chiffrés** quand l'édition en donne (250 m² et zone C pour
   Shanghai, 100 m² et hall 12 pour Hanovre, les trois journées et les deux
   accords pour Dubaï, les sept céréales et tubercules pour Milan).
4. **Le récit**, une section par titre du texte fourni, numérotée d'un seul
   tenant, fonds alternés blanc / papier, titre en colonne collante à gauche,
   numéro géant posé en fond.
5. **Les temps forts datés**, sur fond vert, en chemin vertical.
6. **L'album**, sur la photo de l'édition : un seul bouton, vers Flickr.
7. **Les autres participations** : les trois autres éditions en cartes.

## Choix de mise en œuvre
- **Contenu** dans `src/lib/archives.ts`, en français, anglais et japonais —
  une section de moins si une édition n'a ni repères ni suite de récit.
- **Pas de nouvelle route.** Les quatre éditions sont servies par
  `/editions/[slug]`, qui bascule sur `ArchiveEdition` quand le slug (privé de
  son suffixe de langue) est l'un des quatre. Les deux formes de slug
  (`milan-2015`, `milan-2015-en`) et les trois langues marchent donc sans
  dupliquer la route, et les liens existants vers `/editions/...` tombent
  juste.
- **Mouvement.** `Reveal` pour l'entrée des blocs, deux primitives CSS
  nouvelles (`draw-x`, `draw-y`) pour les filets qui se tracent — elles se
  greffent sur la classe `is-visible` que `Reveal` pose déjà, donc sans une
  ligne de JavaScript de plus — et `ArchiveTimeline` pour le chemin des temps
  forts. Tout est neutralisé sous `prefers-reduced-motion`.
- **Flickr.** Un seul album public pour toutes les participations
  (`flickr.com/photos/190367340@N06/`), déjà utilisé par la médiathèque et le
  pied de page. Le lien s'ouvre dans un nouvel onglet, en `rel="noopener
  noreferrer"`.

## Points de vigilance
- **Hanovre 2000, et non 2010.** La demande mentionne « Hanovre 2010 » mais le
  contenu fourni, le site et l'historique disent l'Exposition universelle de
  Hanovre de 2000 (1er juin — 31 octobre 2000). Le slug existant
  `hanovre-2000` est conservé.
- **Hanovre n'a pas de section « Revivre … en images »** dans le texte fourni :
  la section a été ajoutée, comme pour les trois autres, avec une phrase
  d'introduction écrite pour l'occasion.
- **Traductions anglaise et japonaise** rédigées ici faute de version fournie.
- **Une seule photographie par édition**, celle qui servait déjà la fiche. La
  bannière et la section album la partagent. Des photographies
  supplémentaires amélioreraient nettement le récit.

## Fichiers autorisés
- `frontend/src/lib/archives.ts` (nouveau)
- `frontend/src/components/ArchiveEdition.tsx` (nouveau)
- `frontend/src/components/ArchiveTimeline.tsx` (nouveau)
- `frontend/src/app/[lang]/editions/[slug]/page.tsx`
- `frontend/src/i18n/dict.ts` (bloc `archive`)
- `frontend/src/app/globals.css`

## Vérification
`npm run audit` + relevé des douze pages (4 éditions × 3 langues) : titre,
sections, temps forts, lien Flickr et liens croisés.
