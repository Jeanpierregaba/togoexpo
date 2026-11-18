'use client';
import { useEffect, useState } from 'react';
import { getDictionary } from '@/i18n/dict';
import { lz, type Lang } from '@/i18n/lang';
import { SectionKicker } from './SectionKicker';

// Motifs envoyés à /api/contact ; les libellés viennent du dictionnaire,
// dans le même ordre.
const TYPE_VALUES = ['information', 'exposition', 'partenariat', 'presse', 'autre'] as const;
type Motif = (typeof TYPE_VALUES)[number];

type Errors = Partial<Record<'nom' | 'email' | 'message' | 'form', string>>;

export function ContactForm({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const types = TYPE_VALUES.map((value, i) => ({ value, label: t.contact.typeOpts[i] }));
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [motif, setMotif] = useState<Motif>('information');

  // `?motif=partenariat` (bouton de l'encart partenaires) présélectionne le motif.
  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get('motif');
    if (m && (TYPE_VALUES as readonly string[]).includes(m)) setMotif(m as Motif);
    // L'ancre #formulaire est appliquée avant que la mise en page soit stable :
    // on la rejoue une fois le formulaire monté.
    if (window.location.hash === '#formulaire') {
      requestAnimationFrame(() => document.getElementById('formulaire')?.scrollIntoView({ block: 'start' }));
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const payload = {
      nom: String(fd.get('nom') ?? '').trim(),
      organisation: String(fd.get('organisation') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      type: motif,
      message: String(fd.get('message') ?? '').trim(),
      website: String(fd.get('website') ?? ''), // honeypot anti-spam
      lang,
    };
    const next: Errors = {};
    if (payload.nom.length < 2) next.nom = t.contact.errNom;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) next.email = t.contact.errMail;
    if (payload.message.length < 20) next.message = t.contact.errMsg;
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; errors?: Errors };
      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? { form: t.contact.errForm });
        return;
      }
      setSent(true);
    } catch {
      setErrors({ form: t.contact.errForm });
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="h-fit rounded-[28px] bg-forest p-8 text-cream sm:p-10" role="status">
        <SectionKicker tone="dark">{t.contact.okKicker}</SectionKicker>
        <h2 className="m-0 mt-3 font-display text-3xl font-semibold">{t.contact.okTitle}</h2>
        <p className="mb-0 mt-3 leading-relaxed text-cream/80">{t.contact.okPara}</p>
        <a
          href={lz('/', lang)}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3 text-sm font-semibold text-forest transition-colors hover:bg-white"
        >
          {t.contact.okBack}
        </a>
      </div>
    );
  }

  const input =
    'w-full rounded-2xl border border-forest/20 bg-cream/60 px-4 py-3 text-[15px] text-forest outline-none transition placeholder:text-forest/40 focus:border-forest focus:bg-white';
  const label = 'mb-2 block text-sm font-semibold';
  const error = 'mt-1.5 text-sm text-blood';

  return (
    <form id="formulaire" onSubmit={onSubmit} noValidate className="h-fit scroll-mt-28 rounded-[28px] border border-[#D3D6C8] bg-white p-7 sm:p-10">
      {/* Honeypot : invisible aux humains, piège à bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <h2 className="m-0 font-display text-[clamp(24px,2.4vw,32px)] font-semibold leading-tight tracking-[-0.02em] text-forest">{t.contact.formTitle}</h2>

      {/* Motif : pastilles à choix unique (boutons radio stylés). */}
      <fieldset className="m-0 mt-7 border-0 p-0">
        <legend className={label}>{t.contact.typeLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {types.map((o) => (
            <label key={o.value} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value={o.value}
                checked={motif === o.value}
                onChange={() => setMotif(o.value)}
                className="peer sr-only"
              />
              <span className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-cream/60 px-4 py-2.5 text-sm font-semibold text-forest transition-colors hover:border-forest/50 peer-checked:border-forest peer-checked:bg-forest peer-checked:text-cream peer-focus-visible:ring-2 peer-focus-visible:ring-sun peer-focus-visible:ring-offset-2">
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nom" className={label}>{t.contact.nom}</label>
          <input id="nom" name="nom" className={input} required minLength={2} maxLength={120} autoComplete="name" placeholder={t.contact.nomPh} />
          {errors.nom && <p className={error}>{errors.nom}</p>}
        </div>
        <div>
          <label htmlFor="organisation" className={label}>{t.contact.org}</label>
          <input id="organisation" name="organisation" className={input} maxLength={160} autoComplete="organization" placeholder={t.contact.orgPh} />
        </div>
      </div>
      <div className="mt-5">
        <div>
          <label htmlFor="email" className={label}>{t.contact.mailLabel}</label>
          <input id="email" name="email" type="email" className={input} required maxLength={160} autoComplete="email" placeholder={t.contact.mailPh} />
          {errors.email && <p className={error}>{errors.email}</p>}
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="message" className={label}>{t.contact.msg}</label>
        <textarea id="message" name="message" rows={6} className={`${input} resize-y`} required minLength={20} maxLength={5000} placeholder={t.contact.msgPh} />
        {errors.message && <p className={error}>{errors.message}</p>}
      </div>
      {errors.form && <p className="mt-4 text-sm text-blood" role="alert">{errors.form}</p>}
      <button
        type="submit"
        disabled={sending}
        className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-sun px-7 py-3.5 font-semibold text-forest transition-colors hover:bg-forest hover:text-cream disabled:opacity-60"
      >
        {sending ? t.contact.sending : t.contact.send} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
