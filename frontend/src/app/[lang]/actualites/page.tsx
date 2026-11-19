import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { toPosts, type PostsQuery } from '@/lib/mappers';
import { wpQuery } from '@/lib/wp';
import { GET_POSTS } from '@/graphql/queries';
import { getDictionary } from '@/i18n/dict';
import { isLang, langAlternates, lz, toLang, wpLanguage, type Lang } from '@/i18n/lang';
import { ActusList } from '@/components/ActusList';
import { FeaturedActu } from '@/components/FeaturedActu';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { SectionKicker } from '@/components/SectionKicker';
import { withShare } from '@/lib/share';

export const revalidate = 300;

type Props = { params: { lang: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang(params.lang);
  const t = getDictionary(lang);
  return withShare(lang, {
    title: t.actusIdx.h1,
    description: t.actusIdx.para,
    alternates: langAlternates('/actualites', lang),
  });
}

async function getPosts(lang: Lang) {
  try {
    const res = await wpQuery<PostsQuery>(GET_POSTS, { first: 100, language: wpLanguage(lang) });
    return toPosts(res.posts?.nodes);
  } catch {
    return [];
  }
}

export default async function ActusPage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const t = getDictionary(lang);
  const posts = await getPosts(lang);
  return (
    <>
      <PageHero image="/design/news-banniere.jpg" labelledBy="actus-hero-title">
        <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-cream/75">
          <a href={lz('/', lang)} className="transition hover:text-cream">{t.nav[0].label}</a>{' '}
          <span aria-hidden="true">/</span> {t.actusIdx.crumb}
        </p>
        <SectionKicker tone="dark" className="mb-6 mt-10">{t.actusIdx.kicker}</SectionKicker>
        <h1
          id="actus-hero-title"
          className="m-0 font-display text-[clamp(40px,6vw,75px)] font-semibold leading-[0.95] tracking-[-0.04em]"
        >
          {t.actusIdx.h1}
        </h1>
        <p className="mb-0 mt-6 max-w-[62ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-mist">
          {t.actusIdx.para}
          {posts.length > 0 && (
            <>
              {' '}— <span className="font-semibold text-sun">{posts.length} {t.actusIdx.count}</span>
            </>
          )}
        </p>
      </PageHero>

      <section aria-label={t.actusIdx.h1} className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1360px]">
          {posts.length === 0 ? (
            <p className="m-0 rounded-[26px] border border-dashed border-forest/25 bg-paper p-10 text-center leading-relaxed text-[#42574C]">
              {t.actusIdx.empty}
            </p>
          ) : (
            <>
              {/* La dernière publication occupe toute la largeur, au-dessus des filtres. */}
              <Reveal className="mb-14 block">
                <FeaturedActu post={posts[0]} lang={lang} />
              </Reveal>
              {posts.length > 1 && <ActusList posts={posts.slice(1)} lang={lang} startIndex={1} />}
            </>
          )}
        </div>
      </section>
    </>
  );
}
