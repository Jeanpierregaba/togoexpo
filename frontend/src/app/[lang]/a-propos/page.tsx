import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CountUp } from '@/components/ArchiveMotion';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { AccentTitle, SectionKicker } from '@/components/SectionKicker';
import { getDictionary } from '@/i18n/dict';
import { isLang, langAlternates, lz } from '@/i18n/lang';
import { PARTICIPATIONS } from '@/lib/participations';
import { withShare } from '@/lib/share';

export const revalidate = 300;

type Props = { params: { lang: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = isLang(params.lang) ? params.lang : 'fr';
  const t = getDictionary(lang);
  return withShare(lang, {
    title: t.about.metaTitle,
    description: t.about.metaDesc,
    alternates: langAlternates('/a-propos', lang),
  });
}

const PAD = 'px-5 sm:px-8 lg:px-14';

/** Icônes des cinq ambitions, dans l'ordre du dictionnaire : informer,
 *  valoriser, partager, préserver, connecter. */
const ICON = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const AMBITION_ICONS: ReactNode[] = [
  <svg key="informer" {...ICON}><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></svg>,
  <svg key="valoriser" {...ICON}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" /></svg>,
  <svg key="partager" {...ICON}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></svg>,
  <svg key="preserver" {...ICON}><rect x="3" y="4" width="18" height="5" rx="1" /><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" /><path d="M10 13h4" /></svg>,
  <svg key="connecter" {...ICON}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>,
];

/** Pictogrammes de la carte BIE : innovations, cultures, avenir commun. */
const BIE_ICONS: ReactNode[] = [
  <svg key="innovations" {...ICON} width={20} height={20}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" /></svg>,
  <svg key="cultures" {...ICON} width={20} height={20}><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>,
  <svg key="avenir" {...ICON} width={20} height={20}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>,
];

/** Surlignage façon marqueur jaune, posé sur le bas des lettres. */
const MARKER = 'bg-[linear-gradient(transparent_58%,rgba(255,206,0,0.55)_58%)] box-decoration-clone px-0.5';

/** Met en valeur les segments `accents` trouvés dans `text`, dans l'ordre
 *  (jaune par défaut, ou la classe fournie). */
function highlight(text: string, accents: string[], cls = 'text-sun') {
  const out: ReactNode[] = [];
  let rest = text;
  accents.forEach((acc, i) => {
    const at = rest.indexOf(acc);
    if (at < 0) return;
    out.push(rest.slice(0, at), <span key={i} className={cls}>{acc}</span>);
    rest = rest.slice(at + acc.length);
  });
  out.push(rest);
  return out;
}
const H2 = 'm-0 font-display text-[clamp(32px,4.4vw,57px)] font-semibold leading-[0.95] tracking-[-0.035em]';

/**
 * À propos : TogoExpo d'abord, puis le Comité National Permanent qui le porte.
 *
 * **TogoExpo.** Ce qu'est la plateforme (bannière), sa vocation et sa mission
 * (photo + texte), ses cinq ambitions (cartes numérotées), sa vision (« Une
 * fenêtre ouverte sur le monde »).
 *
 * **Le Comité.** Reprise de l'ancienne page `/comite` (redirigée ici en 308) :
 * une bannière-photo ouvre le chapitre, puis la composition et les missions.
 * La présidence ferme la liste de composition, détachée sur fond vert.
 */
export default function AboutPage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const t = getDictionary(lang);
  const a = t.about;
  const c = t.comite;
  const first = Math.min(...PARTICIPATIONS.map((x) => x.year));
  const stats = [
    { v: String(PARTICIPATIONS.length), l: a.stats.total },
    { v: String(first), l: a.stats.first },
    { v: String(PARTICIPATIONS.filter((x) => x.status === 'prep').length), l: a.stats.prep },
  ];

  return (
    <>
      <PageHero image="/design/about-pavillon-togo.jpg" height="full" labelledBy="about-hero-title" overlay="home" bright>
        <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-cream/75">
          <a href={lz('/', lang)} className="transition hover:text-cream">
            {c.crumbHome}
          </a>{' '}
          <span aria-hidden="true">/</span> {a.crumb}
        </p>
        <SectionKicker tone="dark" className="mb-6 mt-10">
          {a.heroKicker}
        </SectionKicker>
        <h1
          id="about-hero-title"
          className="m-0 [text-shadow:0_2px_24px_rgba(0,0,0,0.5)] max-w-[18ch] font-display text-[clamp(38px,6vw,84px)] font-semibold leading-[0.95] tracking-[-0.045em]"
        >
          {highlight(a.heroTitle, a.heroAccents)}
        </h1>
        <p className="mb-0 mt-7 max-w-[58ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-cream [text-shadow:0_1px_14px_rgba(0,0,0,0.6)]">{a.heroSub}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={lz('/#rendez-vous', lang)}
            className="group inline-flex items-center gap-2.5 rounded-full bg-sun px-7 py-3.5 font-semibold text-forest transition-colors hover:bg-white hover:text-blood"
          >
            {a.ctaNext}
            <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <a
            href={lz('/editions', lang)}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-black/20 px-7 py-3.5 font-semibold text-cream backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-forest"
          >
            {a.ctaArchives}
          </a>
        </div>
      </PageHero>

      {/* Togo Expo, en deux temps. En haut, la vocation : photo de la parade à
          gauche, la phrase en grand à droite avec ses trois idées surlignées
          au marqueur jaune. En bas, un bandeau vert de chiffres clés (tirés du
          registre des participations) qui se termine par l'accès aux archives. */}
      <section id="togoexpo" aria-labelledby="about-intro" className={`bg-white pb-[90px] pt-[100px] text-forest lg:pb-[110px] lg:pt-[130px] ${PAD}`}>
        <div className="mx-auto max-w-[1360px]">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            <Reveal className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] lg:aspect-[5/6]">
                <Image src="/design/about-parade-togo.jpg" alt={a.introAlt} fill className="object-cover" style={{ objectPosition: '45% 50%' }} sizes="(max-width: 1024px) 100vw, 40vw" />
              </div>
            </Reveal>
            <div className="order-1 lg:order-2">
              <Reveal>
                <SectionKicker className="mb-8">{a.introLabel}</SectionKicker>
              </Reveal>
              <Reveal>
                <p id="about-intro" className="m-0 font-display text-[clamp(26px,3.1vw,46px)] font-medium leading-[1.22] tracking-[-0.025em] text-forest">
                  {highlight(a.intro, a.introAccents, MARKER)}
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal delay={120} className="mt-16 lg:mt-24">
            <div className="grid overflow-hidden rounded-[28px] bg-forest text-cream sm:grid-cols-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,3fr)_minmax(0,3fr)_minmax(0,2.4fr)]">
              <p className="m-0 px-7 pt-7 font-mono text-[11px] uppercase tracking-[0.14em] text-sun sm:col-span-3 lg:hidden">{a.statsLabel}</p>
              <dl className="contents">
                {stats.map((st) => (
                  <div key={st.l} className="border-b border-white/10 px-7 py-7 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:py-10 lg:pl-10">
                    <dt className="sr-only">{st.l}</dt>
                    <dd className="m-0 font-display text-[clamp(40px,4.4vw,64px)] font-semibold leading-none tracking-[-0.03em] text-sun">
                      <CountUp value={st.v} />
                    </dd>
                    <dd className="m-0 mt-3 max-w-[22ch] text-[15px] leading-snug text-cream/85">{st.l}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={lz('/editions', lang)}
                className="group flex items-center justify-between gap-4 border-t border-white/10 bg-white/[0.04] px-7 py-7 font-semibold transition-colors hover:bg-sun hover:text-forest sm:col-span-3 lg:col-span-1 lg:flex-col lg:items-start lg:justify-center lg:border-l lg:border-t-0 lg:py-10"
              >
                <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-sun transition-colors group-hover:text-forest lg:block">{a.statsLabel}</span>
                <span className="text-[17px]">{a.windowCta}</span>
                <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full border border-current text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission : texte à gauche, photo encadrée de coins jaunes à droite
          (la section précédente a sa photo à gauche : on alterne). */}
      <section id="mission" aria-labelledby="about-mission" className={`bg-white pb-[110px] text-forest lg:pb-[140px] ${PAD}`}>
        <div className="mx-auto grid max-w-[1360px] items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <Reveal className="group relative p-3 sm:p-4 lg:order-2">
            <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-14 w-14 rounded-tl-[22px] border-l-[3px] border-t-[3px] border-sun" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-14 w-14 rounded-br-[22px] border-b-[3px] border-r-[3px] border-sun" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
              <Image src="/design/about-public-drapeaux.jpg" alt={a.missionAlt} fill className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none" sizes="(max-width: 1024px) 100vw, 55vw" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <SectionKicker className="mb-6">{a.missionKicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="about-mission" className={`${H2} max-w-[15ch]`}>
                <AccentTitle text={a.missionTitle} accent={a.missionAccent} tone="light" />
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="m-0 mt-9 max-w-[50ch] border-l-[3px] border-sun pl-6 text-[clamp(16px,1.3vw,19px)] leading-relaxed text-[#42574C]">
                {a.missionText}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Les cinq ambitions, en grille : le titre occupe la première case,
          chaque ambition a sa carte (icône, numéro, verbe, phrase). Au survol,
          la carte passe au vert, l'icône au jaune. */}
      <section id="ambitions" aria-labelledby="about-ambitions" className={`bg-cream py-[100px] text-forest lg:py-[130px] ${PAD}`}>
        <div className="mx-auto grid max-w-[1360px] gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <div className="flex flex-col justify-end pb-4 sm:col-span-2 lg:col-span-1 lg:pb-6 lg:pr-6">
            <Reveal>
              <SectionKicker className="mb-6">{a.ambitionsKicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="about-ambitions" className={`${H2} max-w-[14ch]`}>
                <AccentTitle text={a.ambitionsTitle} accent={a.ambitionsAccent} tone="light" />
              </h2>
            </Reveal>
          </div>
          {/* `contents` : les cartes restent des cases de la grille parente. */}
          <ol className="contents">
          {a.ambitions.map((m, i) => (
            <li key={m.t}>
              <Reveal delay={i * 80} className="h-full">
                <div className="group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-[28px] border border-[#E2DFD3] bg-white p-8 transition-colors duration-500 hover:border-forest hover:bg-forest lg:min-h-[300px]">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      aria-hidden="true"
                      className="grid h-14 w-14 place-items-center rounded-2xl bg-forest/[0.06] text-forest transition-colors duration-500 group-hover:bg-sun group-hover:text-forest"
                    >
                      {AMBITION_ICONS[i]}
                    </span>
                    <span className="font-display text-[44px] font-semibold leading-none tracking-[-0.04em] text-forest/10 transition-colors duration-500 group-hover:text-cream/20">
                      {`0${i + 1}`}
                    </span>
                  </div>
                  <h3 className="m-0 mt-auto pt-10 font-display text-[clamp(26px,2.4vw,34px)] font-semibold leading-none tracking-[-0.03em] text-forest transition-colors duration-500 group-hover:text-sun">
                    {m.t}
                  </h3>
                  <p className="m-0 mt-4 text-[15px] leading-relaxed text-[#42574C] transition-colors duration-500 group-hover:text-cream/90">{m.d}</p>
                </div>
              </Reveal>
            </li>
          ))}
          </ol>
        </div>
      </section>

      {/* La vision : texte à gauche, collage de deux photos à droite (cérémonie
          aux drapeaux, joueur de kora en médaillon). */}
      <section id="vision" aria-labelledby="about-vision" className={`overflow-hidden bg-white py-[100px] text-forest lg:py-[140px] ${PAD}`}>
        <div className="mx-auto grid max-w-[1360px] items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <div>
            <Reveal>
              <SectionKicker className="mb-6">{a.windowKicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="about-vision" className={`${H2} max-w-[14ch]`}>
                <AccentTitle text={a.windowTitle} accent={a.windowAccent} tone="light" />
              </h2>
            </Reveal>
            <Reveal delay={100} className="mt-9 flex max-w-[52ch] flex-col gap-5 text-[clamp(16px,1.3vw,19px)] leading-relaxed text-[#42574C]">
              {a.windowParas.map((p, i) => (
                <p key={p} className={`m-0 ${i === 0 ? 'font-medium text-forest' : ''}`}>
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal delay={160}>
              <a
                href={lz('/editions', lang)}
                className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-forest px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-pine"
              >
                {a.windowCta}
                <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Reveal>
          </div>
          <div className="relative pb-16 sm:pb-24 lg:pl-10">
            <Reveal className="relative aspect-[5/4] overflow-hidden rounded-[28px]">
              <Image src="/design/about-vision-ceremonie.jpg" alt={a.windowAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </Reveal>
            <Reveal delay={180} className="absolute bottom-0 left-0 w-[46%] lg:-left-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border-[6px] border-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]">
                <Image src="/design/about-vision-kora.jpg" alt={a.windowAlt2} fill className="object-cover" sizes="(max-width: 1024px) 46vw, 24vw" />
              </div>
            </Reveal>
            <span aria-hidden="true" className="absolute -right-2 top-8 hidden h-24 w-24 rounded-tr-[28px] border-r-[3px] border-t-[3px] border-sun sm:block lg:-right-5 lg:-top-5" />
          </div>
        </div>
      </section>

      {/* Ouverture du chapitre Comité : bannière photo, voile neutre léger,
          dense seulement à gauche sous le texte. */}
      <section id="comite" aria-labelledby="comite-title" className={`relative overflow-hidden bg-ink py-[110px] text-cream lg:py-[140px] ${PAD}`}>
        <div aria-hidden="true" className="absolute inset-0">
          <Image src="/design/comite-delegation.jpg" alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 via-[45%] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[1360px] [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">
          <Reveal>
            <SectionKicker tone="dark" className="mb-6">
              {c.bannerKicker}
            </SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="comite-title" className={`${H2} max-w-[18ch]`}>
              <AccentTitle text={c.bannerTitle} accent={c.bannerAccent} tone="dark" />
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-7 flex max-w-[62ch] flex-col gap-4 text-[clamp(16px,1.3vw,19px)] leading-relaxed text-cream/90">
            {c.bannerParas.map((p) => (
              <p key={p} className="m-0">
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={160}>
            <dl className="m-0 mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {c.stats.map((s) => (
                <div key={s.l}>
                  <dt className="sr-only">{s.l}</dt>
                  <dd className="m-0 font-display text-3xl font-semibold text-sun">{s.v}</dd>
                  <dd className="m-0 mt-1 text-sm text-cream/80">{s.l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* La composition. En-tête sur deux colonnes (titre / chapeau), puis
          les trois ministères en cartes, avec leurs directions rattachées ;
          les cinq organismes membres en rangée de tuiles ; la présidence
          ferme la section dans un bandeau vert. */}
      <section id="composition" aria-labelledby="comite-composition" className={`bg-cream py-[100px] text-forest lg:py-[130px] ${PAD}`}>
        <div className="mx-auto max-w-[1360px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-20">
            <div>
              <Reveal>
                <SectionKicker className="mb-6">{c.compoKicker}</SectionKicker>
              </Reveal>
              <Reveal>
                <h2 id="comite-composition" className={`${H2} max-w-[20ch]`}>
                  <AccentTitle text={c.compoTitle} accent={c.compoAccent} tone="light" />
                </h2>
              </Reveal>
            </div>
            <Reveal delay={100}>
              <p className="m-0 max-w-[48ch] border-l-[3px] border-sun pl-6 text-[17px] leading-relaxed text-[#42574C]">{c.compoLead}</p>
            </Reveal>
          </div>

          {/* Les trois ministères. */}
          <ol className="m-0 mt-16 grid list-none gap-5 p-0 lg:grid-cols-3">
            {c.ministries.map((m, i) => (
              <li key={m.t}>
                <Reveal delay={i * 90} className="h-full">
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#E2DFD3] bg-white p-8 transition-shadow duration-500 hover:shadow-[0_30px_60px_-40px_rgba(14,70,55,0.55)]">
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-sun transition-transform duration-500 ease-[cubic-bezier(.22,1,.26,1)] group-hover:scale-x-100 motion-reduce:transition-none" />
                    <div className="flex items-center justify-between gap-4">
                      <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-2xl bg-forest text-sun">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21h18M4 10h16M12 3 4 7v3h16V7Z" />
                          <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
                        </svg>
                      </span>
                      <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-blood">{`${c.ministryLabel} 0${i + 1}`}</span>
                    </div>
                    <h3 className="m-0 mt-7 font-display text-[clamp(21px,1.8vw,25px)] font-semibold leading-tight tracking-[-0.02em] text-forest">{m.t}</h3>
                    <ul className="m-0 mt-6 flex list-none flex-col gap-0 border-t border-[#E2DFD3] p-0">
                      {m.members.map((x) => (
                        <li key={x} className="flex items-start gap-3 border-b border-[#EEEBE1] py-3 text-[15px] leading-snug text-[#42574C] last:border-b-0">
                          <span aria-hidden="true" className="mt-[9px] h-0.5 w-3 shrink-0 bg-blood" />
                          {x}
                        </li>
                      ))}
                    </ul>
                    {/* Lien vers le site officiel du ministère, calé en bas de carte. */}
                    <div className="mt-auto pt-7">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-2 rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:border-forest hover:bg-forest hover:text-cream"
                      >
                        {c.ministrySite}
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">↗</span>
                        <span className="sr-only"> — {m.t}</span>
                      </a>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          {/* Les cinq organismes membres de plein droit. */}
          <Reveal delay={80}>
            <p className="m-0 mt-16 font-mono text-[11px] uppercase tracking-[0.14em] text-blood">{c.bodiesLabel}</p>
          </Reveal>
          <ul className="m-0 mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-5">
            {c.bodies.map((x, i) => (
              <li key={x}>
                <Reveal delay={i * 60} className="h-full">
                  <div className="flex h-full flex-col justify-between gap-6 rounded-[22px] border border-forest/10 bg-paper p-6 transition-colors duration-300 hover:border-forest/30 hover:bg-white">
                    <span aria-hidden="true" className="font-display text-[28px] font-semibold leading-none tracking-[-0.03em] text-sun">{`0${i + 1}`}</span>
                    <p className="m-0 font-display text-[16px] font-semibold leading-snug text-forest">{x}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          {/* La présidence, seule information de gouvernance : bandeau vert. */}
          <Reveal delay={120}>
            <div className="mt-12 flex flex-col gap-5 rounded-[28px] bg-forest p-8 text-cream sm:flex-row sm:items-center sm:gap-8 lg:px-12 lg:py-10">
              <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-sun text-forest">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />
                </svg>
              </span>
              <div>
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-sun">{c.bureauLabel}</p>
                <p className="m-0 mt-2 max-w-[70ch] font-display text-[clamp(18px,1.6vw,22px)] font-medium leading-snug">{c.bureau}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Le BIE : le cadre international. À gauche, sur-titre, titre et
          définition (nom du BIE en gras rouge) puis le lien vers le site du
          BIE. À droite, une carte verte : ce que ces rendez-vous permettent de
          partager, décliné en trois pastilles (innovations, cultures,
          visions d'un avenir commun). */}
      <section id="bie" aria-labelledby="about-bie" className={`bg-white py-[100px] text-forest lg:py-[130px] ${PAD}`}>
        <div className="mx-auto grid max-w-[1360px] items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <Reveal>
              <SectionKicker className="mb-6">{c.bieKicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="about-bie" className={`${H2} max-w-[18ch]`}>
                <AccentTitle text={c.bieTitle} accent={c.bieAccent} tone="light" />
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="m-0 mt-8 max-w-[56ch] border-l-[3px] border-sun pl-6 text-[clamp(16px,1.35vw,19px)] leading-relaxed text-[#42574C]">
                {highlight(c.bieLead, [c.bieStrong], 'font-semibold text-blood')}
              </p>
            </Reveal>
            <Reveal delay={160}>
              <a
                href="https://www.bie-paris.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-forest px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-pine"
              >
                {c.bieLink}
                <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-[32px] bg-forest p-8 text-cream sm:p-10 lg:p-12">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-sun" />
              <p className="m-0 font-display text-[clamp(20px,1.8vw,26px)] font-medium leading-snug tracking-[-0.015em]">{c.bieShare}</p>
              <ul className="m-0 mt-9 flex list-none flex-col gap-3 p-0">
                {c.bieShareItems.map((x, i) => (
                  <li key={x} className="flex items-center gap-4 rounded-2xl bg-white/[0.06] px-5 py-4 transition-colors duration-300 hover:bg-white/[0.1]">
                    <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sun text-forest">
                      {BIE_ICONS[i]}
                    </span>
                    <span className="font-display text-[18px] font-semibold">{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Les quatre missions, sur fond vert : la page change de registre, on
          passe de l'organigramme au mandat. */}
      <section id="missions" aria-labelledby="comite-missions" className={`relative overflow-hidden bg-forest py-[100px] text-cream lg:py-[130px] ${PAD}`}>
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-0 h-[380px] w-[380px] rounded-full bg-sun/15 blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-blood/15 blur-[120px]" />

        <div className="relative mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker tone="dark" className="mb-6">
              {c.missionsKicker}
            </SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="comite-missions" className={`${H2} max-w-[22ch]`}>
              <AccentTitle text={c.missionsTitle} accent={c.missionsAccent} tone="dark" />
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="m-0 mt-7 max-w-[62ch] text-[17px] leading-relaxed text-cream/85">{c.missionsLead}</p>
          </Reveal>

          <ol className="m-0 mt-14 grid list-none gap-5 p-0 sm:grid-cols-2">
            {c.missions.map((m, i) => (
              <li key={m.n}>
                <Reveal delay={i * 90}>
                  <div className="group h-full rounded-[28px] border border-cream/15 bg-cream/[0.06] p-8 transition-colors duration-500 hover:border-sun/50 hover:bg-cream/[0.1]">
                    <p className="m-0 font-mono text-[13px] tracking-[0.1em] text-sun">{m.n}</p>
                    <h3 className="m-0 mt-5 font-display text-[clamp(22px,2vw,28px)] font-semibold leading-tight tracking-[-0.02em] text-cream">
                      {m.t}
                    </h3>
                    {/* Le filet jaune s'étire sous l'intitulé au survol : un
                        seul geste pour les quatre cartes. */}
                    <span
                      aria-hidden="true"
                      className="mt-5 block h-0.5 w-10 origin-left bg-sun transition-transform duration-500 ease-[cubic-bezier(.22,1,.26,1)] group-hover:scale-x-[2.6] motion-reduce:transition-none"
                    />
                    <p className="m-0 mt-5 text-[16px] leading-relaxed text-cream/85">{m.d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Appel à l'action de fin de page : photo à gauche, texte à droite ;
          la question et le bouton « Contactez-nous » dans un encart jaune. */}
      <section id="ensemble" aria-labelledby="about-ensemble" className={`bg-cream py-[100px] text-forest lg:py-[130px] ${PAD}`}>
        <Reveal>
          <div className="mx-auto grid max-w-[1360px] overflow-hidden rounded-[32px] bg-white shadow-[0_40px_80px_-60px_rgba(14,70,55,0.6)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="relative min-h-[280px] lg:min-h-0">
              <Image src="/design/osaka/echassiers.jpg" alt={a.ctaAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" />
            </div>
            <div className="p-8 sm:p-12 lg:p-16">
              <SectionKicker className="mb-6">{a.ctaKicker}</SectionKicker>
              <h2 id="about-ensemble" className="m-0 max-w-[20ch] font-display text-[clamp(30px,3.8vw,50px)] font-semibold leading-[1.02] tracking-[-0.035em]">
                <AccentTitle text={a.ctaTitle} accent={a.ctaAccent} tone="light" />
              </h2>
              <p className="m-0 mt-8 max-w-[58ch] text-[clamp(16px,1.3vw,18px)] leading-relaxed text-[#42574C]">{a.ctaPara}</p>
              <div className="mt-10 flex flex-col gap-5 rounded-[24px] bg-sun/25 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <p className="m-0 max-w-[40ch] font-display text-[clamp(16px,1.35vw,19px)] font-semibold leading-snug text-forest">{a.ctaQuestion}</p>
                <a
                  href={lz('/contact', lang)}
                  className="group inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-forest px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-blood sm:self-auto"
                >
                  {a.ctaButton}
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
