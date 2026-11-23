import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContactForm } from '@/components/ContactForm';
import { PageHero } from '@/components/PageHero';
import { USEFUL_LINKS } from '@/lib/design';
import { getDictionary } from '@/i18n/dict';
import { isLang, langAlternates, lz, toLang } from '@/i18n/lang';
import { AccentTitle, SectionKicker } from '@/components/SectionKicker';
import { fixedIn } from '@/i18n/fixed';
import { withShare } from '@/lib/share';

type Props = { params: { lang: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang(params.lang);
  const t = getDictionary(lang);
  return withShare(lang, {
    title: `${t.contact.crumb} — ${t.contact.h1.replace(/[.。]$/, '')}`,
    description: t.contact.para,
    alternates: langAlternates('/contact', lang),
  });
}

const ICON = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function ContactPage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const t = getDictionary(lang);
  const infos = [
    {
      label: t.contact.addr,
      value: t.contact.addrVal,
      href: undefined as string | undefined,
      icon: <svg {...ICON}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>,
    },
    {
      label: t.contact.mail,
      value: 'info@togoexpo.tg',
      href: 'mailto:info@togoexpo.tg',
      icon: <svg {...ICON}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
    },
    {
      label: t.contact.phone,
      value: '+228 90 36 15 99',
      href: 'tel:+22890361599',
      icon: <svg {...ICON}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>,
    },
  ];
  return (
    <>
      <PageHero image="/design/contact-banniere.jpg" labelledBy="contact-hero-title" height="full" overlay="home" bright>
        <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-cream/75">
          <a href={lz('/', lang)} className="transition hover:text-cream">{t.nav[0].label}</a>{' '}
          <span aria-hidden="true">/</span> {t.contact.crumb}
        </p>
        <SectionKicker tone="dark" className="mb-6 mt-10">{t.contact.kicker}</SectionKicker>
        <h1
          id="contact-hero-title"
          className="m-0 [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] max-w-[18ch] font-display text-[clamp(40px,6vw,75px)] font-semibold leading-[0.95] tracking-[-0.04em]"
        >
          {t.contact.h1}
        </h1>
        <p className="mb-0 mt-6 max-w-[62ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-cream [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]">
          {t.contact.para}
        </p>
      </PageHero>
      <section aria-label={t.contact.formTitle} className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
          <div className="flex flex-col gap-5">
            {/* Encart entreprises et partenaires : le bouton ouvre le formulaire
                avec le motif « Partenariat » déjà choisi. */}
            <div className="relative overflow-hidden rounded-[28px] bg-forest p-8 text-cream sm:p-10">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-sun" />
              <SectionKicker tone="dark">{t.contact.partnerKicker}</SectionKicker>
              <h2 className="m-0 mt-5 font-display text-[clamp(26px,2.6vw,36px)] font-semibold leading-[1.05] tracking-[-0.025em]">
                <AccentTitle text={t.contact.partnerTitle} accent={t.contact.partnerAccent} tone="dark" />
              </h2>
              <p className="m-0 mt-5 text-[16px] leading-relaxed text-cream/85">{t.contact.partnerPara}</p>
              <a
                href={`${lz('/contact', lang)}?motif=partenariat#formulaire`}
                className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-sun px-6 py-3.5 font-semibold text-forest transition-colors hover:bg-white hover:text-blood"
              >
                {t.contact.partnerCta}
                <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* Coordonnées, regroupées dans une seule carte. */}
            <div className="rounded-[28px] border border-[#D3D6C8] bg-white p-7 sm:p-8">
              <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-blood">{t.contact.infoTitle}</p>
              <ul className="m-0 mt-4 list-none p-0">
                {infos.map((i) => (
                  <li key={i.label} className="flex items-center gap-4 border-b border-[#EEEBE1] py-4 last:border-b-0 last:pb-0">
                    <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-forest/[0.06] text-forest">
                      {i.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="m-0 text-[13px] text-[#5B6F64]">{i.label}</p>
                      {i.href ? (
                        <a href={i.href} className="font-display text-lg font-semibold text-forest transition-colors hover:text-blood">
                          {i.value}
                        </a>
                      ) : (
                        <p className="m-0 font-display text-lg font-semibold">{i.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] border border-[#D3D6C8] bg-white p-7 sm:p-8">
              <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-blood">{t.contact.linksTitle}</p>
              <ul className="mb-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                {USEFUL_LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-full border border-forest/25 px-4 py-2 text-sm font-semibold transition-colors hover:border-forest hover:bg-forest hover:text-cream"
                    >
                      {fixedIn(l.label, lang)} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ContactForm lang={lang} />
        </div>
      </section>
    </>
  );
}
