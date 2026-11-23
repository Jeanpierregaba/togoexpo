import { ArrowUp } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';
import { getDictionary } from '@/i18n/dict';
import { lz, type Lang } from '@/i18n/lang';
import { Reveal } from './Reveal';

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  return (
    <footer className="bg-[#166C54] text-cream">
      {/* Barres tricolores */}
      <div aria-hidden="true" className="flex h-2">
        <div className="w-[38%] bg-[#166C54]" />
        <div className="w-[24%] bg-sun" />
        <div className="flex-1 bg-blood" />
      </div>

      {/* Appel à partenariat + lettre d'information, posés directement sur le
          fond vert du pied de page (plus de panneau coloré). */}
      <div
        id="partenaire"
        className="mx-auto grid max-w-[1360px] gap-12 px-5 py-14 sm:px-8 [&>*]:min-w-0 lg:grid-cols-2 lg:gap-20 lg:px-14 lg:py-20"
      >
        <div>
          <Reveal>
            <h2 className="m-0 font-display text-[clamp(30px,3.68vw,46px)] font-semibold leading-[0.98] tracking-[-0.035em] text-sun">
              {t.partner.h2}
            </h2>
          </Reveal>
          <Reveal>
            <p className="m-0 mt-5 max-w-[48ch] leading-relaxed text-cream/75">{t.partner.para}</p>
          </Reveal>
        </div>
        <Reveal className="flex h-fit flex-col gap-3.5 rounded-3xl border border-white/15 bg-white/[0.04] p-7 lg:justify-self-end">
          <span className="font-display text-[22px] font-semibold">{t.partner.nlTitle}</span>
          <p className="m-0 text-sm text-mist">{t.partner.nlPara}</p>
          <NewsletterForm lang={lang} />
        </Reveal>
      </div>

      <div className="border-t border-white/10 px-5 pb-10 pt-6 sm:px-8 lg:px-14">
        <Reveal>
          <p aria-hidden="true" className="select-none text-center font-display text-[clamp(64px,14.5vw,230px)] font-bold uppercase leading-[0.95] tracking-tight text-cream/25">
            Togo Expo
          </p>
        </Reveal>
        <div className="mx-auto mt-8 flex max-w-[1360px] flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <p>
            Powered by{' '}
            <a
              className="font-semibold text-cream/80 transition hover:text-cream"
              href="https://ibdastudio.com/"
              target="_blank"
              rel="noopener"
            >
              IBDA STUDIO
            </a>
          </p>
          <div className="flex items-center gap-5">
            <a className="transition hover:text-cream" href={lz('/mentions-legales', lang)}>
              {t.footer.legal}
            </a>
            <a className="transition hover:text-cream" href={lz('/contact', lang)}>
              {t.footer.contact}
            </a>
            <a
              href="#top"
              aria-label={t.footer.top}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/25 text-cream transition hover:border-cream hover:bg-cream hover:text-forest"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
