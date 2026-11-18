'use client';
import { usePathname } from 'next/navigation';
import { DEFAULT_LANG, isLang, type Lang } from './lang';

/** Langue courante depuis l’URL (composants client sans prop `lang`). */
export function useLang(): Lang {
  const pathname = usePathname() ?? '/';
  const seg = pathname.split('/')[1];
  return isLang(seg) ? seg : DEFAULT_LANG;
}
