# 06 — Accueil : retrait de l'Agenda, Rayonnement & diplomatie, galerie Pinterest

Fiche de tâche (une tâche = une fiche, cf. AGENTS.md). Périmètre : frontend uniquement.

## 1. Retirer la section « 03 — Agenda »

- Supprimer `frontend/src/components/Agenda.tsx` et son rendu dans `src/app/[lang]/page.tsx`.
- Supprimer les données devenues mortes : bloc `agenda` du dictionnaire (fr / en / ja),
  `AGENDA` et `AgendaItem` dans `src/lib/design.ts`.
- Les CTA du hero pointaient sur `/#agenda` : les rebrancher sur `/#rendez-vous`
  (section « Nos prochains rendez-vous avec le monde »), pour ne laisser aucune ancre morte.
- Renuméroter les pastilles de section : Rayonnement 04 → 03, Médiathèque 05 → 04,
  Actualités 06 → 05, FAQ 07 → 06, dans les trois langues.

Ordre final de la page d'accueil : Hero + bande défilante → 01 Découvrir le Togo →
Le Togo sur la scène internationale → 02 Expositions universelles →
03 Rayonnement & diplomatie → 04 Médiathèque → 05 Actualités → 06 FAQ → Partenaires.

## 2. Section « Qui sommes-nous » → « Rayonnement & diplomatie »

- Renommer la pastille de section : `● 03 — Rayonnement & diplomatie`
  (`Outreach & diplomacy`, `対外発信と外交`). Le titre et les textes restent inchangés.
- Égaliser les deux colonnes : l'image du comité occupe la hauteur restante de la
  colonne de gauche (`flex-1`) pour que texte et image se terminent au même niveau.
  Hauteur plancher en mobile (`min-h-[300px]`, `sm:min-h-[380px]`) puisque les deux
  colonnes sont alors empilées.

## 3. Refonte de la section galerie (médiathèque)

Remplacer la nappe d'images en parallaxe par une mosaïque façon Pinterest.

- Colonnes CSS (`columns-2 md:columns-3 lg:columns-4`), tuiles `break-inside-avoid` :
  hauteurs libres, ratio d'affichage défini par tuile dans `MEDIA_GALLERY`
  (`src/lib/design.ts`, 12 visuels, alternance portraits / paysages).
- Libellés dans le dictionnaire (`mediaWall.tiles` : `tag` + `caption`), trois langues.
- Animations au survol, courbe `cubic-bezier(.16,1,.3,1)` comme l'accordéon des éditions :
  zoom de l'image (1.09, 1100 ms), voile dégradé noir, légende qui remonte,
  pastille `↗` jaune qui apparaît, élévation de la tuile + liseré jaune.
- Accessibilité : chaque tuile est un lien vers `/mediatheque` avec `aria-label`,
  mêmes états au clavier (`group-focus-visible`), voile et légende visibles d'emblée
  sous `md` (pas de survol au tactile), tout neutralisé en `prefers-reduced-motion`.
- La section n'a plus besoin de JS : composant serveur (le parallaxe et son
  `useEffect` disparaissent), seules les révélations au scroll restent clientes.

## Vérification

- `npm run audit` (typecheck + lint + build) vert.
- Page d'accueil des trois langues : plus de section Agenda, pastilles 01 → 06 continues,
  CTA « Voir le calendrier » qui défile jusqu'aux prochains rendez-vous,
  colonnes de la section 03 alignées en bas, mosaïque animée au survol.
