import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { AccentTitle, SectionKicker } from '@/components/SectionKicker';
import { FriseTimeline } from '@/components/FriseTimeline';
import { CountUp, HeroSlides } from '@/components/ArchiveMotion';
import { PARTICIPATIONS, type Participation } from '@/lib/participations';
import { getDictionary } from '@/i18n/dict';
import { isLang, langAlternates, editionPath, lz, toLang, type Lang } from '@/i18n/lang';
import { withShare } from '@/lib/share';

export const revalidate = 300;

type Props = { params: { lang: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang(params.lang);
  const a = getDictionary(lang).archivePage;
  return withShare(lang, {
    title: `${a.crumb} — ${a.h1}`,
    description: a.lead,
    alternates: langAlternates('/editions', lang),
  });
}

const PAD = 'px-5 sm:px-8 lg:px-14';
const H2 = 'm-0 font-display text-[clamp(32px,4.4vw,54px)] font-semibold leading-[0.98] tracking-[-0.035em]';
// Versions améliorées pour la bannière (agrandies en Lanczos, débruitées et
// renforcées par masque flou — script Core Image, voir specs/41).
const HERO_SLIDES = [
  '/design/archives/archives-hero-osaka.jpg',
  '/design/archives/archives-hero-dubai-2.webp',
  '/design/archives/archives-hero-belgrade.jpg',
  '/design/archives/archives-hero-milan.jpg',
];

type Labels = ReturnType<typeof getDictionary>['archivePage'];

/** Pastille de couleur par famille d'exposition — reprise dans la frise et sur les cartes. */
const DOT: Record<Participation['kind'], string> = {
  universelle: 'bg-forest',
  horticole: 'bg-sun',
  specialisee: 'bg-blood',
};

function kindLabel(p: Participation, a: Labels) {
  return p.kind === 'universelle' ? a.kUniv : p.kind === 'horticole' ? a.kHort : a.kSpec;
}

/**
 * Les archives : toutes les participations du Togo aux expositions
 * internationales, de Montréal 1967 à Riyad 2030.
 *
 * La page se lit en quatre temps : la bannière et ses chiffres, une frise qui
 * pose les douze rendez-vous sur une même ligne, puis les cartes, rangées par
 * famille — universelles, horticoles, en préparation. Une carte n'est un lien
 * que si l'édition a sa page ; sinon elle reste une fiche, sans lien mort.
 */
export default function ArchivesPage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang: Lang = params.lang;
  const t = getDictionary(lang);
  const a = t.archivePage;

  const univ = PARTICIPATIONS.filter((p) => p.kind === 'universelle' && p.status === 'past').sort((x, y) => y.year - x.year);
  const hort = PARTICIPATIONS.filter((p) => p.kind === 'horticole' && p.status === 'past').sort((x, y) => y.year - x.year);
  const prep = PARTICIPATIONS.filter((p) => p.status === 'prep');

  const stats = [
    { v: String(PARTICIPATIONS.length), l: a.statTotal },
    { v: String(univ.length), l: a.statUniv },
    { v: String(hort.length), l: a.statHort },
    { v: String(prep.length), l: a.statPrep },
  ];

  return (
    <>
      <PageHero image={HERO_SLIDES[0]} media={<HeroSlides slides={HERO_SLIDES} />} labelledBy="archives-title" overlay="strong" height="full">
        <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-cream/75">
          <a href={lz('/', lang)} className="transition hover:text-cream">
            {t.nav[0].label}
          </a>{' '}
          <span aria-hidden="true">/</span> {a.crumb}
        </p>
        <SectionKicker tone="dark" className="mb-6 mt-10">
          {a.kicker}
        </SectionKicker>
        <h1 id="archives-title" className="m-0 max-w-[18ch] font-display text-[clamp(38px,5.6vw,76px)] font-semibold leading-[0.95] tracking-[-0.04em]">
          <AccentTitle text={a.h1} accent={a.h1Accent} tone="dark" />
        </h1>
        <p className="mb-0 mt-7 max-w-[60ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-cream/85">{a.lead}</p>
        <dl className="m-0 mt-10 grid max-w-[900px] grid-cols-2 gap-x-8 gap-y-6 border-t border-cream/25 pt-7 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l}>
              <dd className="m-0 font-display text-[clamp(34px,3.6vw,50px)] font-semibold leading-none tracking-[-0.04em] text-sun">
                <CountUp value={s.v} />
              </dd>
              <dt className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-cream/80">{s.l}</dt>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* La frise : les douze participations sur fond vert, animées à
          l'entrée (voir `FriseTimeline`). Les trente années sans
          participation entre 1970 et 2000 sont marquées par une coupure. */}
      <section aria-labelledby="archives-frise" className={`relative isolate overflow-hidden bg-forest py-[100px] text-cream lg:py-[120px] ${PAD}`}>
        <div className="relative mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker tone="dark" className="mb-6">{a.friseKicker}</SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="archives-frise" className={H2}>
              <AccentTitle text={a.friseH2} accent={a.friseAccent} tone="dark" />
            </h2>
          </Reveal>

          <FriseTimeline
            labels={{ gap: a.friseGap, see: a.friseSee, prev: a.frisePrev, next: a.friseNext, pause: a.frisePause, play: a.frisePlay, prep: a.kPrep }}
            items={PARTICIPATIONS.map((p) => ({
              id: p.id,
              year: p.year,
              city: p.text[lang].city,
              country: p.text[lang].country,
              name: p.text[lang].name,
              theme: p.text[lang].theme,
              dates: p.text[lang].dates,
              kind: p.kind,
              kindLabel: kindLabel(p, a),
              prep: p.status === 'prep',
              image: p.image,
            }))}
          />

          {/* Légende. */}
          <ul className="m-0 mt-8 flex list-none flex-wrap gap-x-7 gap-y-3 border-t border-cream/15 p-0 pt-7 font-mono text-[11px] uppercase tracking-[0.12em] text-cream/75">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 rounded-full bg-cream" /> {a.kUniv}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 rounded-full bg-sun" /> {a.kHort}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 rounded-full bg-blood" /> {a.kSpec}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-cream" /> {a.kPrep}
            </li>
          </ul>
        </div>
      </section>

      {/* Les expositions universelles. Osaka 2025 ouvre la grille en grand ;
          les deux éditions sans photographie (1967, 1970) ferment la marche en
          fiches d'archive. */}
      <section id="universelles" aria-labelledby="archives-univ" className={`bg-white py-[100px] text-forest ${PAD}`}>
        <div className="mx-auto max-w-[1360px]">
          <Header kicker={a.univKicker} title={a.univH2} accent={a.univAccent} lead={a.univLead} id="archives-univ" />
          <ul className="m-0 mt-14 grid list-none gap-5 p-0 md:grid-cols-6">
            {univ.map((p, i) => (
              <li key={p.id} id={`p-${p.id}`} className={`scroll-mt-28 ${i === 0 ? 'md:col-span-4' : p.image ? 'md:col-span-2' : 'md:col-span-3'}`}>
                <Reveal delay={(i % 3) * 90} className="h-full">
                  {p.image ? <PhotoCard p={p} lang={lang} a={a} big={i === 0} /> : <TextCard p={p} lang={lang} a={a} />}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Les expositions horticoles. */}
      <section id="horticoles" aria-labelledby="archives-hort" className={`bg-cream py-[100px] text-forest ${PAD}`}>
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <Header kicker={a.hortKicker} title={a.hortH2} accent={a.hortAccent} lead={a.hortLead} id="archives-hort" />
          <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2">
            {hort.map((p, i) => (
              <li key={p.id} id={`p-${p.id}`} className="scroll-mt-28">
                <Reveal delay={i * 100} className="h-full">
                  <TextCard p={p} lang={lang} a={a} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Les préparatifs, sur fond vert : ce qui vient. */}
      <section id="preparatifs" aria-labelledby="archives-prep" className={`bg-forest py-[100px] text-cream ${PAD}`}>
        <div className="mx-auto max-w-[1360px]">
          <Header kicker={a.prepKicker} title={a.prepH2} accent={a.prepAccent} lead={a.prepLead} id="archives-prep" dark />
          <ul className="m-0 mt-14 grid list-none gap-5 p-0 lg:grid-cols-3">
            {prep.map((p, i) => (
              <li key={p.id} id={`p-${p.id}`} className="scroll-mt-28">
                <Reveal delay={i * 100} className="h-full">
                  {p.image ? <PhotoCard p={p} lang={lang} a={a} /> : <TextCard p={p} lang={lang} a={a} dark />}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function Header({ kicker, title, accent, lead, id, dark = false }: { kicker: string; title: string; accent: string; lead: string; id: string; dark?: boolean }) {
  return (
    <div className="grid gap-6 lg:grid-cols-1">
      <div>
        <Reveal>
          <SectionKicker tone={dark ? 'dark' : 'light'} className="mb-6">
            {kicker}
          </SectionKicker>
        </Reveal>
        <Reveal>
          <h2 id={id} className={`${H2} max-w-[20ch]`}>
            <AccentTitle text={title} accent={accent} tone={dark ? 'dark' : 'light'} />
          </h2>
        </Reveal>
      </div>
      <Reveal>
        <p className={`m-0 max-w-[60ch] text-[17px] leading-relaxed ${dark ? 'text-cream/85' : 'text-[#42574C]'}`}>{lead}</p>
      </Reveal>
    </div>
  );
}

/** Carte photo : la photographie de l'édition, un voile neutre, l'essentiel en bas. */
function PhotoCard({ p, lang, a, big = false }: { p: Participation; lang: Lang; a: Labels; big?: boolean }) {
  const text = p.text[lang];
  const inner = (
    <>
      <Image
        src={p.image as string}
        alt=""
        fill
        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.26,1)] group-hover:scale-[1.06] motion-reduce:transition-none"
        sizes={big ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
      />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      <span className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sun px-3 py-1 font-display text-[15px] font-semibold text-forest">{p.year}</span>
        <span className="flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cream backdrop-blur-sm">
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${DOT[p.kind]}`} />
          {kindLabel(p, a)}
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 block p-6 sm:p-7">
        <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-cream/75">{text.name} · {text.country}</span>
        <span className={`mt-2 block font-display font-semibold leading-[0.95] tracking-[-0.035em] text-cream ${big ? 'text-[clamp(36px,4.6vw,64px)]' : 'text-[clamp(28px,2.6vw,38px)]'}`}>
          {text.city}
        </span>
        <span className="mt-3 block max-w-[46ch] text-[14px] leading-snug text-cream/85">« {text.theme} »</span>
        <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.1em] text-cream/65">{text.dates}</span>
        {p.page && (
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-[14px] font-semibold text-forest transition-colors group-hover:bg-sun">
            {p.status === 'prep' ? a.ctaPrep : a.cta}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
              →
            </span>
          </span>
        )}
      </span>
    </>
  );
  const cls = `group relative block h-full overflow-hidden rounded-[24px] bg-ink ${big ? 'min-h-[520px]' : 'min-h-[440px]'}`;
  return p.page ? (
    <a href={lz(editionPath(p.page, lang), lang)} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** Fiche d'archive, sans photographie : l'année en très grand, en filigrane. */
function TextCard({ p, lang, a, dark = false }: { p: Participation; lang: Lang; a: Labels; dark?: boolean }) {
  const text = p.text[lang];
  return (
    <div
      className={`relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-[24px] p-7 sm:p-8 ${
        dark ? 'border border-cream/20 bg-white/[0.06] text-cream' : 'border border-forest/15 bg-paper text-forest'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-6 -right-2 select-none font-display text-[clamp(110px,12vw,170px)] font-semibold leading-none tracking-[-0.06em] ${
          dark ? 'text-cream/[0.08]' : 'text-forest/[0.07]'
        }`}
      >
        {p.year}
      </span>
      <div className="relative flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 font-display text-[15px] font-semibold ${dark ? 'bg-sun text-forest' : 'bg-forest text-cream'}`}>{p.year}</span>
        <span className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] ${dark ? 'text-cream/75' : 'text-[#42574C]'}`}>
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${DOT[p.kind]}`} />
          {p.status === 'prep' ? `${kindLabel(p, a)} · ${a.kPrep}` : p.year < 2000 ? `${kindLabel(p, a)} · ${a.heritage}` : kindLabel(p, a)}
        </span>
      </div>
      <div className="relative mt-10">
        <p className={`m-0 font-mono text-[11px] uppercase tracking-[0.14em] ${dark ? 'text-cream/70' : 'text-[#5B6F64]'}`}>
          {text.name} · {text.country}
        </p>
        <p className="m-0 mt-2 font-display text-[clamp(30px,3vw,42px)] font-semibold leading-[0.95] tracking-[-0.035em]">{text.city}</p>
        <p className={`m-0 mt-4 max-w-[40ch] text-[15px] leading-snug ${dark ? 'text-cream/85' : 'text-[#42574C]'}`}>
          <span className="sr-only">{a.themeLabel} : </span>« {text.theme} »
        </p>
        <p className={`m-0 mt-2 font-mono text-[11px] uppercase tracking-[0.1em] ${dark ? 'text-cream/60' : 'text-forest/55'}`}>{text.dates}</p>
      </div>
    </div>
  );
}
