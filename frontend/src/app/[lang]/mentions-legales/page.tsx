import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/dict';
import { isLang, langAlternates, toLang } from '@/i18n/lang';

type Props = { params: { lang: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang(params.lang);
  const t = getDictionary(lang);
  return {
    title: t.legal.title,
    description: t.legal.desc,
    alternates: langAlternates('/mentions-legales', lang),
  };
}

export default function MentionsLegales({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const t = getDictionary(params.lang);
  return (
    <div className="mx-auto max-w-3xl px-4 py-[100px]">
      <h1 className="font-display text-4xl font-bold">{t.legal.title}</h1>
      <div className="mt-6 space-y-6 text-sm leading-relaxed text-black/80">
        {t.legal.sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-bold">{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
