import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeroExpo } from '@/components/HeroExpo';
import { Marquee } from '@/components/Marquee';
import { Mission } from '@/components/Mission';
import { UpcomingEvents } from '@/components/UpcomingEvents';
import { EditionsExplorer } from '@/components/EditionsExplorer';
import { TogoCards } from '@/components/TogoCards';
import { MediaWall } from '@/components/MediaWall';
import { HomeActus } from '@/components/HomeActus';
import { HomeFaq } from '@/components/HomeFaq';
import { MOCK_EDITIONS, MOCK_EDITIONS_EN, MOCK_EDITIONS_JA, MOCK_UPCOMING, MOCK_UPCOMING_EN, MOCK_UPCOMING_JA, MOCK_EDITIONS_SR, MOCK_UPCOMING_SR } from '@/lib/editions';
import { toEditions, toPosts, toUpcoming, type HomeQuery, type PostListItem } from '@/lib/mappers';
import { localizePosts, postsWithFallback } from '@/lib/posts';
import { wpQuery } from '@/lib/wp';
import { GET_HOME } from '@/graphql/queries';
import { getDictionary } from '@/i18n/dict';
import { baseSlug, isCmsLang, isLang, langAlternates, wpLanguage, type Lang } from '@/i18n/lang';
import { withShare } from '@/lib/share';

export const revalidate = 300;

type Props = { params: { lang: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = isLang(params.lang) ? params.lang : 'fr';
  const t = getDictionary(lang);
  return withShare(lang, {
    title: t.meta.homeTitle,
    description: t.meta.homeDesc,
    alternates: langAlternates('/', lang),
  }, { title: t.meta.ogTitle, description: t.meta.ogDesc });
}

const MOCK_BY_LANG = {
  fr: { editions: MOCK_EDITIONS, upcoming: MOCK_UPCOMING },
  en: { editions: MOCK_EDITIONS_EN, upcoming: MOCK_UPCOMING_EN },
  ja: { editions: MOCK_EDITIONS_JA, upcoming: MOCK_UPCOMING_JA },
  sr: { editions: MOCK_EDITIONS_SR, upcoming: MOCK_UPCOMING_SR },
};

/** Sans article dans la langue, l'accueil montre les derniers articles français. */
async function actusOf(lang: Lang, posts: PostListItem[]) {
  if (posts.length > 0) return localizePosts(posts, lang);
  try {
    return (await postsWithFallback(lang, 3)).posts;
  } catch {
    return posts;
  }
}

async function getData(lang: Lang) {
  // Langue absente du CMS (serbe) : éditions du code, actualités françaises.
  if (!isCmsLang(lang)) return { ...MOCK_BY_LANG[lang], actus: await actusOf(lang, []) };
  try {
    const res = await wpQuery<HomeQuery>(GET_HOME, { first: 3, language: wpLanguage(lang) });
    const editions = toEditions(res.editions?.nodes);
    if (editions.length === 0) throw new Error('CMS sans editions');
    const year = new Date().getFullYear();
    return {
      editions: editions.filter((e) => e.annee <= year),
      // Les visuels éditoriaux locaux des rendez-vous priment sur l'image à la
      // une WordPress, restée sur les anciennes photos de ville.
      upcoming: toUpcoming(res.editions?.nodes).map((e) => {
        const visual = MOCK_BY_LANG[lang].upcoming.find((m) => baseSlug(m.slug) === baseSlug(e.slug))?.image;
        return visual ? { ...e, image: visual } : e;
      }),
      actus: await actusOf(lang, toPosts(res.posts?.nodes)),
    };
  } catch {
    // CMS injoignable (docker down) : fallback mock pour dev/build.
    return { ...MOCK_BY_LANG[lang], actus: [] };
  }
}

export default async function Home({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const data = await getData(lang);
  return (
    <>
      <HeroExpo lang={lang}>
        <Marquee lang={lang} />
      </HeroExpo>
      <TogoCards lang={lang} />
      <UpcomingEvents events={data.upcoming} lang={lang} />
      <EditionsExplorer editions={data.editions} lang={lang} />
      <Mission lang={lang} />
      <MediaWall lang={lang} />
      <HomeActus posts={data.actus} lang={lang} />
      <HomeFaq lang={lang} />
    </>
  );
}
