# 16 — Barre de navigation flottante et réglages de sections

Fiche de tâche (une tâche = une fiche, cf. AGENTS.md). Périmètre : frontend uniquement.

## 1. Barre de navigation

Inspirée de la barre fournie (pilule sombre détachée des bords, liens centrés, action à
droite), avec **tous les éléments actuels conservés** : logotype, menu « Archives » et son
déroulant, réseaux sociaux, sélecteur de langue, bouton burger.

- L'en-tête n'est plus un bandeau pleine largeur : il porte le retrait
  (`px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8`) et la barre devient une pilule
  (`rounded-full`, liseré blanc 10 %, `backdrop-blur-xl`, ombre portée).
- Hauteur 64 px (72 px dès `sm`), au lieu de 80 px pleine largeur.
- Les liens se regroupent au centre (`absolute left-1/2 -translate-x-1/2` dès 960 px), le
  logotype restant à gauche et le groupe langue / réseaux à droite.
- Le panneau du menu mobile se détache lui aussi, en carte arrondie sous la pilule.

## 2. Découvrir le Togo

- Barre d'onglets bornée à `max-w-[54ch]`, la même largeur que le paragraphe : elle ne
  dépasse plus (424 px contre 424 px, mesuré).
- Bouton « En savoir plus » repassé en `rounded-full`, comme tous les boutons du site.

## 3. Le Togo sur la scène internationale

- Défilement automatique porté de 6 s à **3 s** (`AUTOPLAY_MS`).

## 4. Expositions universelles

- Accordéon trié de la plus récente à la plus ancienne (`b.annee - a.annee`) :
  Osaka 2025 → Hanovre 2000.

## 5. Médiathèque

- Le bouton « Galerie photos » pointe vers le compte Flickr du Comité
  (`https://www.flickr.com/photos/190367340@N06/`), en nouvel onglet. Le bouton YouTube,
  qui s'ouvrait dans l'onglet courant, s'ouvre lui aussi en nouvel onglet.
- La mosaïque passe de 12 à **19 tuiles** pour combler le bas à droite : Milan 2015,
  Hanovre 2000, port de Lomé, visiteurs du pavillon, rencontre bilatérale, Yokohama et
  Belgrade. Le décrochage entre la colonne la plus haute et la plus basse tombe de 180 px
  à 78 px. Légendes ajoutées dans les trois langues.

## 6. Actualités

- Fond de section passé au blanc pur (`bg-white`).

## 7. Questions fréquentes

- La recherche quitte la pleine largeur : elle rejoint la colonne de droite, sous le bouton
  « Contacter le Comité », alignée horizontalement avec le paragraphe
  (`items-stretch` sur la ligne, colonne droite en `flex-col justify-between`).

## 8. Communauté officielle

- Hauteur augmentée de 15 % : `py-[126px]`, `lg:py-[161px]` (au lieu de 110 / 140).

## Vérification

- `npm run audit` (typecheck + lint + build) vert.
- Accueil : pilule de navigation détachée (32 px de marge à 1024 px, rayon plein), barre
  d'onglets et paragraphe à la même largeur, bouton en rayon plein, éditions triées
  2025 → 2000, 19 tuiles en médiathèque, fond Actualités `rgb(255,255,255)`, recherche FAQ
  à droite du paragraphe et sur la même bande, section Communauté à 161 px de padding,
  défilement « Rendez-vous » mesuré à 3 013 ms.
- Aucun débordement horizontal de 375 px à 1440 px ; menu burger et panneau arrondi
  fonctionnels en mobile.
