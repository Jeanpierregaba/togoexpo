# 41 — Archives : photos du hero ; Belgrade : cartes Rythmes et plaquettes

## Archives — photos du hero
- Cause du flou : `ed-dubai.webp` ne fait que 640 px de large (étiré en plein écran) ; les autres (1600–1920 px) étaient servies en qualité 75 puis zoomées jusqu'à 112 % par l'effet Ken Burns.
- Script Core Image (Swift, outils macOS intégrés) : agrandissement Lanczos (2 400–2 560 px), réduction du bruit, masque flou proportionnel à l'agrandissement, export JPEG 0,9. Sorties : `public/design/archives/archives-hero-{osaka,dubai,belgrade,milan}.jpg` (originaux conservés). Script : `enhance.swift` (scratchpad de session, à recopier si besoin).
- `HeroSlides` : `quality={90}`.
- Limite : une photo de 640 px ne retrouve pas de détails ; un original de Dubaï plus grand reste préférable.

## Belgrade — Rythmes
- `RhythmCards` : les deux faces partagent la même case de grille (`grid-area: 1/1`) ; la carte garde au minimum son format (4:5 mobile, 3:5 au-delà) et s'allonge si la description est plus longue — plus aucun débordement (vérifié à 1440, 1280, 1024, 375). Description centrée, 14 px (14,5 px dès `xl`). Une carte par ligne sur mobile.

## Belgrade — plaquettes
- ZIP fournis par le client copiés dans `public/downloads/` : `belgrade-plaquettes-rythmes.zip` (DANCE, 14 Mo), `-jeux.zip` (JEUX, 15 Mo), `-talents.zip` (TALENT, 10 Mo).
- Bouton « Télécharger les plaquettes » (pastille jaune, icône, « Fichier ZIP · n Mo ») : Rythmes sous les mascottes, aligné à droite ; Jeux sous le paragraphe ; Talents sous le paragraphe, centré. Dict : `belgrade.brochuresCta`, `brochuresMeta` (FR/EN/JA).
- À signaler au client : `JEUX.zip` contient un doublon « ADITO copie.pdf ».
- Retouche : mention « Fichier ZIP · n Mo » retirée des trois boutons (clé `brochuresMeta` supprimée) ; bouton réduit au libellé + icône.
