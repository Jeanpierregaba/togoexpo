import type { Metadata } from 'next';
import Image from 'next/image';
import { BAND, ITEM, STAR, TRACK } from '@/components/Marquee';
import { notFound } from 'next/navigation';
import { BelgradeRoadmap } from '@/components/BelgradeRoadmap';
import { CountdownPanel } from '@/components/CountdownPanel';
import { GameTiles } from '@/components/GameTiles';
import { TalentCards } from '@/components/TalentCards';
import { Reveal } from '@/components/Reveal';
import { RhythmCards } from '@/components/RhythmCards';
import { BELGRADE_IMG, BELGRADE_OFFICIAL_URL, BELGRADE_OPENING, BELGRADE_PRESS_DOCS, BELGRADE_STATUE, BELGRADE_STATUE_VIDEO } from '@/lib/belgrade';
import { getDictionary } from '@/i18n/dict';
import { isLang, langAlternates, lz, toLang, type Lang } from '@/i18n/lang';
import { AccentTitle, SectionKicker } from '@/components/SectionKicker';

export const revalidate = 300;

type Props = { params: { lang: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang(params.lang);
  const t = getDictionary(lang);
  return {
    title: `${t.belgrade.heroTitle} — ${t.belgrade.crumb}`,
    description: t.belgrade.heroLead,
    alternates: langAlternates('/editions/belgrade-2027', lang),
  };
}

const PAD = 'px-5 sm:px-8 lg:px-14';
const KICKER = 'm-0 font-mono text-xs uppercase tracking-[0.1em]';
const H2 = 'm-0 font-display text-[clamp(37px,5.06vw,64px)] font-semibold leading-[0.95] tracking-[-0.038em]';

/**
 * Bannière « terrain de jeu » : dégradé irisé animé, signature géante et mascotte.
 * La page l'affiche deux fois d'affilée : le même composant est rendu avec un
 * `idSuffix` pour que chaque `<h1>` garde un `aria-labelledby` unique.
 *
 * `variant="statue"` remplace le dégradé par la photo de la statue de Belgrade et
 * y superpose le ruban animé. La mascotte est alors retirée : elle occupait la
 * droite de la bannière, là où se trouve la statue.
 */
function BelgradeHero({
  b,
  lang,
  idSuffix,
  priority,
  variant = 'play',
  marquee = null,
}: {
  b: ReturnType<typeof getDictionary>['belgrade'];
  lang: Lang;
  idSuffix: string;
  priority: boolean;
  variant?: 'play' | 'statue';
  /** Bandeau signature, rendu en bas du hero. Sur la bannière « statue » il est
   *  remonté ici et le duo bannière + bandeau occupe toute la hauteur d'écran,
   *  comme le hero de l'accueil. */
  marquee?: readonly string[] | null;
}) {
  const t = getDictionary(lang);
  const titleId = `belgrade-title${idSuffix}`;
  const statue = variant === 'statue';
  return (
    <section
      aria-labelledby={titleId}
      className={`${statue ? 'bg-forest' : 'play-gradient'} relative flex flex-col overflow-hidden text-cream ${statue ? 'min-h-svh' : 'min-h-[86vh]'}`}
    >
      {statue ? (
        <>
          {/* La photo porte déjà son ruban de drapeau : on ne redessine rien par-
              dessus, deux rubans se concurrencent et le nouveau traverserait le
              socle à plat. */}
          <Image
            src={BELGRADE_STATUE}
            alt=""
            fill
            priority={priority}
            className="object-cover object-right"
            sizes="100vw"
          />
          {/* Même plan, animé : le drapeau ondule et le ciel bouge. La photo
              ci-dessus reste dessous, en affiche avant le chargement et seule
              sous `prefers-reduced-motion`, où `.hero-video` est masquée. */}
          <video
            className="hero-video absolute inset-0 h-full w-full object-cover object-right"
            src={BELGRADE_STATUE_VIDEO}
            poster={BELGRADE_STATUE}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />          {/* Voile : il assombrit surtout la gauche, où se pose le texte, et
              laisse la statue et le ruban lisibles à droite. En portrait le
              recadrage ramène la statue au centre, sous le texte : on ajoute
              alors un voile plein, plus dense. */}
          <div aria-hidden="true" className="absolute inset-0 bg-black/40 lg:hidden" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/5" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
        </>
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-black/35" />
      )}
      {/* `flex-1` quand le bandeau est présent : le hero occupe alors toute la
          hauteur restante, bandeau compris, comme sur la page d'accueil. */}
      <div
        className={`hero-in relative mx-auto grid w-full max-w-[1360px] gap-10 px-5 pt-28 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end lg:px-14 ${marquee ? 'flex-1 content-end pb-8 lg:pb-10' : 'pb-16'}`}
      >
        <div>
          <p className={`${KICKER} text-cream/75`}>
            <a href={lz('/', lang)} className="transition hover:text-sun">{t.nav[0].label}</a>{' '}
            <span aria-hidden="true">/</span>{' '}
            <a href={lz('/editions', lang)} className="transition hover:text-sun">{t.editionsIdx.h1}</a>{' '}
            <span aria-hidden="true">/</span> {b.crumb}
          </p>
          <SectionKicker tone="dark" className="mb-6 mt-10">{b.heroKicker}</SectionKicker>
          <h1
            id={titleId}
            className="m-0 font-display text-[clamp(44px,7vw,96px)] font-semibold leading-[0.95] tracking-[-0.04em] drop-shadow-[0_18px_40px_rgba(0,30,20,0.45)]"
          >
            {/* Deux lignes, coupées après la virgule : « Du Togo, » / « pour le monde ». */}
            {b.heroTitle.split(/(?<=[,、])\s*/).map((part, i) => (
              <span key={i} className="block">{part}</span>
            ))}
          </h1>
          <p className="mb-0 mt-7 max-w-[58ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-cream/90">
            {b.heroLead}
          </p>
          {/* Le compte à rebours remplace l'ancienne ligne de dates ; sans
              intitulé visible, il est nommé pour les lecteurs d'écran. */}
          <div className="mt-7 w-fit max-w-full">
            <CountdownPanel
              lang={lang}
              variant="dark"
              target={BELGRADE_OPENING}
              label={b.idEventName}
            />
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#rythmes"
              className="inline-flex items-center gap-2.5 rounded-full bg-forest px-7 py-4 font-semibold text-cream transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              {b.heroCta1}
              <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-sun text-forest">→</span>
            </a>
            <a
              href="#coeur"
              className="inline-flex items-center gap-2.5 rounded-full bg-cream/95 px-7 py-4 font-semibold text-forest transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              {b.heroCta2}
              <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-forest text-sun">→</span>
            </a>
          </div>
        </div>
        {/* La mascotte ouvre la page, posée dans un galet comme sur l'habillage de l'Expo.
            Absente de la bannière « statue » : la photo occupe déjà la droite. */}
        {!statue && (
          <div className="play-float relative mx-auto w-full max-w-[320px] lg:mx-0 lg:max-w-none">
            <div className="play-blob-1 relative aspect-[4/5] overflow-hidden bg-cream/95 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
              <Image
                src={BELGRADE_IMG.mascotte}
                alt={b.mascotAlt}
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 1024px) 60vw, 30vw"
                priority={priority}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bandeau signature, en bas de la bannière « statue » : le duo occupe toute
          la hauteur de l'écran. */}
      {marquee && (
        <div aria-hidden="true" className={BAND}>
          <div className={`play-marquee ${TRACK}`}>
            {marquee.map((word, i) => (
              <span key={`${word}-${i}`} className={`${ITEM} ${i % 4 === 3 ? 'text-sun' : 'text-cream'}`}>
                {word}
                <span className={STAR}>✦</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function BelgradePage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const t = getDictionary(lang);
  const b = t.belgrade;
  const marquee = [...b.marquee, ...b.marquee, ...b.marquee];

  return (
    <>
      {/* Bannière « terrain de jeu » : la première est passée sur la photo de la
          statue et se termine par le bandeau signature, la seconde garde le
          dégradé irisé et la mascotte. */}
      <BelgradeHero b={b} lang={lang} idSuffix="" priority variant="statue" marquee={marquee} />

      {/* Mot d'accueil, entre les deux bannières : texte à gauche, mascotte à droite. */}
      <section aria-labelledby="belgrade-accueil" className={`bg-white py-[130px] text-forest lg:py-[165px] ${PAD}`}>
        <div className="mx-auto grid max-w-[1360px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <SectionKicker className="mb-6">{b.welcomeKicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="belgrade-accueil" className={`${H2} max-w-[18ch]`}>
                {b.welcomeTitle}
              </h2>
            </Reveal>
            <Reveal delay={100} className="mt-8 flex flex-col gap-5 text-[17px] leading-relaxed text-[#25372E]">
              {b.welcomeParas.map((p, i) => (
                <p key={i} className={`m-0 ${i === 0 ? 'text-[19px] text-forest' : ''}`}>
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal delay={180}>
              <a
                href={lz('/togo', lang)}
                className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-forest px-7 py-4 font-semibold text-cream transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              >
                {b.welcomeCta}
                <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-sun text-forest">→</span>
              </a>
            </Reveal>
          </div>
          {/* Portrait en rond, à la façon d'une photo de profil : cercle plein,
              liseré crème et halo vert pour le détacher du fond blanc.

              Au survol, le portrait s'anime : la photo s'agrandit dans son
              cercle, le liseré passe au jaune, l'ombre se creuse et un anneau
              pointillé se met à tourner autour. Le survol est porté par le
              conteneur et non par le cercle, pour que l'anneau — posé en
              dehors — reste allumé quand le curseur l'effleure. Son animation
              est en pause hors survol : rien ne tourne en permanence. */}
          <Reveal delay={140}>
            <div className="group relative mx-auto aspect-square w-full max-w-[420px]">
              <span
                aria-hidden="true"
                className="portrait-ring pointer-events-none absolute -inset-4 rounded-full border-2 border-dashed border-pine/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
              />
              <div className="relative h-full w-full overflow-hidden rounded-full border-[6px] border-cream shadow-[0_34px_80px_-40px_rgba(14,70,55,0.85)] transition-[border-color,box-shadow] duration-500 group-hover:border-sun group-hover:shadow-[0_44px_90px_-38px_rgba(14,70,55,0.95)] motion-reduce:transition-none">
                <Image
                  src={BELGRADE_IMG.accueilPortrait}
                  alt={b.welcomeAlt}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.26,1)] group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 1024px) 85vw, 420px"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Thème de la participation & dévoilement du logotype. Le thème est
          annoncé avant les trois piliers qui le servent : on dit d'abord ce
          que le Togo vient défendre, on détaille ensuite comment. Le fond vert
          tranche avec le blanc du mot d'accueil qui précède, et le logotype
          couleur est posé sur une plaque blanche — la charte réserve cette
          version aux fonds blancs et clairs. */}
      <section id="theme" aria-labelledby="belgrade-theme" className={`relative overflow-hidden bg-forest py-[110px] text-cream lg:py-[140px] ${PAD}`}>
        {/* Deux halos très doux, comme sur Rythmes. */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-0 h-[380px] w-[380px] rounded-full bg-sun/15 blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-blood/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1360px] items-center gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="m-0 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-cream">
                <span aria-hidden="true" className="h-0.5 w-7 shrink-0 bg-sun" />
                {b.themeKicker}
              </p>
            </Reveal>
            <Reveal>
              <h2 id="belgrade-theme" className={`${H2} m-0 mt-6`}>
                {b.themeH2a}
                <br />
                <span className="text-sun">{b.themeH2b}</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="m-0 mt-7 max-w-[56ch] text-[17px] leading-relaxed text-cream/85">{b.themeIntro}</p>
            </Reveal>

            {/* Le thème international, dont celui du Togo est la déclinaison. */}
            <Reveal delay={160}>
              <div className="mt-9 border-l-2 border-sun/60 pl-6">
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-sun">{b.themeExpoLabel}</p>
                <p className="m-0 mt-2 font-display text-[clamp(18px,1.8vw,23px)] font-semibold italic leading-snug text-cream">
                  {b.themeExpoQuote}
                </p>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href="/documents/charte-graphique-togo-expo-belgrade-2027.pdf"
                  download
                  className="group inline-flex items-center gap-3 rounded-full bg-sun px-7 py-4 font-semibold text-forest transition-colors hover:bg-cream"
                >
                  {b.themeCharteCta}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none">
                    ↓
                  </span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Le dévoilement. La plaque monte et le logotype se découvre. */}
          <Reveal delay={140}>
            <figure className="m-0">
              <div className="relative overflow-hidden rounded-[28px] bg-white p-8 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)] sm:p-12">
                <Image
                  src={BELGRADE_IMG.logoCouleur}
                  alt={b.themeLogoAlt}
                  width={1529}
                  height={877}
                  className="h-auto w-full"
                  sizes="(max-width: 1024px) 90vw, 44vw"
                />
              </div>
              <figcaption className="mt-5">
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-sun">{b.themeLogoLabel}</p>
                <p className="m-0 mt-3 text-[15px] leading-relaxed text-cream/80">{b.themeLogoPara}</p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Les trois piliers, l'onglet « Rythmes » : cinq danses, cinq régions.
          Le dégradé.irisé de l'ancienne bannière passe ici. */}
      <section
        id="rythmes"
        aria-labelledby="belgrade-rythmes"
        className={`play-gradient relative overflow-hidden py-[110px] text-cream lg:py-[140px] ${PAD}`}
      >
        {/* Deux halos très doux donnent du relief au dégradé sans le charger. */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-sun/20 blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-blood/20 blur-[120px]" />

        {/* Logo de la participation : il appartient au décor, pas au contenu.
            Posé dans le coin inférieur droit, il déborde de la section, que
            `overflow-hidden` recadre — il peut donc grandir autant qu'on veut
            sans jamais allonger la section d'un pixel. */}
        <Image
          src={BELGRADE_IMG.logoExpoTogo}
          alt=""
          aria-hidden="true"
          width={1125}
          height={967}
          className="pointer-events-none absolute -bottom-16 -right-10 h-auto w-[280px] opacity-30 sm:w-[400px] lg:-bottom-24 lg:-right-16 lg:w-[620px]"
        />

        <div className="relative mx-auto max-w-[1360px]">
          <div className="max-w-[46ch]">
            <Reveal>
              {/* `SectionKicker` imposerait du jaune : ici le titre de section
                  est blanc, seule la pastille garde l'accent. */}
              <p className="m-0 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-cream">
                <span aria-hidden="true" className="h-0.5 w-7 shrink-0 bg-sun" />
                {b.pillarsH2}
              </p>
            </Reveal>
            <Reveal>
              <h2 id="belgrade-rythmes" className={`${H2} m-0 mt-6`}>
                {b.rhythmsTitle}
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="m-0 mt-5 font-display text-[clamp(20px,2.1vw,27px)] font-semibold text-cream/90">
                {b.pillars[0].hook}
              </p>
            </Reveal>
          </div>

          {/* Deux colonnes : les cartes à gauche, les mascottes à droite. La
              colonne de droite est assez large pour que les mascottes montent
              presque à la hauteur du bloc de cartes. */}
          <div className="mt-14 grid gap-10 lg:grid-cols-[64fr_36fr] lg:items-end lg:gap-8">
            <Reveal delay={140}>
              <RhythmCards lang={lang} />
            </Reveal>

            <Reveal delay={220}>
              {/* Les mascottes sont posées à même le dégradé : pas de cadre,
                  pas de fond, seulement leur ombre portée. */}
              {/* Les mascottes débordent vers la droite, dans la gouttière de
                  la page : elles gagnent en hauteur sans empiéter sur les
                  cartes. */}
              <div className="relative mx-auto aspect-[1122/1402] w-[78%] max-w-[420px] lg:ml-0 lg:mr-[-14%] lg:w-[114%] lg:max-w-none">
                <Image
                  src={BELGRADE_IMG.mascottesDuo}
                  alt={b.mascottesAlt}
                  fill
                  className="object-contain object-bottom drop-shadow-[0_30px_46px_rgba(0,0,0,0.5)]"
                  sizes="(max-width: 1024px) 78vw, 42vw"
                />
              </div>
              <div className="mt-6 flex justify-center lg:justify-end">
                <BrochuresButton href="/downloads/belgrade-plaquettes-rythmes.zip" label={b.brochuresCta} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Les trois piliers, l'onglet « Jeux » : Adito, Ampé, Akonto, Vététré.
          Fond photo fixe façon Communauté : le fond est attaché au cadre
          d'affichage (`bg-fixed`), seule la section glisse par-dessus. */}
      <section id="jeux" aria-labelledby="belgrade-jeux" className={`relative isolate w-full overflow-hidden bg-forest py-[104px] text-cream lg:py-[136px] ${PAD}`}>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[url('/design/belgrade/jeux-ampe.jpg')] bg-cover bg-fixed bg-top"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />
        <div className="relative mx-auto grid max-w-[1360px] items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <Reveal>
              {/* Même titre de section que Rythmes : blanc, seule la pastille
                  garde l'accent jaune. */}
              <p className="m-0 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-cream">
                <span aria-hidden="true" className="h-0.5 w-7 shrink-0 bg-sun" />
                {b.pillarsH2}
              </p>
            </Reveal>
            <Reveal>
              <h2 id="belgrade-jeux" className={`${H2} m-0 mt-6`}>
                {b.pillars[1].title}
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="m-0 mt-6 font-display text-[clamp(20px,2.1vw,27px)] font-semibold text-cream">
                {b.pillars[1].hook}
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p className="m-0 mt-5 max-w-[62ch] text-[17px] leading-relaxed text-cream/85">
                {b.pillars[1].intro}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-8">
                <BrochuresButton href="/downloads/belgrade-plaquettes-jeux.zip" label={b.brochuresCta} />
              </div>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <GameTiles lang={lang} />
          </Reveal>
        </div>
      </section>

      {/* Les trois piliers, l'onglet « Talents » : fresques, sculpture, lokpo.
          Même dégradé irisé que Rythmes, en miroir : les cartes à gauche, les
          textes à droite. */}
      <section id="talents" aria-labelledby="belgrade-talents" className={`play-gradient relative overflow-hidden py-[150px] text-cream lg:py-[200px] ${PAD}`}>
        {/* Pendant du logo de Rythmes, à la même taille et au même coin : il
            s'incruste au dégradé en bas à droite. Comme il déborde de la
            section, que `overflow-hidden` recadre, il n'en change pas la
            hauteur. */}
        <Image
          src={BELGRADE_IMG.logoExpoTogo}
          alt=""
          aria-hidden="true"
          width={1125}
          height={967}
          className="pointer-events-none absolute -bottom-16 -right-10 h-auto w-[280px] opacity-30 sm:w-[400px] lg:-bottom-24 lg:-right-16 lg:w-[620px]"
        />

        <div className="relative mx-auto grid max-w-[1360px] items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <Reveal delay={140} className="order-2 lg:order-1">
            <TalentCards lang={lang} />
          </Reveal>
          <div className="order-1 text-center lg:order-2">
            <Reveal>
              {/* Titre de section blanc comme sur Rythmes, seule la pastille
                  garde l'accent jaune. Texte centré pour répondre aux cartes. */}
              <p className="m-0 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-cream">
                <span aria-hidden="true" className="h-0.5 w-7 shrink-0 bg-sun" />
                {b.pillarsH2}
              </p>
            </Reveal>
            <Reveal>
              <h2 id="belgrade-talents" className={`${H2} m-0 mt-6`}>
                {b.pillars[2].title}
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="m-0 mt-6 font-display text-[clamp(20px,2.1vw,27px)] font-semibold text-cream">
                {b.pillars[2].hook}
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p className="mb-0 ml-auto mr-auto mt-5 max-w-[62ch] text-[17px] leading-relaxed text-cream/85">
                {b.pillars[2].intro}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-8 flex justify-center">
                <BrochuresButton href="/downloads/belgrade-plaquettes-talents.zip" label={b.brochuresCta} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* Le cœur du pavillon : Évala, fond photo fixe façon Communauté. */}
      <section id="coeur" aria-labelledby="belgrade-coeur" className={`relative isolate w-full overflow-hidden bg-forest py-[130px] text-cream lg:py-[170px] ${PAD}`}>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[url('/design/belgrade/coeur-lutte.webp')] bg-cover bg-fixed bg-center"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />
        <div className="relative mx-auto max-w-[1360px]">
          <div className="mx-auto max-w-[80ch] text-center">
            <Reveal>
              <p className="m-0 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-cream">
                <span aria-hidden="true" className="h-0.5 w-7 shrink-0 bg-sun" />
                {b.coeurKicker}
              </p>
            </Reveal>
            <Reveal>
              <h2 id="belgrade-coeur" className={`${H2} m-0 mt-6`}>
                {b.coeurTitle}
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mb-0 ml-auto mr-auto mt-6 max-w-[72ch] text-[17px] leading-relaxed text-cream/85">
                {b.coeurPara}
              </p>
            </Reveal>
          </div>
          <ul className="m-0 mt-14 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {b.coeurValues.map((v, i) => (
              <li key={v.name}>
                <Reveal delay={i * 80} className="h-full">
                  <div className="h-full rounded-[20px] bg-forest/85 p-6 ring-1 ring-cream/25 backdrop-blur-sm">
                    <p className="m-0 font-mono text-sm font-bold text-sun">{String(i + 1).padStart(2, '0')}</p>
                    <p className="m-0 mt-3 font-display text-[clamp(22px,2vw,28px)] font-semibold leading-tight tracking-[-0.02em] text-cream">
                      {v.name}
                    </p>
                    <p className="m-0 mt-2 text-[15px] leading-relaxed text-cream/80">{v.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Calendrier officiel */}
      <section id="calendrier" aria-labelledby="belgrade-calendrier" className={`bg-white py-[100px] text-forest ${PAD}`}>
        <div className="mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker className="mb-6">{b.roadKicker}</SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="belgrade-calendrier" className={H2}>
              <AccentTitle text={b.roadH2} accent={b.roadAccent} tone="light" />
            </h2>
          </Reveal>
          <Reveal>
            <p className="mb-14 mt-6 max-w-[72ch] text-[17px] leading-relaxed text-[#42574C]">{b.roadLead}</p>
          </Reveal>
          <BelgradeRoadmap lang={lang} />
        </div>
      </section>


      {/* Communiqués & journal */}
      <section aria-labelledby="belgrade-journal" className={`bg-cream py-[100px] text-forest ${PAD}`}>
        <div className="mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker className="mb-6">{b.newsKicker}</SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="belgrade-journal" className={H2}>
              <AccentTitle text={b.newsH2} accent={b.newsAccent} tone="light" />
            </h2>
          </Reveal>
          <Reveal>
            <p className="mb-8 mt-6 max-w-[72ch] text-[17px] leading-relaxed text-[#42574C]">{b.newsPara}</p>
          </Reveal>
          <Reveal>
            <p className="m-0 rounded-[28px] border border-dashed border-forest/25 bg-paper p-10 leading-relaxed text-[#42574C]">
              {b.newsSoon}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Médias & presse : les documents officiels, sur aplat rouge. */}
      <section id="presse" aria-labelledby="belgrade-presse" className={`bg-white py-[110px] text-forest ${PAD}`}>
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-20">
          <div>
            <Reveal>
              <p className="m-0 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-blood">
                <span aria-hidden="true" className="h-0.5 w-7 shrink-0 bg-blood" />
                {b.pressKicker}
              </p>
            </Reveal>
            <Reveal>
              {/* « jusqu'à Belgrade » passe en rouge, comme sur fond clair
                  ailleurs : `AccentTitle` découpe le titre sans supposer
                  l'ordre des mots, ce qui tient aussi en japonais. */}
              <h2 id="belgrade-presse" className={`${H2} m-0 mt-6`}>
                <AccentTitle text={b.pressH2} accent={b.pressAccent} tone="light" />
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="m-0 mt-6 max-w-[46ch] text-[17px] leading-relaxed text-[#42574C]">{b.pressLead}</p>
            </Reveal>
          </div>

          <ul className="m-0 list-none p-0">
            {b.pressDocs.map((d, i) => {
              const doc = BELGRADE_PRESS_DOCS[i];
              const ready = Boolean(doc?.href);
              return (
                <li key={d.t} className="border-t border-forest/20 last:border-b">
                  <Reveal delay={i * 80}>
                    {/* Tant que le fichier n'est pas fourni, la ligne reste
                        affichée mais inerte : pas de lien mort. */}
                    {ready ? (
                      <a
                        href={doc.href as string}
                        download
                        className="group flex items-center justify-between gap-6 py-6 no-underline transition-colors hover:text-blood"
                      >
                        <span>
                          <span className="block font-display text-[clamp(18px,1.6vw,22px)] font-semibold leading-tight">{d.t}</span>
                          <span className="mt-1 block text-[14px] leading-snug text-[#42574C]">{d.d}</span>
                        </span>
                        <span aria-hidden="true" className="shrink-0 text-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <div className="flex items-center justify-between gap-6 py-6">
                        <span>
                          <span className="block font-display text-[clamp(18px,1.6vw,22px)] font-semibold leading-tight">{d.t}</span>
                          <span className="mt-1 block text-[14px] leading-snug text-[#42574C]">{d.d}</span>
                        </span>
                        <span className="shrink-0 rounded-full border border-forest/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-forest/70">
                          {b.pressSoonLabel}
                        </span>
                      </div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

    </>
  );
}

/** Bouton de téléchargement des plaquettes d'un pilier (archive ZIP). */
function BrochuresButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      className="group inline-flex items-center gap-3 rounded-full bg-sun py-1.5 pl-1.5 pr-6 font-semibold text-forest shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)] transition-colors hover:bg-white hover:text-blood"
    >
      <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-forest text-sun transition-transform duration-300 group-hover:translate-y-0.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
        </svg>
      </span>
      <span>{label}</span>
    </a>
  );
}
