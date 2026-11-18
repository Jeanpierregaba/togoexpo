import type { PostListItem } from '@/lib/mappers';
import { getDictionary } from '@/i18n/dict';
import { lz, type Lang } from '@/i18n/lang';
import { ActuCard } from './ActuCard';
import { Reveal } from './Reveal';
import { SectionKicker } from './SectionKicker';
import { AccentTitle } from './SectionKicker';

export function HomeActus({ posts, lang }: { posts: PostListItem[]; lang: Lang }) {
  const t = getDictionary(lang);
  return (
    <section id="actualites" aria-labelledby="news-title" className="bg-white px-5 py-[100px] text-forest sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <SectionKicker className="mb-6">{t.actusHome.kicker}</SectionKicker>
            </Reveal>
            <Reveal>
              <h2 id="news-title" className="m-0 font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.045em]">
                <AccentTitle text={t.actusHome.h2} accent={t.actusHome.h2Accent} tone="light" />
              </h2>
            </Reveal>
          </div>
          <div className="flex flex-col items-start gap-5 lg:items-end">
            <Reveal>
              <p className="m-0 max-w-[42ch] leading-relaxed text-[#42574C] lg:text-right">{t.actusHome.para}</p>
            </Reveal>
            <Reveal>
              <a href={lz('/actualites', lang)} className="inline-flex gap-2.5 rounded-full bg-sun px-6 py-3.5 font-semibold text-forest transition-colors hover:bg-pine hover:text-white">
                {t.actusHome.all}
              </a>
            </Reveal>
          </div>
        </div>
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-[#DEE2D5] bg-paper p-6 text-sm text-[#42574C]">
            {t.actusHome.empty}
          </p>
        ) : (
          /* Mêmes cartes que « Découvrir le Togo », partagées avec la page Actualités. */
          <div className="grid gap-4 md:grid-cols-3">
            {posts.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <ActuCard post={p} index={i} lang={lang} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
