'use client';
import { useRef, useState } from 'react';

type Version = 'fr' | 'en';

/**
 * Lecteur du documentaire de l'ambassadeur, en deux versions (français et
 * anglais). Le sélecteur change la piste sans perdre le fil : la lecture reprend
 * au même instant, et continue si elle était en cours.
 */
export function AmbassadorVideo({
  sources,
  poster,
  initial,
  title,
  versionLabel,
  versionNames,
}: {
  sources: Record<Version, string>;
  poster: string;
  initial: Version;
  title: string;
  versionLabel: string;
  versionNames: Record<Version, string>;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [version, setVersion] = useState<Version>(initial);

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
      <div className="overflow-hidden rounded-[28px] bg-black shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)]">
        <video
          ref={ref}
          className="block aspect-video h-auto w-full"
          src={sources[initial]}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          aria-label={title}
          lang={version}
        />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span id="amb-version" className="font-mono text-[11px] uppercase tracking-[0.14em] text-forest/70">
          {versionLabel}
        </span>
        <div role="group" aria-labelledby="amb-version" className="inline-flex rounded-full bg-forest/10 p-1">
          {(['fr', 'en'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={version === v}
              lang={v}
              onClick={() => choose(v)}
              className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                version === v ? 'bg-forest text-cream' : 'text-forest hover:bg-forest/10'
              }`}
            >
              <span aria-hidden="true" className="mr-1.5 font-mono text-[11px] uppercase">{v}</span>
              {versionNames[v]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
