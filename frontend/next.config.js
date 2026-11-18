const LEGACY_POSTS = require('./legacy-posts');

// Domaine du CMS de ce déploiement (adresse provisoire comprise), en plus des domaines définitifs.
const WP_HOST = process.env.NEXT_PUBLIC_WP_URL ? new URL(process.env.NEXT_PUBLIC_WP_URL).hostname : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Serveur autonome (`.next/standalone`) pour l'image Docker de production.
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'togoexpo.tg' },
      { protocol: 'https', hostname: 'cms.togoexpo.tg' },
      // Banque d'images Flickr (page Médiathèque).
      { protocol: 'https', hostname: 'live.staticflickr.com' },
      ...(WP_HOST && WP_HOST !== 'cms.togoexpo.tg' ? [{ protocol: 'https', hostname: WP_HOST }] : []),
    ]
  },
  async redirects() {
    // Ancien site WordPress (togoexpo.tg) -> nouvelles routes, en 308 pour
    // préserver le référencement. Destinations déjà préfixées par `/fr` :
    // une seule redirection, sans repasser par le middleware de langue.
    // (Les redirections de next.config s'exécutent avant le middleware.)
    const pages = [
      { source: '/le-comite-dorganisation', destination: '/fr/a-propos#comite' },
      { source: '/missions-objectifs', destination: '/fr/a-propos#missions' },
      { source: '/mission-objectifs', destination: '/fr/a-propos#missions' },
      { source: '/presentation-du-togo', destination: '/fr/togo' },
      { source: '/participation-du-togo', destination: '/fr/editions' },
      { source: '/decouvrez-des-images-pour-les-meilleurs-moments-de-partage-sur-togoexpo', destination: '/fr/mediatheque' },
      // Sans sous-chemins : `public/videos/` sert les vidéos des héros.
      { source: '/videos', destination: '/fr/mediatheque', exact: true },
      { source: '/blog', destination: '/fr/actualites' },
      { source: '/devenir-sponsor', destination: '/fr/contact?motif=partenariat' },
      { source: '/evenement', destination: '/fr/editions' },
      { source: '/home', destination: '/fr' },
    ].flatMap(({ exact, ...r }) => [
      { ...r, permanent: true },
      ...(exact ? [] : [{ source: `${r.source}/:path+`, destination: r.destination, permanent: true }]),
    ]);
    // Archives WordPress : catégories, étiquettes, auteurs, dates, flux RSS.
    const archives = [
      { source: '/category/:path*', destination: '/fr/actualites', permanent: true },
      { source: '/tag/:path*', destination: '/fr/actualites', permanent: true },
      { source: '/author/:path*', destination: '/fr/actualites', permanent: true },
      { source: '/:year(\\d{4})/:path*', destination: '/fr/actualites', permanent: true },
      { source: '/feed/:path*', destination: '/fr/actualites', permanent: true },
    ];
    // Les 33 articles de l'ancien blog : `/<slug>/` -> `/fr/actualites/<slug>`.
    const posts = LEGACY_POSTS.flatMap((slug) => [
      { source: `/${slug}`, destination: `/fr/actualites/${slug}`, permanent: true },
      { source: `/${slug}/:path+`, destination: `/fr/actualites/${slug}`, permanent: true },
    ]);
    return [...pages, ...archives, ...posts];
  }
};
module.exports = nextConfig;
