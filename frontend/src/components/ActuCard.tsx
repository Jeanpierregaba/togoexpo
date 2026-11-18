import Image from 'next/image';
import type { PostListItem } from '@/lib/mappers';
import { ACTU_SKINS } from '@/lib/design';
import { getDictionary } from '@/i18n/dict';
import { lz, type Lang } from '@/i18n/lang';

/** Carte d'article reprise des cartes « Découvrir le Togo » : aplat jaune / vert / rouge
 *  en rotation, image en médaillon, soulèvement au survol. Partagée par la section
 *  « À la une » de l'accueil, la page Actualités et le bas des pages d'article. */
export function ActuCard({
  post,
  index,
  lang,
  sizes = '(max-width: 768px) 100vw, 33vw',
}: {
  post: PostListItem;
  index: number;
  lang: Lang;
  sizes?: string;
}) {
  const t = getDictionary(lang);
  const skin = ACTU_SKINS[index % ACTU_SKINS.length];
  const year = post.date ? new Date(post.date).getFullYear() || null : null;
  const href = lz(`/actualites/${post.slug}`, lang);
  const category = post.categories[0]?.name ?? t.actusHome.one;
  return (
    <article className={`group flex h-full flex-col rounded-[28px] p-3 transition-transform duration-500 hover:-translate-y-2 ${skin.bg}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
        {post.image ? (
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={sizes}
          />
        ) : (
          <div className="grid h-full place-items-center bg-forest font-display text-6xl font-semibold text-sun">
            {year ?? '·'}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-6">
        <span className="font-mono text-xs uppercase tracking-[0.08em]">
          {String(index + 1).padStart(2, '0')} · {category}
          {year ? ` · ${year}` : ''}
        </span>
        <h3 className="m-0 font-display text-[28px] font-semibold leading-[1.05] tracking-[-0.025em]">
          <a href={href} className="transition-opacity hover:opacity-75">
            {post.title}
          </a>
        </h3>
        {post.excerpt && <p className={`m-0 line-clamp-4 flex-1 leading-relaxed ${skin.sub}`}>{post.excerpt}</p>}
        <a
          href={href}
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-pine"
        >
          {t.actusHome.read}{' '}
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            ↗
          </span>
        </a>
        {post.readingMinutes > 0 && (
          <span className={`font-mono text-[11px] uppercase tracking-[0.06em] ${skin.sub}`}>
            {post.readingMinutes} {t.actusHome.min}
          </span>
        )}
      </div>
    </article>
  );
}
