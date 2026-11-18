# 40 — Retouches accueil et À propos

## Accueil
- Slide 1 (« TOGO EXPO ») : paragraphe sur deux lignes (coupure `\n` dans `hero.slides[0].para`, FR/EN/JA, rendue par `lg:whitespace-pre-line`) ; sur grand écran, la grille passe en `auto / 1fr` pour laisser la place au texte. Bouton « En savoir plus » → `/a-propos`.
- « Le Togo sur la scène internationale » : carte d'informations animée (classe `ev-in`, `globals.css`) — glissement depuis la gauche puis montée en cascade des éléments (étiquettes, titre, thème, ville/dates, compte à rebours avec ses tuiles, texte, bouton). Rejouée à chaque changement de slide, déclenchée seulement quand la section est à l'écran (IntersectionObserver ; carte masquée jusque-là). `prefers-reduced-motion` : aucune animation.
- Remarque : le défilement automatique est réglé à 3 s (`AUTOPLAY_MS`).

## À propos
- Hero : nouveau voile `light` dans `PageHero` (dégradé `black/60 → transparent` + léger dégradé bas), ombre douce sur le titre. Bouton « Nous contacter » → « Nos participations » (`/editions`) ; clé `about.ctaArchives`.
- Bandeau Comité : sur-titre « Le Comité National Permanent », titre « Une mobilisation collective pour représenter le Togo. », deux paragraphes (contenu client ; EN/JA traduits). Clés `comite.bannerKicker/Title/Accent/Paras`.
- Cartes ministères : bouton « Site officiel ↗ » en bas de carte → commerce.gouv.tg, tourisme.gouv.tg, economie.gouv.tg (`ministries[].url`).
- Section BIE redessinée : titre « Un cadre international pour des rencontres entre les nations. », définition à filet jaune (BIE en gras rouge), bouton « En savoir plus sur le BIE → » ; à droite, carte verte : « Ces grands rendez-vous permettent… » + trois pastilles (Innovations, Cultures, Visions d'un avenir commun). Clés `comite.bie*` revues.

## Complément
- Slide 1 : paragraphe de retour dans la colonne de droite (même grille `md:grid-cols-2` que les autres slides), taille `clamp(14px,1.08vw,16px)` et coupure `\n` appliquée à partir de `xl` pour tenir sur deux lignes.
- Hero À propos : nouvelle option `bright` de `PageHero` (luminosité +18 %, saturation +6 %) et voile `light` encore réduit (`black/50 → transparent` à 70 %, plus de dégradé bas).
- Nouvelle section `#ensemble` après « Missions & objectifs » : carte blanche, photo des échassiers (Osaka 2025) à gauche ; sur-titre « Ensemble, faisons rayonner le Togo », titre « Le monde est un espace de rencontres. Le Togo a tant à y partager. », paragraphe, encart jaune pâle avec la question et le bouton « Contactez-nous » (`/contact`). Contenu client ; EN/JA traduits. Clés `about.cta*`.
- Hero À propos et hero Contact : nouveau voile `faint` de `PageHero` (noir 5 %), photo toujours éclaircie (`bright`) ; lisibilité assurée par les ombres portées du titre et du chapeau.
- Cartes ministères : libellé du bouton « Site officiel » → « En savoir plus » (EN « Learn more », JA « 詳しく見る »).
