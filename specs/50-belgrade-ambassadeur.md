# 50 — Belgrade : section « L'ambassadeur » + documentaire FR/EN ; titre à la une réduit

## Demande
- Page Actualités : réduire le titre de l'article à la une pour que la zone de
  texte ne dépasse pas beaucoup la hauteur de l'image.
- Page Belgrade 2027 : nouvelle section sur l'ambassadeur (Emmanuel Sheyi
  Adebayor) avec le documentaire vidéo, en version française et anglaise, et un
  bouton pour passer de l'une à l'autre.

## Fait
- `FeaturedActu.tsx` : titre `clamp(24px,2.2vw,32px)` (au lieu de 32–48 px).
  À 1440 px : texte 466 px pour une image de 428 px (679 px auparavant).
- `AmbassadorVideo.tsx` (client) : lecteur natif, sélecteur FR / EN
  (`aria-pressed`) ; le changement reprend au même instant et continue la
  lecture si elle était en cours. Version par défaut : FR sur /fr, EN sinon.
- `belgrade-2027/page.tsx` : section `#ambassadeur` (fond blanc) entre le
  thème et les Rythmes ; textes `amb*` dans `dict.ts` (FR, EN, JA), repris de
  l'actualité publiée.
- Vidéos réencodées en H.264 1080p ~3 Mb/s + AAC (sources HEVC, ~118 Mo,
  illisibles sur une partie des navigateurs) : `public/videos/adebayor-{fr,en}.mp4`
  (~40 Mo chacune), affiche `public/design/belgrade/adebayor-poster.jpg`.

## Vérif
`npm run audit` ; contrôle visuel desktop et mobile ; bascule FR → EN en lecture.
