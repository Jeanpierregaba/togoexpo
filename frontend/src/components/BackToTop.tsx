'use client';
import { useEffect, useState } from 'react';

export function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 520);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={toTop}
      className={`fixed bottom-5 right-5 z-40 inline-flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border border-white/20 bg-forest text-cream shadow-[0_16px_40px_-18px_rgba(0,0,0,.8)] transition-all duration-300 hover:bg-pine motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <span aria-hidden="true" className="font-mono text-lg leading-none">
        ↑
      </span>
    </button>
  );
}
