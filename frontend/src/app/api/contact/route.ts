import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getDictionary } from '@/i18n/dict';
import { toLang } from '@/i18n/lang';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Motifs du formulaire de contact (+ « lettre » pour l'inscription à la lettre d'information).
const MOTIFS: Record<string, string> = {
  information: 'Demande d’information',
  exposition: 'Participation à une exposition',
  partenariat: 'Partenariat',
  presse: 'Presse et médias',
  autre: 'Autre demande',
  lettre: 'Lettre d’information',
};

type Body = {
  nom?: unknown;
  organisation?: unknown;
  email?: unknown;
  type?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
  lang?: unknown; // langue du formulaire, pour les messages d'erreur
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    const t = getDictionary('fr');
    return NextResponse.json({ ok: false, errors: { form: t.contact.errBody } }, { status: 400 });
  }

  const t = getDictionary(toLang(typeof body.lang === 'string' ? body.lang : undefined)).contact;

  // Honeypot rempli = bot : succès silencieux, rien n'est envoyé.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const nom = String(body.nom ?? '').trim();
  const organisation = String(body.organisation ?? '').trim().slice(0, 160);
  const email = String(body.email ?? '').trim();
  const type = String(body.type ?? 'autre');
  const message = String(body.message ?? '').trim();

  const errors: Record<string, string> = {};
  if (nom.length < 2) errors.nom = t.errNom;
  if (!EMAIL_RE.test(email)) errors.email = t.errMail;
  if (!Object.prototype.hasOwnProperty.call(MOTIFS, type)) errors.form = t.errType;
  if (message.length < 20) errors.message = t.errMsg;
  if (message.length > 5000) errors.message = t.errMsgLong;
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const to = process.env.CONTACT_TO_EMAIL ?? 'info@togoexpo.tg';
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev local sans clé : journalise, ne prétend pas livrer en prod (voir README).
    console.log('[contact:dev] destinataire=%s nom=%s email=%s type=%s message=%s', to, nom, email, type, message.slice(0, 200));
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const subject =
      type === 'lettre'
        ? `Lettre d’information TogoExpo — ${email}`
        : `[${MOTIFS[type]}] ${nom}${organisation ? ` — ${organisation}` : ''}`;
    const { error } = await resend.emails.send({
      from: 'TogoExpo <noreply@togoexpo.tg>',
      to: [to],
      replyTo: email,
      subject,
      text: `Nom : ${nom}\nOrganisation : ${organisation || '—'}\nEmail : ${email}\nMotif : ${MOTIFS[type]}\n\n${message}`,
    });
    if (error) {
      console.error('[contact:resend]', error);
      return NextResponse.json({ ok: false, errors: { form: t.errForm } }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (e) {
    console.error('[contact:resend]', e);
    return NextResponse.json({ ok: false, errors: { form: t.errForm } }, { status: 502 });
  }
}
