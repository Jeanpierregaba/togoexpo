# 34 — Accueil : rendez-vous sans voile

Section « Le Togo sur la scène internationale » (`#rendez-vous`).
Fichiers : `src/components/UpcomingEvents.tsx`, `src/components/CountdownPanel.tsx`.

## Demande
Le slider reste trop sombre : retirer le voile et rendre ses composants
lisibles.

## Réalisation
- Plus aucun voile sur les visuels (clairs, fond blanc, sujet à droite).
- Grand écran : le texte est posé sur un panneau blanc translucide
  (`bg-white/85`, flou d'arrière-plan, ombre douce) dans la zone libre à
  gauche du visuel. Mobile : le visuel passe au-dessus du texte, en 16/10.
- Couleurs inversées pour un fond clair : titre et valeurs en vert, thème en
  rouge, libellés gris-vert, icônes sur pastille vert pâle, bouton vert plein.
- `CountdownPanel` : nouvelle variante `soft` (tuiles claires, compacte).
- Barre d'onglets et de contrôle sur fond blanc ; onglet actif jaune.

## Vérification
Contrôle visuel 1440 (Yokohama, Belgrade) et mobile 375 (pas de débordement) ;
`npm run audit`.

## Complément — compte à rebours rouge, fonds de section
- `CountdownPanel` variante `soft` : fond `bg-blood`, libellé, tuiles et séparateurs en blanc (tuiles `bg-white/15` + liseré blanc), ombre portée rouge.
- `#rendez-vous` passe sur fond blanc (`bg-white`), la carte du diaporama gagne une ombre douce pour se détacher.
- `#togo` (« Découvrir le Togo », `TogoCards`) passe en beige (`bg-cream`).
- Vérif : `npm run audit`.

## Complément 2 — slider pleine largeur, plus bas, compte à rebours sans intitulé
- `CountdownPanel` : suppression de la ligne « Compte à rebours officiel · … » sur tous les comptes à rebours (accueil, Belgrade, Yokohama) ; prop `title` retirée, le minuteur reste nommé par `aria-label`.
- `#rendez-vous` : le slider sort du conteneur 1360 px et occupe toute la largeur (plus de marges, d'arrondi ni de bordure latérale) ; le panneau texte reste aligné sur la grille du contenu (`ml-[max(56px,calc((100vw-1360px)/2))]`).
- Hauteur réduite (~800 → ~620 px à 1440) : panneau plus large, espacements resserrés, compte à rebours compact placé sur la ligne du bouton « Découvrir ».

## Complément 3 — visuel entier, compte à rebours sous les dates, section collée
- La zone du visuel suit le ratio des images (`lg:aspect-video`, 1920×1080) : image affichée entière, panneau centré verticalement.
- Compte à rebours replacé sous la ville et les dates officielles, dans la bande à filets ; bouton « Découvrir » de nouveau seul.
- `#rendez-vous` : plus de padding bas (`pt-[100px]` seulement), la barre de contrôle touche la section suivante (`#editions`).

## Complément 4 — image jamais recadrée, commandes sur l'image
- Visuel de fond en `object-contain object-right` (plus de zoom au survol) : jamais recadré, même si le panneau rend la zone plus haute que 16:9. Mobile : visuel en `aspect-video`.
- Bande blanche des commandes supprimée : onglets + lecture/précédent/suivant posés en bas à droite de l'image (`lg:absolute`, pastilles blanches translucides, onglet actif jaune) ; sous le texte sur mobile.

## Complément 5 — panneau plus aéré
- Panneau texte : padding `lg:px-10 lg:py-11`, espacements internes élargis sur grand écran (titre, bande ville/dates, compte à rebours, paragraphe, bouton) ; largeur `min(720px,60%)`.
- Commandes sur l'image à partir de 1360 px seulement (réserve `pb-20` dans la zone du visuel pour qu'elles ne touchent pas le panneau) ; en dessous, elles passent sous le visuel.
