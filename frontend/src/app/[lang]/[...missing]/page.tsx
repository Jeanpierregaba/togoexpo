import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/dict';
import { toLang } from '@/i18n/lang';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return { title: getDictionary(toLang(params.lang)).notFound.h1, robots: { index: false, follow: true } };
}

// Toute adresse inconnue sous /[lang]/ passe par la frontière `not-found` du
// segment de langue : la 404 s'affiche alors avec l'en-tête et le pied du site
// (sinon Next rend la 404 racine, sans mise en page).
export default function Missing() {
  notFound();
}
