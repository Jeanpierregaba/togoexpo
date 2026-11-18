# 36 — Page Togo : hero et section Économie

## Bug du hero
- Symptôme : au chargement, le hero affichait l'ancienne photo (`hero-independance.jpg`, monument) le temps que la vidéo du drapeau arrive.
- Cause : cette photo servait d'image de fond et d'affiche (`poster`) à la vidéo.
- Correctif : nouvelle affiche `public/design/togo-drapeau-poster.jpg` = première image de `togo-banniere.mp4` (extraite via AVFoundation) ; la vidéo prend le relais sans saut visuel. `PageHero` : `preload="auto"` sur la vidéo.

## Section Économie (`#economie`)
- Nouveau contenu client (FR) + traductions EN/JA : titre « Togo, une terre de rencontres et d'opportunités. », chapeau, bloc « Un pays connecté aux opportunités de l'Afrique de l'Ouest » (2 paragraphes), « Les secteurs qui font avancer le Togo » (4 secteurs).
- Dict : `ecoPara` / `ecoCards` remplacés par `ecoLead`, `ecoHubTitle`, `ecoHubParas`, `ecoSectorsTitle`, `ecoSectors[{t, paras, alt}]`.
- Design : fond blanc (alternance cream / white / cream), en-tête titre + chapeau à filet jaune, bandeau vert (pictogramme globe), 4 cartes photo 2×2 (pastille numéro jaune, filet rouge, zoom au survol).
- Visuels : cacao (`yokohama/cacao.jpg`), port de Lomé (`togo/economie/2.jpg`), PIA (`togo/economie/1.jpg`), marché de Lomé (`togo/economie/3.jpg`).

## Vérif
- `npm run audit` ; hero : drapeau visible dès le premier rendu ; FR/EN/JA ; 375 px sans débordement.

## Complément — chiffres, tourisme
- Carte 11 (« Une donnée à vérifier ? », lien togo.gouv.tg) : fond rouge `bg-blood`, textes blancs, pastille flèche ↗ (décalage au survol), ombre rouge.
- `#tourisme` : sur-titre « Voyage et découverte », titre « Le Togo, une destination à découvrir », accroche jaune « Tant de richesses à découvrir, tant d'expériences à vivre. », question, paragraphe de présentation (contenu client ; EN/JA traduits). Dict : `tourLead`, `tourQuestion`, `tourPara`.

## Complément 2 — gastronomie, titre tourisme, CTA de fin
- Onglet Gastronomie : photo fournie par le client (`public/design/togo/culture/gastronomie.jpg`, 736×920, filigrane « Latifahcooks »). Nouveau drapeau `imageContain` dans `cultTabs` : image affichée entière sur un fond flou tiré d'elle-même (`TogoCultureTabs`), au lieu d'un recadrage 21:9 qui l'agrandissait.
- `#tourisme` : titre sur deux lignes (`AccentTitle breakBefore`).
- Nouvelle section `#partager` après le tourisme : carte blanche, sur-titre « Togo Expo », titre « Le Togo a tant à partager avec le monde. », 4 promesses en liste à puces jaunes, accroche à filet rouge, boutons « Nos prochaines expositions » (`/#rendez-vous`) et « Nous contacter » (`/contact`), photo de la finale du spectacle (Osaka 2025). Dict : `togo.cta*` (FR/EN/JA).

## Complément 3 — titre du hero, photo gastronomie
- Hero : « Présentation du Togo » → « Le Togo, l'Afrique en miniature. » (seconde partie en jaune, sur une 2e ligne ; EN « Togo, Africa in miniature. », JA « トーゴ、アフリカの縮図。 »). Clé `togo.heroAccent` ; titre d'onglet sans le point final.
- Onglet Gastronomie : nouvelle photo fournie par le client (`public/design/togo/culture/gastronomie.webp`, 1672×941, table de plats togolais), affichée en plein cadre (plus de `imageContain`). Textes alternatifs mis à jour (FR/EN/JA).
- Titre du hero reformulé : « Le Togo, fier de ses racines, tourné vers le monde. » (« tourné vers le monde » en jaune, 2e ligne) ; EN « Togo, proud of its roots, open to the world. » ; JA « トーゴ、ルーツを誇り、世界へひらく。 ».
- Section Histoire : paragraphe « État laïque, le Togo pratique… deux langues nationales : l'ewé et le kabyè. » supprimé (`togo.histParas`, FR/EN/JA).
