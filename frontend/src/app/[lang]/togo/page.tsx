import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { TogoCultureTabs } from '@/components/TogoCultureTabs';
import { TogoMap } from '@/components/TogoMap';
import { getDictionary } from '@/i18n/dict';
import { isLang, langAlternates, lz } from '@/i18n/lang';
import { AccentTitle, SectionKicker } from '@/components/SectionKicker';
import { withShare } from '@/lib/share';

export const revalidate = 300;

type Props = { params: { lang: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = isLang(params.lang) ? params.lang : 'fr';
  const t = getDictionary(lang);
  return withShare(lang, {
    title: t.togo.heroTitle.replace(/[.。]$/, ''),
    description: t.togo.heroSub,
    alternates: langAlternates('/togo', lang),
  });
}

const SPOTS = [
  { src: '/design/slider-savoirfaire.jpg', alt: 'Cases tata du Koutammakou' },
  { src: '/design/tourisme-plateaux.png', alt: 'Cascades et forêts de Kpalimé' },
  { src: '/design/hero-accueille.png', alt: 'Plage de Lomé' },
  { src: '/design/tile-6.jpg', alt: 'Montagnes du Togo' },
  { src: '/design/tile-2.jpeg', alt: 'Marché aux fétiches de Lomé' },
  { src: '/design/slider-decouverte.jpg', alt: 'Littoral togolais au coucher du soleil' },
];

/** Visuels des secteurs, dans l'ordre de `togo.ecoSectors` : agriculture,
 *  transport, industrie, services. */
const ECO_IMAGES = [
  '/design/yokohama/cacao.jpg',
  '/design/togo/economie/2.jpg',
  '/design/togo/economie/1.jpg',
  '/design/togo/economie/3.jpg',
];

export default function TogoPage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const t = getDictionary(lang);
  return (
    <>
      {/* Hero page. L'image est la première image de la vidéo du drapeau :
          elle s'affiche tout de suite et la vidéo prend le relais sans saut. */}
      <PageHero
        image="/design/togo-drapeau-poster.jpg"
        video="/videos/togo-banniere.mp4"
        height="full"
        labelledBy="togo-hero-title"
        overlay="strong"
      >
        <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-cream/75">
          <a href={lz('/', lang)} className="transition hover:text-cream">{t.togo.crumbHome}</a> <span aria-hidden="true">/</span> Le Togo
        </p>
        <SectionKicker tone="dark" className="mb-6 mt-10">{t.togo.heroKicker}</SectionKicker>
        <h1
          id="togo-hero-title"
          className="m-0 font-display text-[clamp(40px,6vw,80px)] font-semibold leading-[0.95] tracking-[-0.04em]"
        >
          <AccentTitle text={t.togo.heroTitle} accent={t.togo.heroAccent} tone="dark" breakBefore />
        </h1>
        <p className="mb-0 mt-6 max-w-[62ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-mist">
          {t.togo.heroSub}
        </p>
        <dl className="mb-0 mt-10 flex flex-wrap gap-x-10 gap-y-4">
          {t.togo.stats.map((s) => (
            <div key={s.l}>
              <dt className="sr-only">{s.l}</dt>
              <dd className="m-0 font-display text-2xl font-semibold text-sun">{s.v}</dd>
              <dd className="m-0 mt-1 text-sm text-sage">{s.l}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* 01 — Histoire du Togo */}
      <section id="histoire" aria-labelledby="togo-histoire" className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <div className="mx-auto grid max-w-[1360px] gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Titre et paragraphes dans la même colonne : la carte, à droite, prend
              toute la hauteur de ce bloc. */}
          <div>
            <Reveal>
              <SectionKicker className="mb-6">{t.togo.histKicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="togo-histoire" className="m-0 max-w-[20ch] font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.035em]">
                <AccentTitle text={t.togo.histTitle} accent={t.togo.histAccent} tone="light" />
              </h2>
            </Reveal>
            <Reveal className="mt-10 flex flex-col gap-5 text-[17px] leading-relaxed text-[#25372E]">
              {t.togo.histParas.map((p, i) => (
                <p key={i} className="m-0">{p}</p>
              ))}
            </Reveal>
          </div>
          {/* Sortie du flux en desktop : c'est la colonne de texte qui fixe la hauteur
              de la ligne, la carte s'y adapte. */}
          <Reveal delay={120} className="lg:relative lg:h-full">
            <div className="lg:absolute lg:inset-0">
              <TogoMap lang={lang} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 — Économie. En-tête titre / chapeau, puis un bandeau vert « pays
          connecté » (intitulé à gauche, texte à droite), puis les quatre
          secteurs en cartes photo. */}
      <section id="economie" aria-labelledby="togo-economie" className="bg-white px-5 py-[100px] text-forest sm:px-8 lg:px-14 lg:py-[130px]">
        <div className="mx-auto max-w-[1360px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-20">
            <div>
              <Reveal>
                <SectionKicker className="mb-6">{t.togo.ecoKicker}</SectionKicker>
              </Reveal>
              <Reveal>
                <h2 id="togo-economie" className="m-0 max-w-[18ch] font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.035em]">
                  <AccentTitle text={t.togo.ecoTitle} accent={t.togo.ecoAccent} tone="light" />
                </h2>
              </Reveal>
            </div>
            <Reveal delay={100}>
              <p className="m-0 max-w-[50ch] border-l-[3px] border-sun pl-6 text-[clamp(16px,1.3vw,19px)] leading-relaxed text-[#42574C]">{t.togo.ecoLead}</p>
            </Reveal>
          </div>

          <Reveal delay={80}>
            <div className="mt-16 grid gap-8 rounded-[28px] bg-forest p-8 text-cream sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:p-14">
              <div>
                <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-full bg-sun text-forest">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                  </svg>
                </span>
                <h3 className="m-0 mt-7 font-display text-[clamp(26px,2.6vw,38px)] font-semibold leading-[1.08] tracking-[-0.025em] text-cream">
                  {t.togo.ecoHubTitle}
                </h3>
              </div>
              <div className="flex flex-col gap-5 text-[clamp(16px,1.25vw,18px)] leading-relaxed text-cream/85 lg:pt-3">
                {t.togo.ecoHubParas.map((p, i) => (
                  <p key={i} className={`m-0 ${i === 0 ? 'font-medium text-cream' : ''}`}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <h3 className="m-0 mt-20 font-display text-[clamp(26px,2.8vw,40px)] font-semibold leading-tight tracking-[-0.03em] text-forest">
              {t.togo.ecoSectorsTitle}
            </h3>
          </Reveal>
          <ol className="m-0 mt-10 grid list-none gap-6 p-0 md:grid-cols-2">
            {t.togo.ecoSectors.map((sec, i) => (
              <li key={sec.t}>
                <Reveal delay={(i % 2) * 100} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#E2DFD3] bg-paper transition-shadow duration-500 hover:shadow-[0_30px_60px_-40px_rgba(14,70,55,0.55)]">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={ECO_IMAGES[i]}
                        alt={sec.alt}
                        fill
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <span className="absolute left-5 top-5 rounded-full bg-sun px-3.5 py-1.5 font-mono text-[12px] font-bold tracking-[0.08em] text-forest">{`0${i + 1}`}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-8">
                      <h4 className="m-0 font-display text-[clamp(22px,2vw,28px)] font-semibold leading-tight tracking-[-0.02em] text-forest">{sec.t}</h4>
                      <span aria-hidden="true" className="mt-4 block h-0.5 w-10 origin-left bg-blood transition-transform duration-500 group-hover:scale-x-[2.2] motion-reduce:transition-none" />
                      <div className="mt-5 flex flex-col gap-3 text-[16px] leading-relaxed text-[#42574C]">
                        {sec.paras.map((p, k) => (
                          <p key={k} className="m-0">{p}</p>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 — Chiffres */}
      <section id="chiffres" aria-labelledby="togo-chiffres" className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker className="mb-6">{t.togo.numKicker}</SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="togo-chiffres" className="m-0 font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.035em]">
              <AccentTitle text={t.togo.numTitle} accent={t.togo.numAccent} tone="light" />
            </h2>
          </Reveal>
          <dl className="mb-0 mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.togo.numCards.map(([v, l], i) =>
              i === 0 ? (
                <Reveal key={l} className="sm:col-span-2">
                  <div className="flex h-full flex-col justify-between gap-8 rounded-[24px] bg-forest p-8 text-cream">
                    <p className="m-0 font-mono text-xs uppercase tracking-[0.1em]">01 — Population</p>
                    <div>
                      <dd className="m-0 font-display text-[clamp(64px,7vw,110px)] font-semibold leading-none tracking-[-0.04em] text-sun">
                        {v}
                      </dd>
                      <dt className="m-0 mt-3 max-w-[30ch] text-[15px] font-medium leading-relaxed">
                        {l}{t.togo.numFeaturedNote}
                      </dt>
                    </div>
                  </div>
                </Reveal>
              ) : (
                <Reveal key={l} delay={(i % 4) * 80}>
                  {/* La carte 10 — l'ouverture sans visa — est mise en avant sur fond
                      jaune, sans changer de format : elle garde la taille des autres. */}
                  <div
                    className={`flex h-full flex-col gap-3 rounded-[24px] border p-6 transition-all hover:-translate-y-1 ${
                      i === 9
                        ? 'border-sun bg-sun text-forest shadow-[0_18px_44px_-26px_rgba(14,70,55,0.75)] hover:border-forest'
                        : 'border-[#D3D6C8] bg-white hover:border-forest'
                    }`}
                  >
                    <p
                      className={`m-0 font-mono text-xs uppercase tracking-[0.1em] ${
                        i === 9 ? 'text-forest' : 'text-blood'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <dd className="m-0 font-display text-[26px] font-semibold leading-tight">{v}</dd>
                    <dt className={`m-0 text-sm leading-snug ${i === 9 ? 'text-[#2B2A1A]' : 'text-[#42574C]'}`}>{l}</dt>
                  </div>
                </Reveal>
              ),
            )}
            <Reveal delay={160}>
              {/* La carte 11 renvoie au portail officiel du gouvernement : fond
                  rouge, texte blanc, flèche qui se décale au survol. */}
              <a
                href="https://togo.gouv.tg/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between gap-8 rounded-[24px] border border-blood bg-blood p-6 text-white shadow-[0_18px_44px_-26px_rgba(160,15,40,0.8)] transition-all hover:-translate-y-1 hover:bg-[#B80D2D]"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-white/80">11</p>
                  <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-base transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                </div>
                <p className="m-0 font-display text-[26px] font-semibold leading-tight text-white">
                  {t.togo.numCta.replace(/\s*↗$/, '')}
                </p>
                <p className="m-0 text-sm leading-snug text-white/85">{t.togo.numCtaSub}</p>
              </a>
            </Reveal>
          </dl>
        </div>
      </section>

      {/* 04 — Culture */}
      <section id="culture" aria-labelledby="togo-culture" className="bg-white px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker className="mb-6">{t.togo.cultKicker}</SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="togo-culture" className="m-0 max-w-[22ch] font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.035em]">
              <AccentTitle text={t.togo.cultTitle} accent={t.togo.cultAccent} tone="light" />
            </h2>
          </Reveal>
          <Reveal className="mt-10">
            <TogoCultureTabs lang={lang} />
          </Reveal>
        </div>
      </section>

      {/* 05 — Investir */}
      <section id="investir" aria-labelledby="togo-investir" className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1360px]">
          <Reveal>
            <SectionKicker className="mb-6">{t.togo.invKicker}</SectionKicker>
          </Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <h2 id="togo-investir" className="m-0 max-w-[18ch] font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.035em]">
                <AccentTitle text={t.togo.invTitle} accent={t.togo.invAccent} tone="light" />
              </h2>
            </Reveal>
            <Reveal>
              <a
                href="https://togoinvest.tg/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 font-semibold text-cream transition-colors hover:bg-pine"
              >
                {t.togo.invBtn}
              </a>
            </Reveal>
          </div>
          <ol className="mb-0 mt-10 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
            {t.togo.invCards.map(([title, d], i) => (
              <Reveal key={title} delay={(i % 3) * 100}>
                <li className="h-full rounded-[24px] border border-forest/15 bg-white p-7 text-forest">
                  <p className="m-0 font-display text-4xl font-semibold text-blood">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mb-0 mt-4 font-display text-2xl font-semibold leading-tight">{title}</h3>
                  <p className="mb-0 mt-3 leading-relaxed text-[#42574C]">{d}</p>
                </li>
              </Reveal>
            ))}
            <Reveal delay={200}>
              <li className="flex h-full flex-col justify-between gap-6 rounded-[24px] bg-sun p-7 text-forest">
                <div>
                  <p className="m-0 font-display text-4xl font-semibold">→</p>
                  <h3 className="mb-0 mt-4 font-display text-2xl font-semibold leading-tight">{t.togo.invCtaTitle}</h3>
                  <p className="mb-0 mt-3 leading-relaxed">{t.togo.invCtaPara}</p>
                </div>
                <a
                  href={lz('/contact', lang)}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-forest px-6 py-3.5 font-semibold text-cream transition-colors hover:bg-pine"
                >
                  {t.togo.invCtaBtn}
                </a>
              </li>
            </Reveal>
          </ol>
        </div>
      </section>

      {/* 06 — Tourisme */}
      <section id="tourisme" aria-labelledby="togo-tourisme" className="bg-forest px-5 py-[100px] text-cream sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <SectionKicker tone="dark" className="mb-6">{t.togo.tourKicker}</SectionKicker>
              </Reveal>
              <Reveal>
                <h2 id="togo-tourisme" className="m-0 font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.035em]">
                  <AccentTitle text={t.togo.tourTitle} accent={t.togo.tourAccent} tone="dark" breakBefore />
                </h2>
              </Reveal>
            </div>
            <Reveal>
              <a
                href="https://togotourisme.tg/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3.5 font-semibold text-forest transition-colors hover:bg-white"
              >
                {t.togo.tourBtn}
              </a>
            </Reveal>
          </div>
          {/* Accroche en jaune, question, puis le texte de présentation. */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <Reveal>
              <p className="m-0 font-display text-[clamp(22px,2.2vw,30px)] font-semibold leading-snug tracking-[-0.02em] text-sun">{t.togo.tourLead}</p>
              <p className="m-0 mt-3 font-display text-[clamp(18px,1.6vw,22px)] font-medium leading-snug text-cream">{t.togo.tourQuestion}</p>
            </Reveal>
            <Reveal delay={100}>
              <p className="m-0 max-w-[62ch] text-[clamp(16px,1.25vw,18px)] leading-relaxed text-cream/85">{t.togo.tourPara}</p>
            </Reveal>
          </div>
          <div className="mb-0 mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SPOTS.map((s, i) => (
              <Reveal key={t.togo.tourSpots[i].label} delay={(i % 3) * 100}>
                <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[24px]">
                  <Image src={s.src} alt={t.togo.tourSpots[i].label} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6">
                    <p className="m-0 font-display text-2xl font-semibold">{t.togo.tourSpots[i].label}</p>
                    <p className="m-0 mt-1 text-sm text-cream/80">{t.togo.tourSpots[i].sub}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — Appel à l'action de fin de page : carte blanche, texte à gauche
          (quatre promesses en liste, puis deux boutons), photo à droite. */}
      <section id="partager" aria-labelledby="togo-partager" className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <Reveal>
          <div className="mx-auto grid max-w-[1360px] overflow-hidden rounded-[32px] bg-white shadow-[0_40px_80px_-60px_rgba(14,70,55,0.6)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="p-8 sm:p-12 lg:p-16">
              <SectionKicker className="mb-6">{t.togo.ctaKicker}</SectionKicker>
              <h2 id="togo-partager" className="m-0 max-w-[16ch] font-display text-[clamp(32px,4.2vw,54px)] font-semibold leading-[0.98] tracking-[-0.035em]">
                <AccentTitle text={t.togo.ctaTitle} accent={t.togo.ctaAccent} tone="light" />
              </h2>
              <ul className="m-0 mt-9 grid list-none gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
                {t.togo.ctaPillars.map((p) => (
                  <li key={p} className="flex items-center gap-3 font-display text-[clamp(16px,1.3vw,19px)] font-medium text-forest">
                    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-sun ring-4 ring-sun/25" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="m-0 mt-9 max-w-[52ch] border-l-[3px] border-blood pl-5 text-[clamp(16px,1.25vw,18px)] font-semibold leading-relaxed text-[#42574C]">
                {t.togo.ctaTagline}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={lz('/#rendez-vous', lang)}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-forest px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-pine"
                >
                  {t.togo.ctaNext}
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                <a
                  href={lz('/contact', lang)}
                  className="inline-flex items-center gap-2.5 rounded-full border border-forest/25 px-7 py-3.5 font-semibold text-forest transition-colors hover:border-sun hover:bg-sun"
                >
                  {t.togo.ctaContact}
                </a>
              </div>
            </div>
            <div className="relative min-h-[280px] lg:min-h-0">
              <Image src="/design/osaka/final-batakali.jpg" alt={t.togo.ctaAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
