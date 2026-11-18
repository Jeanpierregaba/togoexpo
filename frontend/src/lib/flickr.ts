import bank from '@/data/flickr.json';

/** Une photographie de la banque d'images Flickr (voir scripts/flickr-sync.mjs). */
export type FlickrPhoto = {
  id: string;
  title: string;
  src: string;
  width: number;
  height: number;
  taken: string | null;
  year: number;
  page: string;
};

export const FLICKR_URL: string = bank.url;
export const FLICKR_PHOTOS: FlickrPhoto[] = bank.photos;
export const FLICKR_HOST = 'live.staticflickr.com';
