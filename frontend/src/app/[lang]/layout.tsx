import type { Metadata } from 'next';
import { Montserrat, Poppins } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { JsonLd } from '@/components/JsonLd';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Community } from '@/components/Community';
import { BackToTop } from '@/components/BackToTop';
import { Analytics } from '@/components/Analytics';
import { getDictionary } from '@/i18n/dict';
import { LANGS, isLang } from '@/i18n/lang';
import { NEXT_EVENT } from '@/lib/design';
import { siteUrl } from '@/lib/site';

// Une seule famille sur tout le site : Poppins. Les trois variables restent
// (titres, texte, libellés) pour ne pas toucher aux classes `font-*`.
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

// Poppins n'a pas de cyrillique : le serbe s'affiche en Montserrat, géométrique
// et proche. Pas de préchargement : seules les pages serbes la téléchargent.
const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-cyrillic',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  preload: false,
});

export function generateStaticParams() {
  return LANGS.map((l) => ({ lang: l.code }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = isLang(params.lang) ? params.lang : 'fr';
  const t = getDictionary(lang);
  const locale = LANGS.find((l) => l.code === lang)?.locale ?? 'fr_FR';
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t.meta.homeTitle, template: '%s | TogoExpo' },
    description: t.meta.homeDesc,
    openGraph: {
      locale,
      siteName: 'TogoExpo',
      type: 'website',
      title: t.meta.ogTitle,
      description: t.meta.ogDesc,
      url: `${siteUrl()}/${lang}`,
      images: [{ url: `/og/togoexpo-${lang}.jpg`, width: 1200, height: 630, alt: t.meta.ogTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.ogTitle,
      description: t.meta.ogDesc,
      images: [`/og/togoexpo-${lang}.jpg`],
    },
    robots: { index: true, follow: true },
  };
}

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'GovernmentOrganization',
      name: 'Comité National Permanent chargé de l’organisation et de la participation du Togo aux Expositions et Foires Internationales',
      alternateName: 'TogoExpo',
      url: siteUrl(),
      email: 'info@togoexpo.tg',
      telephone: '+228 90 36 15 99',
      address: { '@type': 'PostalAddress', addressLocality: 'Lomé', addressCountry: 'TG' },
      sameAs: [
        'https://www.facebook.com/TogoExpoOfficiel/',
        'https://www.instagram.com/togoexpoofficiel/',
        'https://www.youtube.com/@togoexpoofficiel7522',
      ],
    },
    {
      '@type': 'Event',
      name: NEXT_EVENT.name,
      startDate: '2027-05-15',
      endDate: '2027-08-15',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'Expo 2027',
        address: { '@type': 'PostalAddress', addressLocality: 'Belgrade', addressCountry: 'RS' },
      },
    },
  ],
};

export default function LangLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const t = getDictionary(lang);
  return (
    <html lang={lang} className={`${poppins.variable} ${montserrat.variable}`}>
      <body>
        <JsonLd data={ORG_JSONLD} />
        <SiteHeader lang={lang} />
        <main id="top">{children}</main>
        <Community lang={lang} />
        <SiteFooter lang={lang} />
        <BackToTop label={t.backToTop} />
        <Analytics />
      </body>
    </html>
  );
}
