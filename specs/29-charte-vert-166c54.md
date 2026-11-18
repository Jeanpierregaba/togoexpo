# 29 — Nouveau vert #166c54 et bannières neutres (tout le site)

## Demande
Le site est jugé trop sombre : le vert utilisé n'est pas celui des services
de l'État togolais.
1. Titres, boutons et sections en vert : passer au vert **#166c54** et en
   atténuer l'usage.
2. Diaporamas et bannières : plus de vert du tout, un voile sobre (neutre)
   pour la lisibilité du texte.

## Réalisation
- Jetons (`tailwind.config.ts`) : `forest` #00301F → **#166C54** (titres,
  boutons, sections, en-tête, pied de page) ; `pine` #0F5A45 (survol des
  boutons verts, un ton plus foncé) ; `deeppine`, `pineink` alignés ;
  nouveau `ink` #111513, fond neutre sous les photos.
- Valeurs codées en dur alignées : `globals.css` (sélection, dégradé
  « play », papier quadrillé de Yokohama), pied de page #062A1F, carte du
  Togo, ombres teintées.
- Bannières et diaporamas : voiles en noir translucide (`black/…`), allégés
  par rapport aux anciens voiles verts — `PageHero`, accueil (`HeroExpo`),
  Belgrade, Yokohama, rendez-vous (`UpcomingEvents`), diaporama « Découvrir le
  Togo », panneaux de l'herbier, cartes photo (culture, tourisme, médiathèque,
  galeries). Fil d'Ariane des bannières en crème au lieu du vert sauge.
  Bannières sans photo (médiathèque, fiche édition WordPress, article) :
  médiathèque sur photo + voile ; les deux autres sur fond neutre `ink`.
- Usage du vert atténué : passées en fond clair — médiathèque de l'accueil,
  culture et cartes « Investir » de la page Togo, presse de Belgrade, piliers
  de Yokohama.

## Vérification
`npm run audit` ; contrôle visuel accueil, Togo, Belgrade, Yokohama.

## Complément — accueil, bandes défilantes, voiles
- Voiles des diaporamas renforcés : accueil (`HeroExpo`), rendez-vous
  (`UpcomingEvents`), « Découvrir le Togo » (`TogoCards`).
- Bandes défilantes (accueil, Belgrade, Yokohama) : gabarit commun exporté de
  `Marquee.tsx` (`BAND`, `TRACK`, `ITEM`, `STAR`) — fond vert, 65 px de haut,
  capitales, corps clamp(17px → 26px), séparateur ✦ rouge. Yokohama perd ses
  binômes latins et sa feuille dans la bande.
- Rendez-vous : les visuels des monuments ceints du drapeau
  (`event-*-2027.jpg`) priment sur l'image à la une WordPress (CMS de nouveau
  joignable, qui renvoyait les anciennes photos de ville). Titre sur deux
  lignes (`AccentTitle` gagne `breakBefore`).
- Expositions universelles : paragraphe en blanc ; bouton « Toutes les
  participations » jaune, survol fond blanc et texte rouge.
- Médiathèque : titre sur deux lignes.
