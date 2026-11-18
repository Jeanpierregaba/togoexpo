# 04 — Roadmap agents (ordre d'exécution)

- [x] T1 WP : monter docker, installer plugins, créer CPT + 5 éditions de test — valider GET_HOME dans playground
- [x] T2 Front Accueil : brancher Hero + Countdown + Timeline sur mock, `npm run audit` OK
- [x] T3 Front Éditions : `/editions` + `/editions/[slug]` + ISR, gestion 404 si slug inconnu
- [x] Branchement WP : Accueil + Éditions sur `wpQuery` réel (mocks en fallback)
- [x] T4 Médiathèque + Actus : grilles, filtres, pages détail
- [x] T5 Contact/Partenaire : formulaire + page succès + stockage (FluentForm webhook ou Resend)
- [x] T6 SEO/i18n : metadata par page, sitemap, robots, Polylang FR/EN (Polylang installé, spec EN en specs/05-i18n.md)
- [x] T7 Perf : images next/image, fonts next/font, Lighthouse mobile >= 90, suppression mocks (fonts self-hostées, OG dynamique, H1 statique pour LCP ; mocks conservés uniquement en fallback hors-ligne si CMS down)
- [x] Refonte dossier : homepage one-pager fidèle (hero slideshow + mots rotatifs + countdown Belgrade live CMS, marquee, mission, éditions interactif, agenda filtré, cartes Togo, médiathèque parallax, actus CMS, FAQ, partenaire + newsletter) — Lighthouse mobile 100/100/100/100, 0 échec
- [x] Améliorations front : nav Accueil/Togo/Archives/Blog/Contact, hero 3 sliders (titres + paragraphes + CTA + countdowns Yokohama/Belgrade/Riyad, fonds HD 1920px), page /archives (éditions passées CMS), marquee events à venir uniquement
- [x] Section Rendez-vous : kicker + h2 + paragraphe, 2 grandes cards CMS (Yokohama/Belgrade : thème, lieu, dates officielles, countdown, description, CTA fiches), explorer limité aux éditions passées
- [x] Rendez-vous v2 : vraies infos (GREEN×EXPO, thèmes officiels), cards 90% type référence (photo ville CMS + panneau verre), /editions passé uniquement, grand espacement après Mission
- [x] Footer : barres tricolores, zone « Communauté officielle » (Facebook, Instagram, LinkedIn, Flickr, YouTube), TOGO EXPO géant + barre légale conservés ; colonnes/liens/newsletter supprimés, `lucide-react` ajouté aux deps
- [x] Page /togo v3 : hero Monument de l’Indépendance (CC BY-SA Bamouzou + crédit), histoire en 2 colonnes, vraie carte GADM (`togo-outline.ts`) avec infobulle flottante + étoile Lomé, chiffres en light (vedette forêt, survol)
- [x] Carte annotée (Burkina Faso, Ghana, Bénin, golfe de Guinée + 6 villes) et espacements uniformisés à 100px sur tout le site
- [x] Déploiement Vercel prod : https://togoexpo.vercel.app (contenus fallback, CMS local injoignable depuis Vercel)
- [x] Fix preview sans CMS : `MOCK_UPCOMING` + fiches 2027 en fallback (section Rendez-vous visible sur Vercel), redéployé et vérifié
- [x] Header sociaux (5 mini-icônes, bouton partenaire retiré), cartes Togo avec hover + bouton « En savoir plus », pages Médiathèque et Contact modernisées — redéployé
- [x] Header : pastilles jaunes + glyphes blancs ; hover carte Rendez-vous ; images Milan/Shanghai/Hanovre (Commons + crédits) + refonte page détail édition ; nav Blog→/actualites, Contact→/contact — redéployé
- [x] Mini-icônes en vert sur jaune + refonte page article (hero, contenu stylé, CTA) — redéployé
- [x] Navbar classique (logo + tagline, lien actif souligné, dropdown Archives : à venir + passées, mobile inclus) — redéployé
- [x] Navbar logo seul + countdown retiré du hero — redéployé
- [x] i18n FR/EN/JA achevée : `lang.ts` repassé en module serveur (build réparé),
      `getDictionary` débloqué, contenu CMS requêté dans la langue courante,
      8 pages restantes branchées au dictionnaire, liens internes localisés,
      hreflang + sitemap + OG image + validation serveur du formulaire par langue
      — `npm run audit` OK, 3 langues vérifiées en `next start` (voir specs/05-i18n.md)
- [x] Fix middleware : `frontend/middleware.ts` → `frontend/src/middleware.ts` (ignoré par Next
      à cause du dossier `src/`, donc `/` en 404 et redirections legacy mortes) — vérifié
- [x] Accueil : section Agenda retirée (données + ancres `/#agenda` rebranchées sur
      `/#rendez-vous`, pastilles renumérotées 01 → 06), « Qui sommes-nous » devient
      « Rayonnement & diplomatie » avec image et textes alignés en bas, section galerie
      refaite en mosaïque Pinterest animée au survol — `npm run audit` OK
      (voir specs/06-home-galerie.md)
- [x] Accueil : cartes « Actualités » reprises sur l'habillage des cartes Togo
      (aplats jaune / vert / rouge, médaillon, survol) et FAQ refondue selon
      l'inspiration (accroche + CTA Comité, recherche instantanée sans accents,
      fiches numérotées à catégorie et accordéon animé) — `npm run audit` OK
      (voir specs/07-blog-faq.md)
- [x] Communauté officielle sortie du pied de page : section pleine largeur avant le
      footer, photo de fond figée au défilement (`bg-fixed`) + voile sombre ; le CTA
      partenaire et la carte newsletter descendent dans le footer sans leur panneau
      vert (PartnerCta supprimé), titre jaune réduit de 20 %, boutons retirés et bande
      blanche de 100 px entre la section et le footer — `npm run audit` OK
      (voir specs/08-communaute-footer.md)
- [x] Page « Le Togo » : bannière portée à 70 vh, carte interactive calée sur la hauteur
      du titre et des paragraphes de la section Histoire, section « Histoire & culture »
      repassée sur une colonne (onglets → textes → image) avec téléchargement de la fiche
      statistique PDF, bande blanche entre Tourisme et Communauté — `npm run audit` OK
      (voir specs/09-page-togo.md)

- [x] Blog : page « Actualités » habillée aux cartes de l'accueil (carte extraite dans
      `ActuCard`, partagée accueil / liste / bas d'article), filtres par catégorie WP et
      recherche instantanée sans accents, catégorie en pastille et section « À lire aussi »
      sur les pages d'article — `npm run audit` OK (voir specs/10-blog.md)
- [x] Bannières de `/togo`, `/actualites` et `/contact` uniformisées dans un composant
      `PageHero` (70 vh, photo propre à chaque page, double voile, crédit) ; page blog
      dotée d'un article à la une pleine largeur au-dessus des filtres, barre de filtres
      affichée dès une catégorie et alignée avec la recherche — `npm run audit` OK
      (voir specs/11-bannieres-une-blog.md)
- [x] Page « Archives » supprimée (entrée de navigation rendue inerte, liens rebranchés
      sur `/editions`) et page GREEN×EXPO 2027 Yokohama créée sur
      `/editions/yokohama-2027` : onze sections reprises de la maquette (bannière, identité
      et compte à rebours, vision, herbier des cinq plantes, blocs alternés, trois piliers,
      pavillon, documentation, journal, galerie filtrable, engagement) dans notre direction
      artistique — `npm run audit` OK (voir specs/12-yokohama-2027.md)
- [x] Page Expo 2027 Belgrade sur `/editions/belgrade-2027` : contenu de la maquette mis en
      scène dans la direction du site de l'organisateur (dégradé irisé animé, signature
      géante et bandeau défilant, cartes galets, boutons pastille), mascotte du Comité
      intégrée en bannière et en section dédiée, onglets des trois piliers (5 danses,
      4 jeux, 3 expressions artistiques) et galerie filtrable — page 100 % statique, donc
      identique en local et en production — `npm run audit` OK (voir specs/13-belgrade-2027.md)
- [x] Accueil : section « 01 — Découvrir le Togo » refondue sur la disposition deux
      colonnes (texte à gauche, volet illustré à droite) ; les cartes Culture, Tourisme et
      Économie deviennent trois onglets colorés qui changent paragraphe, image, lieu,
      titre et cible du bouton — `npm run audit` OK (voir specs/14-decouvrir-togo-onglets.md)
- [x] Bannière d'accueil épurée (flèches et lecture-pause retirées, défilement à 3 s,
      correction du blocage au toucher), sections dénumérotées avec pastille à trait
      (rouge sur fond clair, jaune sur fond vert) et accent de couleur sur un mot de chaque
      titre de section (jaune sur fond clair, rouge sur fond vert) — `npm run audit` OK
      (voir specs/15-pastilles-accents-hero.md)
- [x] Barre de navigation refaite en pilule flottante (liens centrés, tous les éléments
      conservés) et neuf réglages de sections sur l'accueil : onglets alignés sur le
      paragraphe et bouton en rayon plein, rendez-vous à 3 s, éditions triées de la plus
      récente à la plus ancienne, Galerie photos vers Flickr et mosaïque complétée à
      19 tuiles, Actualités sur fond blanc, recherche FAQ à droite, Communauté +15 % —
      `npm run audit` OK (voir specs/16-navbar-reglages-sections.md)
- [x] Slider du hero : les trois visuels remplacés par les photos fournies (Monument de
      l'Indépendance, port autonome de Lomé, chute d'eau des Plateaux) — `npm run audit` OK
      (voir specs/17-hero-slider-images.md)
- [x] Découvrir le Togo : chaque onglet porte son diaporama de 3 photos (lecture auto 4 s,
      pastilles cliquables aux couleurs de l'onglet) — `npm run audit` OK
      (voir specs/18-decouvrir-togo-diaporama.md)
- [x] Carrousel des prochains rendez-vous : visuels événementiels Yokohama et Belgrade
      (monuments ceints du drapeau togolais) à la place des photos de ville — `npm run audit` OK
      (voir specs/19-rendez-vous-visuels.md)
- [x] Section « Rayonnement & diplomatie » : photo officielle de délégation à la place de
      l'ancien visuel du comité — `npm run audit` OK (voir specs/20-mission-visuel.md)
- [x] Page Togo : bannière en vidéo bouclée, fiche de région affichée à droite de la carte
      au lieu d'être posée dessus, cartes 08 à 10 des chiffres réécrites — `npm run audit` OK
      (voir specs/21-page-togo-video-carte-chiffres.md)
- [x] Correctifs de production : `NEXT_PUBLIC_SITE_URL=https://togoexpo.vercel.app` ajouté
      aux environnements Vercel (sitemap et hreflang pointaient sur `localhost:3000`),
      `/editions/belgrade-2027` ajouté à `STATIC_PATHS` du sitemap (absent), ancienne URL
      `/archives` redirigée en 308 vers `/editions` dans `src/middleware.ts` — `npm run audit` OK,
      vérifié sur https://togoexpo.vercel.app — redéployé
- [x] Page Togo, retouches : crédit photo retiré de la bannière (la vidéo n'a pas
      besoin de mention) et voile sombre ajouté via `PageHero overlay="strong"` ;
      fiche de région à nouveau posée SUR la carte, décalée de 28 px à côté du
      chef-lieu (côté et position verticale choisis selon la place, cadre toujours respecté) ;
      sous-titre « PDF bilingue · 1 page · 4,6 Mo » supprimé sous le bouton de
      téléchargement — `npm run audit` OK (voir specs/21-page-togo-video-carte-chiffres.md)
- [x] Page Belgrade : hero dupliqué puis première bannière passée sur la photo de la statue
      avec son ruban (`statue.jpg`, ciel doré), recadrée à droite pour garder la statue en
      portrait ; lumière circulant sur le ruban (trois reflets en `stroke-dashoffset` sur
      un tracé fixe — continu, sans à-coup) ; bandeau signature remonté en bas de cette
      bannière, duo en `min-h-svh` comme le hero de l'accueil ; titre « Du Togo, pour le
      monde » et compte à rebours officiel à la place des dates — `npm run typecheck` +
      `lint` OK, build laissé de côté tant que le serveur de dev tourne
      (voir specs/22)
- [x] Page Belgrade : section d'accueil insérée entre les deux bannières — fond blanc,
      deux colonnes, titre « Bienvenue au Togo » et deux paragraphes à gauche, bouton
      « Découvrir le Togo » vers `/togo`, mascotte avec sa bulle à droite ; textes
      ajoutés dans les       trois langues (voir specs/22)
- [x] Page Belgrade : suppression des sections « Repères de l'événement + compte à
      rebours » et « La participation du Togo » (le lien `#participation` du hero
      recadré sur `#rythmes`), remplacement de la bannière au dégradé irisé par la section
      des Rythmes — titre « Les trois piliers de notre participation », cinq cartes
      (une par région) avec effet de retournement au scroll et au clic, face avant photo
      de la danse et face arrière description du rythme ;       cinq vraies photos de danses
      ajoutées ; bandeau « Play the Togolese Way! » devenu « Du Togo, pour le monde »
      dans les trois langues ; section passée sur le dégradé.irisé, textes centrés,
      astuce supprimée, cartes en pleine largeur (`lg:grid-cols-5`) ; retournement
      vertical piloté par le scroll en continu (pivot au centre, sens alterné X / -X
      par carte), face avant sans description et face arrière avec une autre photo
      du rythme sous voile vert — `TODO agent` pour les cinq secondes photos ;
      paragraphe d'intro retiré, titre de section et sous-titre en blanc, cartes 2
      et 4 décalées vers le bas et agrandies (`aspect-[2/3]`), clic avec sa propre
      transition fluide limitée à la carte cliquée, face arrière épurée
      (description seule) sous voile renforcé `bg-forest/90`
      (voir specs/22)
- [x] `font-display` (Bricolage Grotesque) ne se chargeait plus en local : le log indiquait
      `Failed to download … from Google Fonts`, et tous les titres du site tombaient sur
      `local("Arial")`. Purge de `.next` et redémarrage : police retéléchargée. La
      production n'avait jamais été touchée (voir specs/22)
- [x] Accueil : première diapositive sur le monument de la Paix et trois nouveaux titres
      de bannière, accents de section unifiés (rouge sur fond clair, jaune sur fond vert,
      pastille et mot mis en avant de la même couleur), titres `h2`
      agrandis de 15 %, légende du volet « Découvrir le Togo » réduite aux pastilles et
      bouton renvoyé vers `/togo`, première tuile de la médiathèque remplacée, réseaux
      sociaux sur trois colonnes — `npm run audit` OK
      (voir specs/23-accueil-slider-couleurs-sections.md)
- [x] Page Togo : bannière en pleine hauteur de fenêtre avec voile vert en diagonale
      (coin bas-gauche → coin haut-droit), fiche de région déplacée dans la marge du cadre
      pour ne plus masquer le tracé (sous la carte sur écran étroit), aide « Nord → Sud »
      supprimée, carte 10 des chiffres sur fond jaune, bande blanche avant Communauté
      retirée — `npm run audit` OK (voir specs/21-page-togo-video-carte-chiffres.md)
- [x] Page Belgrade, section « Bienvenue au Togo » : la mascotte en pied remplacée par un
      portrait cadré en rond façon photo de profil (liseré crème, ombre verte) —
      `npm run audit` OK (voir specs/22)
- [x] Page Belgrade : section d'accueil rehaussée ; section des Rythmes refondue — photo
      montrée en premier (plage de retournement calée sur le centre de la carte),
      retournement écrit hors React pour la fluidité, mise en page 70/30 avec grille 3 × 2,
      sixième case de signature, mascottes et logo de la participation à droite —
      `npm run audit` OK (voir specs/22)

Chaque T = 1 run agent avec fichiers autorisés + commande de vérif explicites.
- [22] Belgrade — Rythmes : flip restauré et forme d'origine, rangée basse centrée, mascottes agrandies hors cadre, logo en fond débordant (section inchangée).
- [22] Belgrade — Jeux : section raccourcie, fond cadré par le haut, descriptions des jeux révélées au survol/toucher.
- [22] Belgrade — Talents : logo incrusté au fond dans le coin inférieur droit, descriptions des talents au survol (le clic garde le passage de carte).
- [22] Belgrade — bannière : fond vidéo animé du plan de la statue (remuxé en MP4 sans son), photo en affiche et en repli sous prefers-reduced-motion.
- [22] Belgrade — lueur du hero supprimée, photos Akonto/Vététré et des trois talents remplacées, section Talents agrandie, description révélée par un rideau diagonal.
- [22] Belgrade — ménage du code mort, fond du Cœur du pavillon, section Calendrier officiel (roadmap animée) en remplacement de la galerie, section Médias & presse sur fond rouge.
- [23] Yokohama — refonte complète : direction artistique « herbier vivant », planche des cinq plantes, plan du pavillon en 20 m², règle de mouvement unique.
- [23] Yokohama — bande défilante des cinq plantes et compte à rebours dans la bannière ; suppression des sections stratégie, compte à rebours et galerie.
- [22] Belgrade — section Thème de la participation avec dévoilement du logotype et téléchargement de la charte ; Médias & presse repasse au vert et se réduit à deux documents.
- [22] Belgrade — détails graphiques : galon tissé, tracé à la craie, grain imprimé et battement à trois temps en tête de surtitre.
- [22] Belgrade — habillage graphique de fond retiré après essai : retour aux aplats pleins.
- [24] Belgrade — portrait d'accueil animé au survol (anneau tournant, zoom, liseré jaune), cartes Rythmes retournées au survol et rendues au départ du curseur, cartes et description agrandies, section Thème remontée avant les piliers.
- [25] Nouvelle page `/comite` — composition du Comité National Permanent et ses quatre missions, reprise des deux pages de l'ancien site ; le lien de la section Rayonnement & diplomatie y mène désormais.
- [26] Participations passées — Dubaï 2021, Milan 2015, Shanghai 2010 et Hanovre 2000 racontées : deux thèmes en vis-à-vis, repères chiffrés, récit numéroté, temps forts datés et renvoi vers l'album Flickr (trois langues, servies par `/editions/[slug]`).
- [27] Osaka 2025 — page complète tirée du rapport général : parcours du pavillon en quatre séquences, huit temps forts, bilan chiffré, paroles de visiteurs et mini-médiathèque de dix-neuf photographies avec visionneuse.
- 28 — Yokohama : logotype et herbier en panneaux (`specs/28-yokohama-logo-herbier-panneaux.md`)
- 29 — Nouveau vert #166c54 et bannières neutres (`specs/29-charte-vert-166c54.md`)
- 30 — Page Archives (`specs/30-page-archives.md`)
- 31 — Accueil : premier slide TOGO EXPO, voile allégé, bandeau sans vide, bouton retour en haut rond 50 px et compte-à-rebours au bon jour — `npm run audit` OK (`specs/31-accueil-slide-togo-expo-retour-haut.md`)
- 32 — Accueil : nouveaux visuels des deux rendez-vous 2027 — `npm run audit` OK (`specs/32-accueil-visuels-rendez-vous.md`)
- 33 — Accueil : allègement des voiles des rendez-vous et de la communauté — `npm run audit` OK (`specs/33-accueil-allegement-voiles.md`)
- 34 — Accueil : rendez-vous sans voile, panneau de lecture clair (`specs/34-accueil-rendez-vous-sans-voile.md`)
- 35 — Page À propos (TogoExpo + Comité), /comite → /a-propos, entrée de navbar, refonte design — `npm run audit` OK (`specs/35-page-a-propos.md`)
- 36 — Page Togo : affiche du hero = 1re image de la vidéo du drapeau, nouvelle section Économie — `npm run audit` OK (`specs/36-togo-hero-economie.md`)
- 37 — Retouches : hero Togo, menu Archives, vidéo hero Yokohama, chiffre café/cacao — `npm run audit` OK (`specs/37-retouches-togo-archives-yokohama.md`)
- 38 — Archives : nouvelle frise animée (FriseTimeline), suppression du chapeau de la frise et des crédits photo — `npm run audit` OK (`specs/38-archives-frise.md`)
- 39 — Contact : nouveaux textes, motifs de demande, encart partenaires — `npm run audit` OK (`specs/39-contact.md`)
- 40 — Retouches accueil / À propos (slide 1, carte rendez-vous animée, hero allégé, bandeau Comité, liens ministères, section BIE) — `npm run audit` OK (`specs/40-retouches-accueil-apropos.md`)
- 41 — Archives : photos du hero améliorées ; Belgrade : cartes Rythmes à hauteur variable, plaquettes ZIP — `npm run audit` OK (`specs/41-archives-hd-belgrade-plaquettes.md`)
- 42 — Préparation de la mise en ligne (front) : redirections de l'ancien site, 100 articles, revalidation par article, plugin WP à installer — `npm run audit` OK (`specs/42-migration-front.md`)
