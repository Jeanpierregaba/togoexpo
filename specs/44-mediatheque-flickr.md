# 44 — Médiathèque : la banque d'images Flickr

## Demande
- Une page Médiathèque qui présente toutes les images de la banque Flickr de TogoExpo
  (https://www.flickr.com/photos/190367340@N06/).
- Accueil, section Médiathèque : le bouton « Galerie photos » mène à cette page (il ouvrait Flickr).
- Menu Archives : un item Médiathèque juste après les éditions passées.

## Fait
- `frontend/scripts/flickr-sync.mjs` (`npm run flickr`) relève toutes les photos publiques
  du compte dans `frontend/src/data/flickr.json` (titre, dimensions, date, URL Flickr de
  l'image en 1024 px, lien vers la photo). Sans clé d'API : il lit les données embarquées
  dans les pages publiques (`/`, `/pageN`, `/with/<photo>`). Les vidéos sont écartées.
  Coquille « Jounrnée » corrigée dans les titres.
- `/[lang]/mediatheque` : bannière, lien vers le compte Flickr, galerie `FlickrGallery`
  (filtre par année avec effectifs, maçonnerie, lots de 24 avec « Afficher plus »,
  visionneuse ← → Échap avec lien « Voir sur Flickr »). Remplace l'ancienne médiathèque
  construite à partir des images mises en avant de WordPress (`MediathequeGallery`,
  `toMediaItems` supprimés).
- Images servies par `live.staticflickr.com` via `next/image` (ajouté à `remotePatterns`).
- `MediaWall` : « Galerie photos » -> `/[lang]/mediatheque`.
- `SiteHeader` : item « Médiathèque — Toutes les photos » après les éditions passées
  (menu déroulant et menu mobile) ; « Archives » est actif sur la médiathèque.
- Textes FR / EN / JA dans `dict.ts` (`media`, `archivesMenu.media`, `archivesMenu.mediaNote`).

## Mettre à jour après l'ajout de photos sur Flickr
```bash
cd frontend && npm run flickr
git add src/data/flickr.json && git commit -m "Médiathèque : photos Flickr à jour" && git push
```

## Vérif
`npm run audit` ; page testée en FR/EN/JA, desktop et mobile (filtre, « Afficher plus »,
visionneuse, focus, pas de défilement horizontal), menu Archives, bouton de l'accueil.
