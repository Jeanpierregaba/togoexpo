'use client';
import { useRef, useState } from 'react';

type Version = 'fr' | 'en';

/**
 * Lecteur du documentaire de l'ambassadeur, en deux versions (français et
 * anglais). Avant la lecture, l'affiche porte un grand bouton ; ensuite les
 * contrôles natifs prennent le relais. Le sélecteur change la piste sans perdre
 * le fil : la lecture reprend au même instant, et continue si elle était en cours.
 */
export function AmbassadorVideo({
  sources,
  poster,
  initial,
  title,
  label,
  duration,
  playLabel,
  versionLabel,
  versionNames,
}: {
  sources: Record<Version, string>;
  poster: string;
  initial: Version;
  title: string;
  label: string;
  /** Durée affichée sur l'affiche, ex. « 1:44 ». */
  duration: string;
  playLabel: string;
  versionLabel: string;
  versionNames: Record<Version, string>;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [version, setVersion] = useState<Version>(initial);
  const [started, setStarted] = useState(false);

  function start() {
    const v = ref.current;
    if (!v) return;
    setStarted(true);
    void v.play().catch(() => {});
    v.focus();
  }

  function choose(next: Version) {
    const v = ref.current;
    if (next === version || !v) return;
    const time = v.currentTime;
    const playing = !v.paused && !v.ended;
    setVersion(next);
    v.src = sources[next];
    v.addEventListener(
      'loadedmetadata',
      () => {
        v.currentTime = time;
        if (playing) void v.play().catch(() => {});
      },
      { once: true },
    );
    v.load();
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="m-0 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-cream/80">
          <span aria-hidden="true" className="grid h-2 w-2 place-items-center rounded-full bg-blood" />
          {label} <span className="text-cream/45">· {duration}</span>
        </p>
        <div className="flex items-center gap-3">
          <span id="amb-version" className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/55">
            {versionLabel}
          </span>
          <div role="group" aria-labelledby="amb-version" className="inline-flex rounded-full border border-cream/15 bg-cream/5 p-1">
            {(['fr', 'en'] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={version === v}
                lang={v}
                onClick={() => choose(v)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5 ${
                  version === v ? 'bg-sun text-forest' : 'text-cream/80 hover:text-cream'
                }`}
              >
                <span aria-hidden="true" className="mr-1.5 font-mono text-[11px] uppercase">{v}</span>
                {versionNames[v]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] bg-black shadow-[0_50px_120px_-60px_rgba(0,0,0,1)] ring-1 ring-cream/10">
        <video
          ref={ref}
          className="block aspect-video h-auto w-full"
          src={sources[initial]}
          poster={poster}
          controls={started}
          playsInline
          preload="metadata"
          aria-label={title}
          lang={version}
          onPlay={() => setStarted(true)}
        />
        {!started && (
          <button
            type="button"
            onClick={start}
            className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-5 bg-gradient-to-t from-black/60 via-black/10 to-black/20"
          >
            <span className="sr-only">{playLabel}</span>
            <span
              aria-hidden="true"
              className="relative grid h-20 w-20 place-items-center rounded-full bg-sun text-forest shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none sm:h-28 sm:w-28"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-sun/40 motion-reduce:hidden" />
              <svg viewBox="0 0 24 24" className="relative ml-1 h-8 w-8 sm:h-10 sm:w-10" fill="currentColor">
                <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
              </svg>
            </span>
            <span
              aria-hidden="true"
              className="hidden rounded-full bg-black/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-cream backdrop-blur-sm sm:block"
            >
              {playLabel} · {versionNames[version]}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
