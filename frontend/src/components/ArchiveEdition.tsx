import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { AccentTitle, SectionKicker } from '@/components/SectionKicker';
import { ArchiveGallery } from '@/components/ArchiveGallery';
import { CountUp, FilmStrip, HeroSlides, ScrollProgress } from '@/components/ArchiveMotion';
import { ArchiveTimeline } from '@/components/ArchiveTimeline';
import { ARCHIVES, FLICKR_ALBUM, archiveContent, otherArchives, type ArchiveSlug } from '@/lib/archives';
import { EDITION_CREDITS } from '@/lib/design';
import { getDictionary } from '@/i18n/dict';
import { langSlug, lz, type Lang } from '@/i18n/lang';

const PAD = 'px-5 sm:px-8 lg:px-14';
const H2 = 'm-0 font-display text-[clamp(30px,4.2vw,54px)] font-semibold leading-[0.98] tracking-[-0.035em]';

/**
 * Une participation passée, racontée.
 *
 * **Une page pour cinq éditions.** Osaka, Dubaï, Milan, Shanghai et Hanovre
 * partagent la même trame narrative : la bannière, les deux thèmes, les
 * repères, le récit, les temps forts datés, puis l'album. Osaka, dont on
 * dispose du rapport complet et de photographies, y ajoute quatre sections
 * facultatives : le parcours du pavillon, le bilan chiffré, les paroles
 * recueillies et une mini-médiathèque avec visionneuse. Le contenu vient de
 * `src/lib/archives.ts`, dans la langue demandée ; la mise en page est ici. Une
 * édition sans repères chiffrés ou sans section après les temps forts rend
 * simplement une section de moins.
 *
 * **Le fil de lecture.** Les fonds alternent — bannière sombre, thèmes sur
 * crème, récit sur blanc et crème, temps forts sur vert, album sur la
 * photographie de l'édition. Chaque section de récit porte son numéro en très
 * grand, posé en fond : on sait toujours où l'on en est dans l'histoire.
 *
 * **Le mouvement** reste celui du site — `Reveal` pour l'entrée des blocs,
 * `draw-x` / `draw-y` pour les filets qui se tracent, et le chemin vertical des
 * temps forts. Rien ne bouge sous `prefers-reduced-motion`.
 */
export function ArchiveEdition({ slug, lang }: { slug: ArchiveSlug; lang: Lang }) {
  const t = getDictionary(lang);
  const a = t.archive;
  const ed = ARCHIVES[slug];
  const c = archiveContent(slug, lang);
  const credit = EDITION_CREDITS[slug];
  const others = otherArchives(slug);
  // Photographies et légendes sont appariées par leur rang.
  const photos = ed.photos?.map((p, i) => ({ ...p, alt: c.photoAlts?.[i] ?? ed.imageAlt }));
  const pick = (i: number | null | undefined) => (i == null ? undefined : photos?.[i]);
  const slides = ed.heroSlides?.map((i) => ed.photos?.[i]?.src).filter((x): x is string => Boolean(x));
  const strip = ed.strip?.map((i) => ed.photos?.[i]).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const momentPhotos = ed.momentPhotos?.map((row) => row.map((i) => pick(i)).filter((x): x is NonNullable<typeof x> => Boolean(x)));

  // Les sections de récit sont numérotées d'un seul tenant, avant et après les
  // temps forts : le lecteur suit une seule série.
  const story = [...c.blocks, ...c.after];
  const beforeCount = c.blocks.length;

  return (
    <article>
      <ScrollProgress />
      <PageHero
        image={ed.image}
        media={slides && slides.length > 1 ? <HeroSlides slides={slides} /> : undefined}
        height="full"
        labelledBy="archive-title"
        overlay="strong"
        credit={credit}
      >
        <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-cream/75">
          <a href={lz('/', lang)} className="transition hover:text-cream">
            {t.nav[0].label}
          </a>{' '}
          <span aria-hidden="true">/</span>{' '}
          <a href={lz('/editions', lang)} className="transition hover:text-cream">
            {t.editionsIdx.h1}
          </a>{' '}
          <span aria-hidden="true">/</span> {c.city} {ed.year}
        </p>

        <SectionKicker tone="dark" className="mb-5 mt-10">
          {c.kicker}
        </SectionKicker>
        <p className="m-0 mb-7 font-mono text-[13px] uppercase tracking-[0.14em] text-cream/80">{c.dates}</p>
        <h1
          id="archive-title"
          className="m-0 max-w-[20ch] font-display text-[clamp(38px,5.6vw,76px)] font-semibold leading-[0.95] tracking-[-0.04em]"
        >
          <AccentTitle text={c.title} accent={c.accent} tone="dark" />
        </h1>
        <p className="mb-0 mt-7 max-w-[64ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-mist">{c.lead}</p>
        {/* L'invite à défiler : un trait et une flèche qui respirent. */}
        <a
          href="#themes"
          aria-label={a.themeLabel}
          className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/80 transition-colors hover:text-sun"
        >
          <span aria-hidden="true" className="block h-px w-10 bg-current" />
          <span aria-hidden="true" className="scroll-cue inline-block text-base">
            ↓
          </span>
        </a>
      </PageHero>

      {/* Les deux thèmes en vis-à-vis : celui de l'exposition, celui du Togo. */}
      <section id="themes" aria-labelledby="archive-themes" className={`bg-cream py-[90px] text-forest lg:py-[120px] ${PAD}`}>
        <div className="mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker className="mb-10">{a.themeLabel}</SectionKicker>
          </Reveal>
          <h2 id="archive-themes" className="sr-only">
            {a.themeLabel}
          </h2>
          {/* Deux voix, deux traitements : le thème de l'exposition est le
              cadre — carte claire, bordée, en italique ; celui du Togo est la
              réponse — carte verte pleine, plus grande, barrée de jaune. */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch">
            <Reveal className="h-full">
              <div className="flex h-full flex-col rounded-[28px] border border-forest/20 p-8 lg:p-10">
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.16em] text-[#5B6F64]">{a.themeExpoLabel}</p>
                {/* Pas d'italique en japonais : l'oblique de synthèse y est illisible. */}
                <p
                  className={`m-0 mt-6 font-display text-[clamp(20px,2vw,27px)] font-medium leading-snug tracking-[-0.02em] text-[#42574C] ${
                    lang === 'ja' ? '' : 'italic'
                  }`}
                >
                  {c.themeExpo}
                </p>
              </div>
            </Reveal>
            <Reveal delay={140} className="h-full">
              <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-forest p-8 text-cream lg:p-12">
                <span aria-hidden="true" className="draw-y absolute inset-y-0 left-0 w-1.5 bg-sun" />
                <p className="m-0 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sun">
                  <span aria-hidden="true">★</span>
                  {a.themeTogoLabel}
                </p>
                <p className="m-0 mt-6 font-display text-[clamp(25px,3vw,40px)] font-semibold leading-[1.12] tracking-[-0.03em] text-cream">
                  {c.themeTogo}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Les repères chiffrés, quand l'édition en donne. */}
          {c.facts && (
            <ul className="m-0 mt-16 grid list-none gap-px overflow-hidden rounded-3xl bg-forest/15 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {c.facts.map((f, i) => (
                <li key={f.l} className="bg-cream">
                  <Reveal delay={i * 90} className="px-7 py-8">
                    <p className="m-0 font-display text-[clamp(28px,3.2vw,42px)] font-semibold leading-none tracking-[-0.03em] text-pine">
                      {f.v}
                    </p>
                    <p className="m-0 mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#5B6F64]">{f.l}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Le récit, avant les temps forts. */}
      {story.slice(0, beforeCount).map((b, i) => (
        <StoryBlock
          key={b.title}
          block={b}
          n={i + 1}
          id={i === 0 ? 'recit' : undefined}
          kicker={i === 0 ? a.storyKicker : undefined}
          photo={pick(ed.storyPhotos?.[i])}
        />
      ))}

      {/* Le parcours du pavillon, étape par étape. Quatre cartes numérotées
          reliées par un filet : on suit la visite dans l'ordre. */}
      {c.sequence && (
        <section id="parcours" aria-labelledby="archive-sequence" className={`bg-cream py-[90px] text-forest lg:py-[120px] ${PAD}`}>
          <div className="mx-auto max-w-[1360px]">
            <Reveal>
              <SectionKicker className="mb-6">{a.sequenceKicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="archive-sequence" className={`${H2} max-w-[20ch]`}>
                <AccentTitle text={c.sequence.title} accent={c.sequence.accent} tone="light" />
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="m-0 mt-7 max-w-[62ch] text-[17px] leading-relaxed text-[#42574C]">{c.sequence.lead}</p>
            </Reveal>
            <ol className="m-0 mt-14 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {c.sequence.items.map((it, i) => (
                <li key={it.t}>
                  <Reveal delay={i * 110} className="h-full">
                    <div className="group flex h-full flex-col rounded-[24px] border border-[#D3D6C8] bg-white p-7 transition-[border-color,transform] duration-500 ease-[cubic-bezier(.22,1,.26,1)] hover:-translate-y-1.5 hover:border-pine/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                      <p className="m-0 font-display text-[44px] font-semibold leading-none tracking-[-0.04em] text-pine/25 transition-colors duration-500 group-hover:text-blood">
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <span aria-hidden="true" className="draw-x mt-5 block h-0.5 w-full bg-forest/15" />
                      <h3 className="m-0 mt-5 font-display text-[21px] font-semibold leading-tight tracking-[-0.02em] text-forest">{it.t}</h3>
                      <p className="m-0 mt-3 text-[15px] leading-relaxed text-[#42574C]">{it.d}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Les temps forts datés. */}
      <section id="temps-forts" aria-labelledby="archive-moments" className={`relative overflow-hidden bg-forest py-[100px] text-cream lg:py-[130px] ${PAD}`}>
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-[380px] w-[380px] rounded-full bg-sun/15 blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 bottom-0 h-[360px] w-[360px] rounded-full bg-blood/15 blur-[120px]" />
        <div className="relative mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker tone="dark" className="mb-6">
              {a.momentsKicker}
            </SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="archive-moments" className={`${H2} max-w-[20ch]`}>
              <AccentTitle text={c.momentsTitle} accent={c.momentsAccent} tone="dark" />
            </h2>
          </Reveal>
          <div className="mt-14 lg:pl-[8%]">
            <ArchiveTimeline moments={c.moments} photos={momentPhotos} />
          </div>
        </div>
      </section>

      {/* La pellicule : une bande de photographies qui glisse à l'horizontale
          pendant que la page défile. */}
      {strip && strip.length > 0 && <FilmStrip photos={strip} />}

      {/* Le bilan chiffré. Grands chiffres sur crème, séparés par des filets
          plutôt que par des cartes : ce sont des mesures, pas des encarts. */}
      {c.figures && (
        <section id="chiffres" aria-labelledby="archive-figures" className={`bg-cream py-[90px] text-forest lg:py-[120px] ${PAD}`}>
          <div className="mx-auto max-w-[1360px]">
            <Reveal>
              <SectionKicker className="mb-6">{a.figuresKicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="archive-figures" className={`${H2} max-w-[20ch]`}>
                <AccentTitle text={c.figures.title} accent={c.figures.accent} tone="light" />
              </h2>
            </Reveal>
            <dl className="m-0 mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {c.figures.items.map((f, i) => (
                <Reveal key={f.l} delay={(i % 3) * 100}>
                  <div className="border-t-2 border-forest pt-6">
                    <dd className="m-0 font-display text-[clamp(44px,5.4vw,76px)] font-semibold leading-none tracking-[-0.045em] text-forest">
                      <CountUp value={f.v} />
                    </dd>
                    <dt className="mt-4 max-w-[30ch] text-[16px] leading-relaxed text-[#42574C]">{f.l}</dt>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Les paroles recueillies sur place. */}
      {c.voices && (
        <section aria-labelledby="archive-voices" className={`bg-white py-[90px] text-forest lg:py-[120px] ${PAD}`}>
          <div className="mx-auto max-w-[1360px]">
            <Reveal>
              <SectionKicker className="mb-10">{a.voicesKicker}</SectionKicker>
            </Reveal>
            <h2 id="archive-voices" className="sr-only">
              {a.voicesKicker}
            </h2>
            <ul className="m-0 grid list-none gap-6 p-0 lg:grid-cols-3">
              {c.voices.map((v, i) => (
                <li key={v.by}>
                  <Reveal delay={i * 110} className="h-full">
                    {/* La dernière parole est celle du Togo : elle passe sur
                        fond vert, les deux premières restent sur papier. */}
                    <figure
                      className={`m-0 flex h-full flex-col justify-between rounded-[28px] p-8 ${
                        i === c.voices!.length - 1 ? 'bg-forest text-cream' : 'bg-paper text-forest'
                      }`}
                    >
                      <blockquote className="m-0">
                        <span aria-hidden="true" className={`block font-display text-[64px] leading-[0.6] ${i === c.voices!.length - 1 ? 'text-sun' : 'text-blood'}`}>
                          “
                        </span>
                        <p className="m-0 mt-4 font-display text-[clamp(19px,1.7vw,23px)] font-medium leading-snug tracking-[-0.01em]">{v.quote}</p>
                      </blockquote>
                      <figcaption className={`mt-8 font-mono text-[11px] uppercase tracking-[0.14em] ${i === c.voices!.length - 1 ? 'text-cream/70' : 'text-[#5B6F64]'}`}>
                        {v.by}
                      </figcaption>
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* La suite du récit, après les temps forts. */}
      {story.slice(beforeCount).map((b, i) => (
        <StoryBlock key={b.title} block={b} n={beforeCount + i + 1} photo={pick(ed.storyPhotos?.[beforeCount + i])} />
      ))}

      {/* L'album. La photographie de l'édition revient en pleine largeur, voilée
          de vert, et le seul bouton de la section ouvre Flickr. */}
      <section id="images" aria-labelledby="archive-gallery" className={`relative isolate overflow-hidden bg-forest py-[110px] text-cream lg:py-[150px] ${PAD}`}>
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image src={ed.image} alt="" fill className="object-cover" sizes="100vw" />
          <div className={`absolute inset-0 ${photos ? 'bg-forest/95' : 'bg-gradient-to-tr from-forest via-forest/90 via-[45%] to-forest/70'}`} />
        </div>
        <div className="mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker tone="dark" className="mb-6">
              {a.galleryKicker}
            </SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="archive-gallery" className={`${H2} max-w-[16ch]`}>
              <AccentTitle text={c.galleryTitle} accent={c.galleryAccent} tone="dark" />
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="m-0 mt-7 max-w-[60ch] text-[17px] leading-relaxed text-cream/85">{c.galleryPara}</p>
          </Reveal>
          {/* La mini-médiathèque, quand l'édition a ses propres photographies. */}
          {photos && (
            <div className="mt-12">
              <ArchiveGallery
                photos={photos}
                labels={{
                  more: a.photoMore,
                  less: a.photoLess,
                  close: t.media.close,
                  view: t.media.viewAria,
                  prev: a.photoPrev,
                  next: a.photoNext,
                }}
              />
            </div>
          )}
          <Reveal delay={160}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={FLICKR_ALBUM}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-sun px-8 py-4 font-semibold text-forest transition-colors duration-300 hover:bg-cream"
              >
                <span aria-hidden="true" className="grid place-items-center">
                  {/* Les deux points de Flickr. */}
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                    <circle cx={8.3} cy={12} r={3.4} fill="currentColor" />
                    <circle cx={15.7} cy={12} r={3.4} fill="currentColor" />
                  </svg>
                </span>
                {a.galleryCta}
                <span className="sr-only"> — {a.galleryNote}</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
                  ↗
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Les autres participations : on ne quitte pas la page sans savoir où
          aller ensuite. */}
      <section aria-labelledby="archive-others" className={`bg-white py-[90px] text-forest ${PAD}`}>
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <h2 id="archive-others" className="m-0 font-display text-[clamp(24px,2.6vw,34px)] font-semibold tracking-[-0.03em]">
                {a.otherTitle}
              </h2>
            </Reveal>
            <Reveal>
              <a
                href={lz('/editions', lang)}
                className="inline-flex items-center gap-2 border-b-2 border-pine pb-0.5 font-semibold text-pine transition-colors hover:text-forest"
              >
                {a.otherAll} <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          </div>
          <ul className="m-0 mt-10 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o, i) => {
              const oc = archiveContent(o.slug as ArchiveSlug, lang);
              return (
                <li key={o.slug}>
                  <Reveal delay={i * 90}>
                    <a
                      href={lz(`/editions/${langSlug(o.slug, lang)}`, lang)}
                      className="group block overflow-hidden rounded-[24px] border border-[#D3D6C8] bg-paper transition-colors duration-300 hover:border-pine/60"
                    >
                      <span className="relative block aspect-[16/10] overflow-hidden">
                        <Image
                          src={o.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.26,1)] group-hover:scale-105 motion-reduce:transition-none"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
                        />
                        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <span className="absolute bottom-4 left-5 font-mono text-[12px] uppercase tracking-[0.14em] text-sun">
                          {o.year}
                        </span>
                      </span>
                      <span className="block p-6">
                        <span className="block font-display text-[21px] font-semibold tracking-[-0.02em] text-forest">{oc.city}</span>
                        <span className="mt-2 block text-[15px] leading-relaxed text-[#42574C]">{oc.themeExpo}</span>
                      </span>
                    </a>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </article>
  );
}

/**
 * Une section de récit : le numéro en très grand derrière le titre, le titre
 * calé à gauche et qui reste en place pendant la lecture des paragraphes.
 * Les fonds alternent, blanc puis crème, pour séparer les sections sans trait.
 */
function StoryBlock({
  block,
  n,
  id,
  kicker,
  photo,
}: {
  block: { title: string; accent?: string; paras: string[] };
  n: number;
  id?: string;
  kicker?: string;
  photo?: { src: string; w: number; h: number; alt: string };
}) {
  const light = n % 2 === 1;
  // Avec une photographie, le titre et l'image changent de côté d'une section
  // à l'autre : la page ne se lit pas comme une pile de blocs identiques.
  const flip = Boolean(photo) && !light;
  return (
    <section
      id={id}
      aria-labelledby={`archive-story-${n}`}
      className={`relative overflow-hidden py-[90px] text-forest lg:py-[120px] ${light ? 'bg-white' : 'bg-paper'} ${PAD}`}
    >
      {/* Le numéro de la section, posé en fond. Décoratif : il double une
          information déjà donnée par l'ordre de lecture. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 right-2 font-display text-[clamp(120px,18vw,260px)] font-semibold leading-none tracking-[-0.06em] text-forest/[0.045] lg:right-10"
      >
        {String(n).padStart(2, '0')}
      </span>

      <div
        className={`relative mx-auto grid max-w-[1360px] gap-10 lg:gap-20 ${
          flip ? 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'
        }`}
      >
        <div className={`flex flex-col ${photo ? '' : 'lg:sticky lg:top-28 lg:self-start'} ${flip ? 'lg:order-2' : ''}`}>
          {kicker && (
            <Reveal>
              <SectionKicker className="mb-6">{kicker}</SectionKicker>
            </Reveal>
          )}
          <Reveal>
            <h2 id={`archive-story-${n}`} className={`${H2} max-w-[18ch]`}>
              <AccentTitle text={block.title} accent={block.accent} tone="light" />
            </h2>
          </Reveal>
          {/* La photographie occupe toute la hauteur laissée par le titre : les
              deux colonnes finissent sur la même ligne. Elle se découvre de
              haut en bas, puis avance un peu au survol. */}
          {photo && (
            <Reveal delay={140} className="mt-10 flex flex-1 flex-col">
              <figure className="m-0 flex flex-1 flex-col">
                <div className="wipe group relative aspect-[4/3] overflow-hidden rounded-[24px] lg:aspect-auto lg:min-h-[240px] lg:flex-1">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.26,1)] group-hover:scale-[1.06] motion-reduce:transition-none"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-[#5B6F64]">
                  {photo.alt}
                </figcaption>
              </figure>
            </Reveal>
          )}
        </div>

        {/* Si le texte est un peu plus court que la colonne du titre, ses
            paragraphes se répartissent sur toute la hauteur. */}
        <div className="flex flex-col gap-6 lg:justify-between">
          {block.paras.map((p, i) => (
            <Reveal key={i} delay={i * 90}>
              <p
                className={`m-0 leading-relaxed ${
                  i === 0
                    ? 'font-display text-[clamp(19px,1.9vw,24px)] font-medium text-forest'
                    : 'text-[17px] text-[#42574C]'
                }`}
              >
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
