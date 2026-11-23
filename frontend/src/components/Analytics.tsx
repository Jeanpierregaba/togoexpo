'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { track, UMAMI_DOMAINS, UMAMI_PATH, UMAMI_WEBSITE_ID } from '@/lib/analytics';

const DOWNLOAD = /\.(pdf|zip|docx?|xlsx?|pptx?|jpe?g|png|mp4)(\?|#|$)/i;

/**
 * Charge Umami et mesure, en plus des pages vues, les clics qui comptent :
 * téléchargements, liens sortants (réseaux sociaux, sites officiels…), e-mail
 * et téléphone. Un seul écouteur sur le document, rien à poser lien par lien.
 */
export function Analytics() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      if (href.startsWith('mailto:')) return track('contact-email', { adresse: href.slice(7) });
      if (href.startsWith('tel:')) return track('contact-telephone', { numero: href.slice(4) });
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (a.hasAttribute('download') || DOWNLOAD.test(url.pathname)) {
        return track('telechargement', { fichier: decodeURIComponent(url.pathname.split('/').pop() ?? url.pathname) });
      }
      if (url.origin !== window.location.origin && /^https?:$/.test(url.protocol)) {
        return track('lien-sortant', { site: url.hostname, url: url.href });
      }
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return (
    <Script
      src={`${UMAMI_PATH}/script.js`}
      data-website-id={UMAMI_WEBSITE_ID}
      data-host-url={UMAMI_PATH}
      data-domains={UMAMI_DOMAINS}
      strategy="afterInteractive"
    />
  );
}
