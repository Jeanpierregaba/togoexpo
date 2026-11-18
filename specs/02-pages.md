# 02 — Pages

## / (Accueil)
- Hero : sur-titre "Expositions universelles", H1 "TOGO EXPO — [ville édition future]", thème, 2 CTA (Pavillon / Devenir partenaire). Anim Framer Motion légère.
- Countdown : cible = date_fin édition future. Si passée -> "Événement terminé — découvrez le bilan".
- TimelineEditions : 5 cartes (Osaka 2025, Dubaï 2021, Milan 2015, Shanghai 2010, Hanovre 2000) avec année/ville/pays/thème corrigés.
- Actus : 3 dernières, image + date + excerpt. Vide -> message de branchement, pas de faux articles.
- FAQ : <details> natif, 3-5 vraies QA. Pas de Lorem.
- SEO : title "TogoExpo — Le Togo aux Expositions Universelles", description 150 car, OG image pavillon.

## /editions + /editions/[slug]
- Liste + fiche : hero, infos pratiques, galerie, vidéo, CTA partenaire. ISR 300s.

## /actualites, /mediatheque, /contact
- Actus : grille + page article, lecture < 5 min, pas 30 min.
- Médiathèque : filtre par édition, lightbox, alt text.
- Contact/Partenaire : formulaire FluentForm ou Resend, champs : nom, org, email, type partenariat, message. Confirmation explicite.

## Critères communs
- Mobile first, Lighthouse >= 90, liens jamais `#`, FR/EN vraies routes quand Polylang prêt.
