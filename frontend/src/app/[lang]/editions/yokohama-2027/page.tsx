import type { Metadata } from 'next';
import Image from 'next/image';
import { BAND, ITEM, STAR, TRACK } from '@/components/Marquee';
import { notFound } from 'next/navigation';
import { CountdownPanel } from '@/components/CountdownPanel';
import { Reveal } from '@/components/Reveal';
import { Grow } from '@/components/YokohamaGrow';
import { CountUp } from '@/components/ArchiveMotion';
import { YokohamaPlate } from '@/components/YokohamaPlate';
import { YOKOHAMA_BROCHURES, YOKOHAMA_IMG, YOKOHAMA_LATIN, YOKOHAMA_OPENING } from '@/lib/yokohama';
import { getDictionary } from '@/i18n/dict';
import { isLang, langAlternates, lz, toLang } from '@/i18n/lang';
import { AccentTitle, SectionKicker } from '@/components/SectionKicker';
import { withShare } from '@/lib/share';

export const revalidate = 300;

type Props = { params: { lang: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang(params.lang);
  const t = getDictionary(lang);
  return withShare(lang, {
    title: `${t.yokohama.heroTitleA} ${t.yokohama.heroTitleB} — ${t.yokohama.crumb}`,
    description: t.yokohama.heroLead,
    alternates: langAlternates('/editions/yokohama-2027', lang),
  });
}

/**
 * GREEN×EXPO 2027 Yokohama est une exposition **horticole**. La page emprunte
 * donc son langage à la planche d'herbier : papier quadrillé, planches
 * numérotées en chiffres romains, binômes latins en italique, filets fins
 * plutôt que grosses cartes arrondies. Les angles s'effacent (`rounded-[4px]`
 * au lieu de 26 px), le vert prend toute la place dans la palette du site, et
 * le rouge ne sert plus qu'aux repères.
 *
 * Le mouvement obéit à une seule règle, posée au `globals.css` : **tout
 * pousse**. Les blocs se dévoilent du bas vers le haut, les traits se tracent
 * depuis leur origine, les chiffres montent jusqu'à leur valeur. Rien ne
 * glisse latéralement, rien ne surgit. Une tige verticale accompagne la
 * lecture d'un bout à l'autre des sections centrales.
 */
const SECTION = 'px-5 sm:px-8 lg:px-14';
const KICKER = 'm-0 font-mono text-xs uppercase tracking-[0.1em]';
const H2 = 'm-0 font-display text-[clamp(34px,4.6vw,57px)] font-semibold leading-[0.98] tracking-[-0.035em]';
/** Filet de titre : il se trace sous le mot accentué quand la section arrive. */
const RULE = 'mt-7 block h-px w-24 bg-blood';

export default function YokohamaPage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const t = getDictionary(lang);
  const y = t.yokohama;

  return (
    <>
      {/* ---------------------------------------------------------------
          Bannière. La vidéo d'une pousse qui sort de terre, deux voiles de feuillage qui
          respirent très lentement par-dessus, et la signature du projet en
          bas de page. Pas de `PageHero` ici : cette page a sa propre
          grammaire, et la bannière en est la première phrase.
          --------------------------------------------------------------- */}
      <section aria-labelledby="yokohama-title" className="relative flex min-h-svh flex-col overflow-hidden bg-ink text-cream">
        <div aria-hidden="true" className="absolute inset-0">
          {/* Vidéo de la pousse en boucle, sans son. L'affiche est sa première
              image : elle s'affiche tout de suite, et reste seule sous
              `prefers-reduced-motion` (la vidéo y est masquée). */}
          <Image src="/design/yokohama/hero-poster.jpg" alt="" fill className="object-cover" sizes="100vw" priority />
          <video
            className="hero-video absolute inset-0 h-full w-full object-cover"
            src="/videos/yokohama-banniere.mp4"
            poster="/design/yokohama/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          {/* Voile neutre : le texte est centré, le voile aussi — plus dense au
              centre, il s'efface vers les bords pour laisser voir la vidéo. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.15)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
          {/* Feuillages. Deux couches, deux vitesses, amplitude minuscule :
              une respiration, pas une animation. */}
          <svg viewBox="0 0 400 200" aria-hidden="true" className="yk-sway absolute -left-10 bottom-0 h-[42vh] w-auto opacity-[0.14]">
            <path d="M40 200C40 120 90 60 170 20c-20 90-60 140-130 180Z" fill="#D6E4DD" />
            <path d="M120 200C120 140 160 92 230 62c-18 70-50 110-110 138Z" fill="#D6E4DD" />
          </svg>
          <svg viewBox="0 0 400 200" aria-hidden="true" className="yk-sway-slow absolute -right-12 bottom-0 h-[34vh] w-auto opacity-[0.11]">
            <path d="M360 200C360 120 310 60 230 20c20 90 60 140 130 180Z" fill="#FFCE00" />
          </svg>
        </div>

        <div className="hero-in relative mx-auto flex w-full max-w-[1360px] flex-1 flex-col items-center justify-center px-5 pb-12 pt-36 text-center sm:px-8 lg:px-14">
          <p className={`${KICKER} text-sage`}>
            <a href={lz('/', lang)} className="transition hover:text-cream">{t.nav[0].label}</a>{' '}
            <span aria-hidden="true">/</span>{' '}
            <a href={lz('/editions', lang)} className="transition hover:text-cream">{t.editionsIdx.h1}</a>{' '}
            <span aria-hidden="true">/</span> {y.crumb}
          </p>
          <SectionKicker tone="dark" className="mb-6 mt-10 justify-center">{y.heroKicker}</SectionKicker>
          <h1
            id="yokohama-title"
            className="m-0 mx-auto max-w-[16ch] font-display text-[clamp(40px,6.4vw,82px)] font-semibold leading-[0.92] tracking-[-0.04em]"
          >
            {y.heroTitleA}
            <br />
            <span className="text-sun">{y.heroTitleB}</span>
          </h1>
          <p className="mx-auto mb-0 mt-7 max-w-[58ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-mist">{y.heroLead}</p>

          {/* Le compte à rebours, centré : l'ouverture est la seule date qui
              compte vraiment. */}
          <div className="mt-10 flex justify-center">
            <CountdownPanel lang={lang} target={YOKOHAMA_OPENING} label={y.cdTitle} />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#cinq-plantes"
              className="inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3.5 font-semibold text-forest transition-colors hover:bg-white"
            >
              {y.heroCta2}
            </a>
            <a
              href="#vision-togo"
              className="inline-flex items-center gap-2 rounded-full border border-cream/35 px-6 py-3.5 font-semibold text-cream transition-colors hover:border-cream hover:bg-cream hover:text-forest"
            >
              {y.heroCta1}
            </a>
          </div>
        </div>

        {/* Bande défilante : les cinq plantes passent en continu au pied de la
            bannière, au gabarit commun des bandes du site. La liste est
            triplée pour que le défilement de -50 % de la piste se referme sans
            saut. Décorative : les espèces sont nommées plus bas. */}
        <div aria-hidden="true" className={BAND}>
          <div className={`play-marquee ${TRACK}`}>
            {[...y.plants, ...y.plants, ...y.plants].map((p, i) => (
              <span key={`${p.id}-${i}`} className={`${ITEM} ${i % 5 === 0 ? 'text-sun' : 'text-cream'}`}>
                {p.name}
                <span className={STAR}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Le concept créatif, sur feuille d'herbier. La tige se trace à
          gauche du texte et accompagne la lecture.
          --------------------------------------------------------------- */}
      <section id="vision-togo" aria-labelledby="yokohama-vision" className={`yk-paper py-[110px] text-forest ${SECTION}`}>
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div className="relative pl-7 sm:pl-10">
            {/* La tige. */}
            <Grow
              variant="draw-y"
              as="span"
              className="absolute bottom-2 left-0 top-2 w-px bg-pine/35"
            />
            <Reveal>
              <SectionKicker className="mb-6">{y.visionKicker}</SectionKicker>
            </Reveal>
            <Grow>
              <h2 id="yokohama-vision" className={H2}>
                {y.visionH2a}
                <br />
                <span className="text-blood">{y.visionH2b}</span>
              </h2>
            </Grow>
            <div className="mt-8 flex flex-col gap-5 text-[17px] leading-relaxed text-[#25372E]">
              {y.visionParas.map((p, i) => (
                <Grow key={p} as="p" delay={i * 110} className="m-0">
                  {p}
                </Grow>
              ))}
            </div>
          </div>

          {/* La fiche du thème, présentée comme une étiquette d'herbier :
              filets, petites capitales, pas de carte arrondie. */}
          <Grow delay={140} className="lg:sticky lg:top-28 lg:h-fit">
            <div className="border-l-2 border-pine/40 bg-white/60 p-7">
              <p className={`${KICKER} text-blood`}>{y.themeLabel}</p>
              <p className="m-0 mt-3 font-display text-[21px] font-semibold leading-snug tracking-[-0.02em]">{y.themeQuote}</p>
              <p className="m-0 mt-6 border-t border-forest/15 pt-5 font-mono text-xs uppercase tracking-[0.1em] text-forest/70">
                {y.subThemeLabel}
              </p>
              <p className="m-0 mt-2 leading-relaxed text-[#42574C]">{y.subThemePara}</p>
              <p className="m-0 mt-7 border-t border-forest/15 pt-5 font-display text-[19px] font-semibold italic leading-snug text-pine">
                {y.signature}
              </p>
            </div>
          </Grow>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Le logotype de la participation, présenté comme une planche
          annotée : le logo en grand sur blanc — la version couleur est faite
          pour les fonds clairs —, et sous chaque lettre de « TOGO » un trait
          qui descend vers sa légende.
          --------------------------------------------------------------- */}
      <section id="logotype" aria-labelledby="yokohama-logo" className={`bg-white py-[110px] text-forest ${SECTION}`}>
        <div className="mx-auto grid max-w-[1360px] items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div>
            <Reveal>
              <SectionKicker className="mb-6">{y.logoKicker}</SectionKicker>
            </Reveal>
            <Grow>
              <h2 id="yokohama-logo" className={H2}>
                {y.logoH2a}
                <br />
                <span className="text-blood">{y.logoH2b}</span>
              </h2>
            </Grow>
            <Grow delay={120}>
              <p className="m-0 mt-8 max-w-[52ch] text-[17px] leading-relaxed text-[#25372E]">{y.logoPara}</p>
            </Grow>
            <Grow delay={200}>
              <p className="m-0 mt-6 max-w-[52ch] border-l-2 border-blood/70 pl-5 leading-relaxed text-[#42574C]">{y.logoNote}</p>
            </Grow>
          </div>

          <figure className="m-0">
            <Grow delay={100}>
              <div className="group border border-forest/15 bg-white p-7 sm:p-12">
                <Image
                  src={YOKOHAMA_IMG.logo}
                  alt={y.logoAlt}
                  width={2000}
                  height={1162}
                  className="h-auto w-full transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.26,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                  sizes="(max-width: 1024px) 90vw, 54vw"
                />
              </div>
            </Grow>
            {/* Les quatre légendes. Sur grand écran, chaque trait tombe à
                l'aplomb de sa lettre ; les colonnes ont la même marge
                intérieure que la planche pour rester alignées. */}
            <figcaption className="px-0 sm:px-12">
              <ol className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-8 p-0 sm:grid-cols-4">
                {y.logoMarks.map((m, i) => (
                  <li key={m.t} className="relative flex flex-col items-center pt-4 text-center sm:pt-12">
                    <Grow
                      variant="draw-y"
                      as="span"
                      delay={300 + i * 140}
                      className="absolute left-1/2 top-0 hidden h-9 w-px bg-pine/45 sm:block"
                    />
                    <Grow delay={420 + i * 140}>
                      <span aria-hidden="true" className="block font-mono text-[11px] tracking-[0.18em] text-blood">
                        {m.l}
                      </span>
                      <span className="mt-2 block font-display text-[19px] font-semibold leading-tight tracking-[-0.02em] text-forest">{m.t}</span>
                      <span className="mt-1.5 block text-[14px] leading-snug text-[#42574C]">{m.d}</span>
                    </Grow>
                  </li>
                ))}
              </ol>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          L'herbier : cinq panneaux de photographie sur fond vert. Plus de
          notice par plante ici — on montre, le détail viendra dans sa propre
          section.
          --------------------------------------------------------------- */}
      <section id="cinq-plantes" aria-labelledby="yokohama-herbier" className={`bg-forest py-[110px] text-cream ${SECTION}`}>
        <div className="mx-auto max-w-[1360px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-14">
            <div>
              <Reveal>
                <SectionKicker tone="dark" className="mb-6">{y.herbKicker}</SectionKicker>
              </Reveal>
              <Grow>
                <h2 id="yokohama-herbier" className={H2}>
                  {y.herbH2a} {y.herbH2b}
                  <br />
                  <span className="text-sun">{y.herbH2c}</span>
                </h2>
              </Grow>
            </div>
            <Grow delay={120}>
              <p className="m-0 text-[17px] leading-relaxed text-cream/80">{y.herbLead}</p>
            </Grow>
          </div>
        </div>
        <Grow delay={100} className="mx-auto mt-14 max-w-[1560px]">
          <YokohamaPlate lang={lang} />
        </Grow>
      </section>

      {/* ---------------------------------------------------------------
          Les plantes, gardiennes de nos savoirs. Trois plantes de savoirs,
          trois planches : la photographie d'un côté, le récit de l'autre, en
          alternance, et sous chaque récit la plaquette d'information à
          télécharger. Tant qu'une plaquette n'est pas déposée, son bouton
          reste visible mais inactif, avec la mention « bientôt disponible ».
          --------------------------------------------------------------- */}
      <section id="savoirs" aria-labelledby="yokohama-savoirs" className={`yk-paper py-[110px] text-forest ${SECTION}`}>
        <div className="mx-auto max-w-[1360px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-14">
            <div>
              <Reveal>
                <SectionKicker className="mb-6">{y.knowledgeKicker}</SectionKicker>
              </Reveal>
              <Grow>
                <h2 id="yokohama-savoirs" className={`${H2} max-w-[18ch]`}>
                  <AccentTitle text={y.knowledgeH2} accent={y.knowledgeAccent} tone="light" />
                </h2>
              </Grow>
            </div>
            <Grow delay={120}>
              <p className="m-0 text-[17px] leading-relaxed text-[#42574C]">{y.knowledgeLead}</p>
            </Grow>
          </div>

          <ol className="m-0 mt-20 flex list-none flex-col gap-[100px] p-0 lg:gap-[130px]">
            {y.knowledge.map((k, i) => {
              const flip = i % 2 === 1;
              const img = YOKOHAMA_IMG[k.id as keyof typeof YOKOHAMA_IMG];
              const latin = YOKOHAMA_LATIN[y.plants.findIndex((p) => p.id === k.id)];
              const brochure = YOKOHAMA_BROCHURES[k.id as keyof typeof YOKOHAMA_BROCHURES];
              return (
                <li key={k.id} aria-labelledby={`savoir-${k.id}`} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                  <Grow delay={80} className={flip ? 'lg:order-2' : ''}>
                    <figure className="group m-0">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-forest/15">
                        <Image
                          src={img}
                          alt={k.alt}
                          fill
                          className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.26,1)] group-hover:scale-[1.05] motion-reduce:transition-none"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        {/* Coins d'onglet, comme un spécimen monté sur sa feuille. */}
                        <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-10 w-10 border-l-2 border-t-2 border-sun" />
                        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2 border-sun" />
                      </div>
                      <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-forest/15 pt-3">
                        <span className="font-mono text-[12px] italic text-forest/60">{latin}</span>
                        <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.18em] text-forest/40">
                          {String(i + 1).padStart(2, '0')} / {String(y.knowledge.length).padStart(2, '0')}
                        </span>
                      </figcaption>
                    </figure>
                  </Grow>

                  <div className={`relative ${flip ? 'lg:order-1' : ''}`}>
                    <Reveal>
                      <p className={`${KICKER} text-blood`}>{k.cat}</p>
                    </Reveal>
                    <Grow>
                      <h3
                        id={`savoir-${k.id}`}
                        className="m-0 mt-5 font-display text-[clamp(38px,4.8vw,62px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]"
                      >
                        {k.name}
                      </h3>
                    </Grow>
                    <Grow delay={100}>
                      <p className="m-0 mt-5 max-w-[30ch] font-display text-[clamp(20px,1.9vw,25px)] font-semibold leading-snug tracking-[-0.02em] text-pine">
                        {k.tagline}
                      </p>
                    </Grow>
                    <div className="mt-7 flex max-w-[60ch] flex-col gap-5 text-[17px] leading-relaxed text-[#25372E]">
                      {k.paras.map((p, j) => (
                        <Grow key={j} as="p" delay={160 + j * 100} className="m-0">
                          {p}
                        </Grow>
                      ))}
                    </div>
                    <Grow delay={260} className="mt-9">
                      <DownloadButton href={brochure} label={y.knowledgeCta} />
                    </Grow>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Les cultures, richesses de nos terres : le café et le cacao. Les
          chiffres clés d'abord, en bandeau vert — la filière avant les
          plantes —, puis une planche par culture : la photographie, ses deux
          chiffres, le récit, et l'invitation au pavillon.
          --------------------------------------------------------------- */}
      <section id="cultures" aria-labelledby="yokohama-cultures" className={`bg-white py-[110px] text-forest ${SECTION}`}>
        <div className="mx-auto max-w-[1360px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-14">
            <div>
              <Reveal>
                <SectionKicker className="mb-6">{y.cropsKicker}</SectionKicker>
              </Reveal>
              <Grow>
                <h2 id="yokohama-cultures" className={`${H2} max-w-[18ch]`}>
                  <AccentTitle text={y.cropsH2} accent={y.cropsAccent} tone="light" />
                </h2>
              </Grow>
            </div>
            <Grow delay={120}>
              <p className="m-0 text-[17px] leading-relaxed text-[#42574C]">{y.cropsLead}</p>
            </Grow>
          </div>

          {/* Les chiffres clés, en exergue. */}
          <Grow delay={80} className="mt-16">
            <dl aria-label={y.cropsFiguresLabel} className="m-0 grid gap-px overflow-hidden rounded-[4px] bg-cream/15 sm:grid-cols-2 lg:grid-cols-3">
              {y.cropsFigures.map((f) => (
                <div key={f.v} className="yk-paper-dark flex flex-col gap-3 p-7 text-cream lg:p-9">
                  <dd className="m-0 flex items-baseline gap-3 font-display text-[clamp(40px,4.6vw,64px)] font-semibold leading-none tracking-[-0.04em] text-sun">
                    <CountUp value={f.v} />
                    {f.up && (
                      <span aria-hidden="true" className="text-[0.5em] text-sage">
                        ↗
                      </span>
                    )}
                  </dd>
                  <dt className="max-w-[32ch] text-[15px] leading-snug text-cream/80">{f.l}</dt>
                </div>
              ))}
            </dl>
          </Grow>

          <ol className="m-0 mt-[110px] flex list-none flex-col gap-[110px] p-0 lg:gap-[140px]">
            {y.crops.map((c, i) => {
              const flip = i % 2 === 1;
              const img = YOKOHAMA_IMG[c.id as keyof typeof YOKOHAMA_IMG];
              const latin = YOKOHAMA_LATIN[y.plants.findIndex((p) => p.id === c.id)];
              return (
                <li key={c.id} aria-labelledby={`culture-${c.id}`} className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
                  <Grow delay={80} className={`lg:sticky lg:top-28 ${flip ? 'lg:order-2' : ''}`}>
                    <figure className="group m-0">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] border border-forest/15">
                        <Image
                          src={img}
                          alt={c.alt}
                          fill
                          className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.26,1)] group-hover:scale-[1.05] motion-reduce:transition-none"
                          sizes="(max-width: 1024px) 100vw, 45vw"
                        />
                        <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-10 w-10 border-l-2 border-t-2 border-sun" />
                        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2 border-sun" />
                      </div>
                      <figcaption className="mt-3 border-t border-forest/15 pt-3 font-mono text-[12px] italic text-forest/60">{latin}</figcaption>
                    </figure>
                  </Grow>

                  <div className={flip ? 'lg:order-1' : ''}>
                    <Grow>
                      <h3
                        id={`culture-${c.id}`}
                        className="m-0 font-display text-[clamp(38px,4.8vw,62px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]"
                      >
                        {c.name}
                      </h3>
                    </Grow>
                    <Grow delay={100}>
                      <p className="m-0 mt-5 max-w-[30ch] font-display text-[clamp(20px,1.9vw,25px)] font-semibold leading-snug tracking-[-0.02em] text-pine">
                        {c.tagline}
                      </p>
                    </Grow>

                    {/* Les deux chiffres de la culture. */}
                    <dl className="m-0 mt-9 grid grid-cols-2 gap-px border-y border-forest/15 bg-forest/15">
                      {c.stats.map((st, k) => (
                        <Grow key={st.v} as="div" delay={160 + k * 120} className={`flex flex-col gap-2 bg-white py-6 pr-4 ${k ? 'pl-5' : ''}`}>
                          <dd className="m-0 font-display text-[clamp(30px,3.4vw,46px)] font-semibold leading-none tracking-[-0.035em] text-blood">
                            <CountUp value={st.v} />
                          </dd>
                          <dt className="text-[14px] leading-snug text-[#42574C]">{st.l}</dt>
                        </Grow>
                      ))}
                    </dl>

                    <div className="mt-9 flex max-w-[60ch] flex-col gap-5 text-[17px] leading-relaxed text-[#25372E]">
                      {c.paras.map((p, j) => (
                        <Grow key={j} as="p" delay={200 + j * 100} className="m-0">
                          {p}
                        </Grow>
                      ))}
                    </div>

                    {/* L'invitation au pavillon. */}
                    <Grow delay={300}>
                      <p className="m-0 mt-9 max-w-[52ch] border-l-[3px] border-sun bg-[#faf8f0] py-5 pl-6 pr-5 font-display text-[clamp(18px,1.6vw,21px)] font-semibold leading-snug tracking-[-0.015em] text-forest">
                        {c.invite}
                      </p>
                    </Grow>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Les trois piliers, sur fond vert quadrillé. Chaque pilier est une
          colonne séparée d'un filet, numérotée — pas une carte.
          --------------------------------------------------------------- */}
      <section aria-labelledby="yokohama-piliers" className={`yk-paper py-[110px] text-forest ${SECTION}`}>
        <div className="mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker className="mb-6">{y.pillarsKicker}</SectionKicker>
          </Reveal>
          <Grow>
            <h2 id="yokohama-piliers" className={`${H2} max-w-[20ch]`}>
              <AccentTitle text={y.pillarsH2} accent={y.pillarsAccent} tone="light" />
            </h2>
          </Grow>
          <ol className="m-0 mt-14 grid list-none gap-px border-y border-forest/15 bg-forest/15 p-0 md:grid-cols-3">
            {y.pillars.map((p, i) => (
              <Grow as="li" key={p.t} delay={i * 140} className="yk-paper p-8 lg:p-10">
                <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.18em] text-blood">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="m-0 mt-5 font-display text-[clamp(24px,2.4vw,31px)] font-semibold leading-none tracking-[-0.025em]">
                  {p.t}
                </h3>
                <p className="m-0 mt-4 leading-relaxed text-[#42574C]">{p.d}</p>
              </Grow>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Documentation, journal, galerie.
          --------------------------------------------------------------- */}
      <section aria-labelledby="yokohama-doc" className={`bg-white py-[110px] text-forest ${SECTION}`}>
        <div className="mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker className="mb-6">{y.docKicker}</SectionKicker>
          </Reveal>
          <Grow>
            <h2 id="yokohama-doc" className={H2}>
              <AccentTitle text={y.docH2} accent={y.docAccent} tone="light" />
            </h2>
          </Grow>
          <Grow variant="draw-x" as="span" className={RULE} delay={200} />
          <Grow delay={120}>
            <p className="m-0 mt-7 max-w-[70ch] text-[17px] leading-relaxed text-[#42574C]">{y.docLead}</p>
          </Grow>
          <ul className="m-0 mt-12 grid list-none gap-px border-y border-forest/15 bg-forest/15 p-0 md:grid-cols-3">
            {y.docs.map((d, i) => (
              <Grow as="li" key={d.t} delay={i * 130} className="flex flex-col gap-3 bg-white p-8">
                <h3 className="m-0 font-display text-[23px] font-semibold tracking-[-0.02em]">{d.t}</h3>
                <p className="m-0 flex-1 leading-relaxed text-[#42574C]">{d.d}</p>
                <span className="mt-3 w-fit border border-forest/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-forest/55">
                  {y.docSoon}
                </span>
              </Grow>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="yokohama-journal" className={`yk-paper py-[90px] text-forest ${SECTION}`}>
        <div className="mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker className="mb-6">{y.newsKicker}</SectionKicker>
          </Reveal>
          <Grow>
            <h2 id="yokohama-journal" className={H2}>
              <AccentTitle text={y.newsH2} accent={y.newsAccent} tone="light" />
            </h2>
          </Grow>
          <Grow delay={120}>
            <p className="m-0 mt-8 border-l-2 border-pine/40 bg-white/60 p-8 leading-relaxed text-[#42574C]">{y.newsPara}</p>
          </Grow>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Signature de fin, reprise du titre de la bannière.
          --------------------------------------------------------------- */}
      <section aria-labelledby="yokohama-fin" className={`yk-paper-dark py-[120px] text-cream ${SECTION}`}>
        <div className="mx-auto max-w-[1360px] text-center">
          <Reveal>
            <SectionKicker tone="dark">{y.endKicker}</SectionKicker>
          </Reveal>
          <Grow>
            <h2
              id="yokohama-fin"
              className="m-0 mt-6 font-display text-[clamp(37px,5.29vw,67px)] font-semibold leading-[0.98] tracking-[-0.035em]"
            >
              {y.endH2a}
              <br />
              <span className="text-sun">{y.endH2b}</span>
            </h2>
          </Grow>
          <Grow variant="draw-x" as="span" className="mx-auto mt-8 block h-px w-24 bg-sun" delay={200} />
          <Grow delay={140}>
            <p className="mx-auto m-0 mt-8 max-w-[62ch] text-[clamp(16px,1.3vw,19px)] leading-relaxed text-cream/80">
              {y.endPara}
            </p>
          </Grow>
          <Grow delay={220}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href={lz('/togo', lang)}
                className="inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3.5 font-semibold text-forest transition-colors hover:bg-white"
              >
                {y.endCta1}
              </a>
              <a
                href={lz('/contact', lang)}
                className="inline-flex items-center gap-2 rounded-full border border-cream/35 px-6 py-3.5 font-semibold text-cream transition-colors hover:border-cream hover:bg-cream hover:text-forest"
              >
                {y.endCta2}
              </a>
            </div>
          </Grow>
        </div>
      </section>
    </>
  );
}

/**
 * Le bouton de plaquette : pastille verte, flèche dans un disque jaune qui
 * descend au survol. Tant que le fichier n'est pas déposé (`href` nul), le
 * bouton garde son dessin mais ne mène nulle part — pas de lien `#`.
 */
function DownloadButton({ href, label }: { href: string | null; label: string }) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sun text-[15px] text-forest transition-transform duration-300 group-hover/dl:translate-y-0.5 motion-reduce:transition-none"
      >
        ↓
      </span>
      <span className="pr-2">{label}</span>
      <span aria-hidden="true" className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/55">
        PDF
      </span>
    </>
  );
  const cls =
    'group/dl inline-flex items-center gap-3 rounded-full bg-forest py-2 pl-2 pr-6 font-semibold text-cream shadow-[0_18px_40px_-24px_rgba(14,70,55,0.9)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-pine motion-reduce:transition-none motion-reduce:hover:translate-y-0';
  return href ? (
    <a href={href} download className={cls}>
      {inner}
    </a>
  ) : (
    <span aria-disabled="true" className={cls}>
      {inner}
    </span>
  );
}
