# 55 — Serbe (cyrillique) et articles en anglais

## Serbe
- Quatrième langue `sr` (ћирилица) : `/sr/...`, sélecteur « Српски ».
- Hors CMS (Polylang n'a pas le serbe) : `isCmsLang` ; éditions depuis le code
  (`MOCK_EDITIONS_SR`, `MOCK_UPCOMING_SR`), actualités = articles français avec
  mention.
- Contenus : `i18n/dict-sr.ts` (dictionnaire complet), `lib/archives-sr.ts` et
  `lib/archive-osaka-sr.ts` (récits des 5 éditions), participations, libellés fixes.
- Police : Poppins n'a pas de cyrillique → Montserrat (`--font-cyrillic`, sans
  préchargement) sur `html[lang='sr']`.
- Image de partage `public/og/togoexpo-sr.jpg` (`npm run og`).

## Articles en anglais
- 34 articles traduits et publiés dans WordPress en anglais (Polylang), liés à
  l'original, même date, même image ; 7 catégories anglaises créées et liées.
- Slug anglais = slug français + `-en`. Le sélecteur y mène ; si la traduction
  manque, la page sert l'original français.

## Vérif
`npm run audit` ; toutes les pages `/sr` en 200 ; bascule d'un article
fr → en (`-en`), ja/sr (original + mention).
