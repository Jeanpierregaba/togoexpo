#!/usr/bin/env node
/**
 * Relève toutes les photos publiques du compte Flickr de TogoExpo dans
 * src/data/flickr.json, que lit la page Médiathèque.
 *
 *   npm run flickr
 *
 * Sans clé d'API : le script lit les données que les pages publiques de
 * Flickr embarquent. La première page du fil n'en contient que 25, mais la
 * page « /with/<photo> » en donne 100 à partir de la photo indiquée : on
 * avance ainsi jusqu'au bout du fil. À relancer après l'ajout de photos sur
 * Flickr, puis pousser le fichier (le déploiement suit).
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const USER = '190367340@N06';
const BASE = `https://www.flickr.com/photos/${USER}`;
const OUT = fileURLToPath(new URL('../src/data/flickr.json', import.meta.url));

/** Les données d'une page Flickr (`modelExport`). */
async function model(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh)' } });
  if (!res.ok) throw new Error(`${url} : HTTP ${res.status}`);
  const html = await res.text();
  const i = html.indexOf('modelExport:');
  if (i < 0) throw new Error(`${url} : données introuvables`);
  const s = html.slice(i + 'modelExport:'.length).trimStart();
  // L'objet JSON se termine à l'accolade qui équilibre la première.
  let depth = 0, inStr = false, esc = false, end = 0;
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) { end = k + 1; break; }
  }
  return JSON.parse(s.slice(0, end)).main;
}

/** Les photos d'une page du fil, dans l'ordre du fil (les plus récentes d'abord). */
async function streamPhotos(url) {
  const list = (await model(url))['photostream-models'][0].data.photoPageList.data;
  const photos = (list._data ?? []).filter(Boolean).map((p) => p.data).filter((p) => p?.id && p.sizes);
  return { photos, total: list.totalItems };
}

/** Coquilles des titres Flickr, corrigées à l'affichage. */
const FIXES = [[/\bJounrnée\b/g, 'Journée']];
const cleanTitle = (t) => FIXES.reduce((s, [re, by]) => s.replace(re, by), (t ?? '').trim());

function toPhoto(p) {
  const sizes = p.sizes.data;
  const big = sizes.l ?? sizes.c ?? sizes.z ?? sizes.m;
  const url = (u) => `https:${u.data.url}`;
  const taken = p.stats?.data?.dateTaken ?? null;
  return {
    id: p.id,
    title: cleanTitle(p.title),
    src: url(big),
    width: big.data.width,
    height: big.data.height,
    taken,
    year: Number((taken ?? '').slice(0, 4)) || new Date(Number(p.stats?.data?.datePosted ?? 0) * 1000).getUTCFullYear(),
    page: `${BASE}/${p.id}/`,
    video: p.mediaType === 'video',
  };
}

const photos = new Map();
// Pages à lire : le fil (une page = 100 photos, dont seules les 25 premières
// sont embarquées… sauf en page 2 et suivantes) et les pages « /with/ », qui
// embarquent 100 photos autour de celle indiquée.
const queue = [`${BASE}/`];
const seen = new Set();
let total = Infinity;
while (queue.length && photos.size < total && seen.size < 100) {
  const url = queue.shift();
  if (seen.has(url)) continue;
  seen.add(url);
  const res = await streamPhotos(url);
  total = res.total;
  if (url === `${BASE}/`) for (let n = 2; n <= Math.ceil(total / 100); n++) queue.push(`${BASE}/page${n}`);
  for (const p of res.photos) if (!photos.has(p.id)) photos.set(p.id, toPhoto(p));
  const last = res.photos[res.photos.length - 1];
  if (last) queue.push(`${BASE}/with/${last.id}/`);
  console.log(`${photos.size}/${total}`);
}
// Les vidéos (leur vignette est souvent vide) restent sur Flickr et YouTube.
// Ordre : les plus récentes d'abord.
const order = [...photos.values()].filter((p) => !p.video).map(({ video, ...p }) => p).sort((a, b) => (b.taken ?? '').localeCompare(a.taken ?? ''));

const out = {
  url: `${BASE}/`,
  syncedAt: new Date().toISOString(),
  photos: order,
};
await writeFile(OUT, JSON.stringify(out, null, 1) + '\n');
console.log(`${out.photos.length} photos, ${photos.size - out.photos.length} vidéos écartées (Flickr en annonce ${total}) -> src/data/flickr.json`);
