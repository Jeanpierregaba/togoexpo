import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mapPostDetail, toPosts, type PostQuery, type PostsQuery } from '@/lib/mappers';
import { wpQuery } from '@/lib/wp';
import { GET_POST, GET_POSTS } from '@/graphql/queries';
import { siteUrl } from '@/lib/site';
import { getDictionary } from '@/i18n/dict';
import { LANGS, isLang, lz, slugAlternates, toLang, wpLanguage, type Lang } from '@/i18n/lang';
import { ActuCard } from '@/components/ActuCard';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { AccentTitle } from '@/components/SectionKicker';
import { PageHero } from '@/components/PageHero';
import { withShare } from '@/lib/share';

export const revalidate = 300;

type Props = { params: { lang: string; slug: string } };

// Appelé une fois par langue du segment parent : les slugs Polylang diffèrent par langue.
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  try {
    const res = await wpQuery<PostsQuery>(GET_POSTS, { first: 100, language: wpLanguage(toLang(params.lang)) });
    return toPosts(res.posts?.nodes).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

async function getPost(slug: string) {
  try {
    const res = await wpQuery<PostQuery>(GET_POST, { slug });
    if (res.post) return mapPostDetail(res.post);
  } catch {
    // CMS injoignable : 404 ci-dessous.
  }
  return null;
}

/** Les trois publications suivantes de la même langue, article courant exclu. */
async function getMorePosts(lang: Lang, slug: string) {
  try {
    const res = await wpQuery<PostsQuery>(GET_POSTS, { first: 8, language: wpLanguage(lang) });
    return toPosts(res.posts?.nodes).filter((p) => p.slug !== slug).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang(params.lang);
  const post = await getPost(params.slug);
  if (!post) return { title: getDictionary(lang).notFound.h1 };
  return withShare(lang, {
    title: post.title,
    description: post.excerpt.slice(0, 150),
    alternates: slugAlternates('/actualites', params.slug, lang),
  }, { image: post.image });
}

export default async function ActuPage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang: Lang = params.lang;
  const t = getDictionary(lang);
  const post = await getPost(params.slug);
  if (!post) notFound();
  const more = await getMorePosts(lang, params.slug);
  return (
    <article>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date || undefined,
          inLanguage: LANGS.find((l) => l.code === lang)?.htmlLang,
          image: post.image?.src,
          author: { '@type': 'Organization', name: 'TogoExpo', url: siteUrl() },
          mainEntityOfPage: `${siteUrl()}/${lang}/actualites/${params.slug}`,
        }}
      />
      {/* Bannière : l'image mise en avant en fond, le titre seul par-dessus. */}
      <PageHero image={post.image?.src ?? '/design/hero-togo-expo.jpg'} labelledBy="actu-title" overlay="strong">
        <h1
          id="actu-title"
          className="m-0 max-w-[22ch] font-display text-[clamp(36px,5vw,72px)] font-semibold leading-[0.95] tracking-[-0.04em]"
        >
          {post.title}
        </h1>
      </PageHero>
      <section aria-label={post.title} className="bg-cream px-5 py-[100px] text-forest sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1360px]">
          <Reveal className="mx-auto max-w-[760px]">
            <div
              className="text-[17px] leading-relaxed text-[#25372E] [&_a]:text-blood [&_a]:underline [&_a]:underline-offset-4 [&_figure]:my-8 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-semibold [&_img]:rounded-3xl [&_li]:my-1.5 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div className="mt-12 flex flex-wrap gap-2.5 border-t border-[#D3D6C8] pt-8">
              <a
                href={lz('/actualites', lang)}
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-pine"
              >
                {t.actuDetail.back}
              </a>
              <a
                href={lz('/contact', lang)}
                className="inline-flex items-center gap-2 rounded-full border border-forest/25 px-6 py-3 text-sm font-semibold transition-colors hover:border-forest hover:bg-forest hover:text-cream"
              >
                {t.actuDetail.partner}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {more.length > 0 && (
        <section aria-labelledby="actu-more" className="bg-cream px-5 pb-[100px] text-forest sm:px-8 lg:px-14">
          <div className="mx-auto max-w-[1360px] border-t border-[#D3D6C8] pt-[60px]">
            <Reveal>
              <h2 id="actu-more" className="m-0 mb-10 font-display text-[clamp(32px,3.91vw,51px)] font-semibold leading-[0.98] tracking-[-0.035em]">
                <AccentTitle text={t.actuDetail.more} accent={t.actuDetail.moreAccent} tone="light" />
              </h2>
            </Reveal>
            <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
              {more.map((p, i) => (
                <li key={p.slug}>
                  <Reveal delay={i * 100} className="h-full">
                    <ActuCard post={p} index={i} lang={lang} />
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </article>
  );
}
