# 39 — Page Contact

## Contenu (client, FR ; EN/JA traduits)
- Hero : sur-titre « Nous contacter », titre « Nous sommes à votre écoute. », chapeau « Vous souhaitez obtenir des informations… ? ». Titre d'onglet « Contact — Nous sommes à votre écoute ».
- Formulaire : « Comment pouvons-nous vous accompagner ? ». Motifs : demande d'information, participation à une exposition, partenariat, presse et médias, autre demande.
- Encart entreprises et partenaires : « Vous souhaitez contribuer au rayonnement du Togo ? » + texte + bouton « Proposer une collaboration ».

## Design
- Colonne gauche : encart partenaires (vert, filet jaune), carte « Nos coordonnées » (adresse, e-mail, téléphone avec pictogrammes), liens utiles. Colonne droite : formulaire.
- Motifs en pastilles (boutons radio stylés, `fieldset`/`legend`), motif actif en vert. Le champ « Type de partenariat » (liste) est supprimé ; l'e-mail passe sur toute la largeur.
- Le bouton de l'encart mène à `/contact?motif=partenariat#formulaire` : motif présélectionné et défilement jusqu'au formulaire.

## API `/api/contact`
- Motifs acceptés : `information`, `exposition`, `partenariat`, `presse`, `autre` (+ `lettre` pour la lettre d'information). Validation par `hasOwnProperty` (pas de clés héritées). Objet du mail : `[Libellé du motif] Nom — Organisation` ; corps : « Motif : … ».

## Vérif
- `npm run audit` ; API : `partenariat` → ok, `toString` / `institutionnel` → refusés ; FR/EN/JA ; 375 px sans débordement.

## Complément
- Hero en pleine hauteur (`height="full"`), voile `light` + photo éclaircie (`bright`), ombre douce sur le titre et le chapeau.
- Titre : « Nous sommes à votre écoute. » → « Une question, un projet ? Parlons-en. » (EN « A question, a project? Let's talk. », JA « ご質問もご相談も、お気軽にどうぞ。 »).
