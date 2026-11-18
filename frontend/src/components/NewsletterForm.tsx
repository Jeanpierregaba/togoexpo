'use client';
import { useState } from 'react';
import { getDictionary } from '@/i18n/dict';
import type { Lang } from '@/i18n/lang';

export function NewsletterForm({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState('error');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: 'Lettre d’information',
          email,
          type: 'lettre',
          message: 'Inscription à la lettre d’information TogoExpo (calendrier, appels à exposants).',
          website: '',
        }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p className="m-0 rounded-full bg-sun px-5 py-3.5 font-semibold text-forest" role="status">
        {t.newsletter.thanks}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex gap-2 rounded-full bg-cream p-1.5">
        <label htmlFor="nl" className="sr-only">
          {t.newsletter.aria}
        </label>
        <input
          id="nl"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.newsletter.ph}
          className="w-0 min-w-0 flex-1 bg-transparent px-4 text-[15px] text-forest outline-none placeholder:text-forest/50"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="cursor-pointer rounded-full bg-forest px-5 py-3 font-semibold text-sun disabled:opacity-60"
        >
          {state === 'sending' ? t.newsletter.sending : t.newsletter.sub}
        </button>
      </div>
      {state === 'error' && (
        <p className="mt-2 text-sm text-sun" role="alert">
          {t.newsletter.error}
        </p>
      )}
    </form>
  );
}
