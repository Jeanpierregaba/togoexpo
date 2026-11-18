import Image from 'next/image';
import type { PostListItem } from '@/lib/mappers';
import { getDictionary } from '@/i18n/dict';
import { lz, type Lang } from '@/i18n/lang';

/** Article mis en avant : même habillage que les cartes (aplat jaune, médaillon,
 *  pastille verte) mais sur toute la largeur, image et texte côte à côte. */
export function FeaturedActu({ post, lang }: { post: PostListItem; lang: Lang }) {
  const t = getDictionary(lang);
  const year = post.date ? new Date(post.date).getFullYear() || null : null;
  const href = lz(`/actualites/${post.slug}`, lang);
  const category = post.categories[0]?.name ?? t.actusHome.one;
  return (
    <article className="group grid gap-0 rounded-[32px] bg-sun p-3 text-forest transition-transform duration-500 hover:-translate-y-1.5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] lg:aspect-auto lg:min-h-[420px]">
        {post.image ? (
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        ) : (
          <div className="grid h-full place-items-center bg-forest font-display text-7xl font-semibold text-sun">
            {year ?? '·'}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center gap-4 px-4 pb-4 pt-7 lg:px-10 lg:py-10">
        <span className="font-mono text-xs uppercase tracking-[0.08em]">
          {t.actusIdx.featured} · {category}
          {year ? ` · ${year}` : ''}
        </span>
        <h2 className="m-0 font-display text-[clamp(32px,3.68vw,48px)] font-semibold leading-[1.02] tracking-[-0.03em]">
          <a href={href} className="transition-opacity hover:opacity-75">
            {post.title}
          </a>
        </h2>
        {post.excerpt && <p className="m-0 line-clamp-5 leading-relaxed text-[#2B2A1A]">{post.excerpt}</p>}
        <a
          href={href}
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-forest px-6 py-3 font-semibold text-cream transition-colors hover:bg-pine"
        >
          {t.actusHome.read}{' '}
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            ↗
          </span>
        </a>
        {post.readingMinutes > 0 && (
          <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#2B2A1A]">
            {post.readingMinutes} {t.actusHome.min}
          </span>
        )}
      </div>
    </article>
  );
}
