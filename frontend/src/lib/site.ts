export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

/** URL absolue d'un chemin non localisé (sitemap.xml, robots.txt, assets). */
export function canonical(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl()}${p}`;
}
