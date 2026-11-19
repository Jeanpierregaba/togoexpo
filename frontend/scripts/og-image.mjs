#!/usr/bin/env node
/**
 * Fabrique les images d'aperçu de partage (Open Graph, 1200 × 630) dans
 * public/og/togoexpo-<langue>.jpg : photo du site, voile, logo, accroche,
 * adresse et liseré aux couleurs du drapeau.
 *
 *   npm run og
 *
 * À relancer si l'accroche ou la photo change, puis pousser les images.
 */
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const W = 1200;
const H = 630;
const PHOTO = root('public/design/hero-togo-expo.jpg');
const LOGO = root('public/design/logo-togoexpo.webp');

const TEXT = {
  fr: { kicker: 'EXPOSITIONS UNIVERSELLES · FOIRES INTERNATIONALES', title: ['Une ambition', 'sans frontières'] },
  en: { kicker: 'WORLD EXPOS · INTERNATIONAL FAIRS', title: ['An ambition', 'without borders'] },
  ja: { kicker: '万国博覧会 · 国際見本市', title: ['国境なき', '志'] },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function overlay(lang) {
  const t = TEXT[lang];
  const font = lang === 'ja' ? "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', sans-serif" : "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const size = lang === 'ja' ? 66 : 76;
  const lines = t.title
    .map((l, i) => `<text x="72" y="${398 + i * (size + 8)}" font-size="${size}" font-weight="700" fill="${i === 1 ? '#FFCE00' : '#FFFFFF'}" letter-spacing="-1.5">${esc(l)}</text>`)
    .join('');
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="side" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0B0F0C" stop-opacity="0.92"/>
      <stop offset="0.55" stop-color="#0B0F0C" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#0B0F0C" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.45" stop-color="#0B0F0C" stop-opacity="0"/>
      <stop offset="1" stop-color="#0B0F0C" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#side)"/>
  <rect width="${W}" height="${H}" fill="url(#bottom)"/>
  <g font-family="${font}">
    <rect x="72" y="282" width="36" height="3" fill="#FFCE00"/>
    <text x="122" y="290" font-size="20" font-weight="600" fill="#FFCE00" letter-spacing="3">${esc(t.kicker)}</text>
    ${lines}
    <text x="72" y="566" font-size="24" font-weight="500" fill="#FFFFFF" fill-opacity="0.85" letter-spacing="1">togoexpo.org</text>
  </g>
  <rect x="0" y="${H - 10}" width="${W / 3}" height="10" fill="#006A4E"/>
  <rect x="${W / 3}" y="${H - 10}" width="${W / 3}" height="10" fill="#FFCE00"/>
  <rect x="${(2 * W) / 3}" y="${H - 10}" width="${W / 3}" height="10" fill="#D20F34"/>
</svg>`);
}

await mkdir(root('public/og'), { recursive: true });
const photo = await sharp(PHOTO).resize(W, H, { fit: 'cover', position: 'attention' }).toBuffer();
const logo = await sharp(LOGO).resize({ width: 230 }).toBuffer();
for (const lang of Object.keys(TEXT)) {
  const out = root(`public/og/togoexpo-${lang}.jpg`);
  await sharp(photo)
    .composite([{ input: overlay(lang) }, { input: logo, top: 64, left: 64 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
  console.log(out);
}
