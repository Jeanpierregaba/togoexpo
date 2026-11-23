import { GET_POSTS } from '@/graphql/queries';
import { toPosts, type PostListItem, type PostsQuery } from '@/lib/mappers';
import { wpQuery } from '@/lib/wp';
import { DEFAULT_LANG, isCmsLang, wpLanguage, type Lang } from '@/i18n/lang';
import { fixedIn } from '@/i18n/fixed';

/** Noms de catégories (rédigés en français dans WordPress) dans la langue de la page. */
export function localizePosts(posts: PostListItem[], lang: Lang): PostListItem[] {
  if (lang === DEFAULT_LANG) return posts;
  return posts.map((p) => ({ ...p, categories: p.categories.map((c) => ({ ...c, name: fixedIn(c.name, lang) })) }));
}

/**
 * Articles d'une langue. Tant qu'aucun article n'est traduit dans cette langue,
 * on affiche les articles français (`fallback: true`) plutôt qu'une page vide.
 * Lève une erreur si le CMS est injoignable.
 */
export async function postsWithFallback(lang: Lang, first: number): Promise<{ posts: PostListItem[]; fallback: boolean }> {
  const res = isCmsLang(lang) ? await wpQuery<PostsQuery>(GET_POSTS, { first, language: wpLanguage(lang) }) : null;
  const posts = toPosts(res?.posts?.nodes);
  if (posts.length > 0 || lang === DEFAULT_LANG) return { posts: localizePosts(posts, lang), fallback: false };
  const fr = await wpQuery<PostsQuery>(GET_POSTS, { first, language: 'FR' });
  return { posts: localizePosts(toPosts(fr.posts?.nodes), lang), fallback: true };
}
