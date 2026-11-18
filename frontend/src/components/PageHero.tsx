import Image from 'next/image';
import type { ReactNode } from 'react';

/** Bannière de tête commune aux pages internes : visuel pleine largeur sur au moins
 *  70 vh, voiles neutres pour la lisibilité, contenu calé en bas. Seuls le visuel
 *  et le texte changent d'une page à l'autre. */
export function PageHero({
  image,
  video,
  media,
  labelledBy,
  credit,
  overlay = 'soft',
  height = 'tall',
  bright = false,
  children,
}: {
  /** Photo de fond, et affiche du lecteur quand une vidéo est fournie. */
  image: string;
  /** Vidéo de fond jouée en boucle, sans son. L'image reste visible dessous :
   *  elle prend le relais avant le chargement et sous `prefers-reduced-motion`. */
  video?: string;
  /** Fond sur mesure — un diaporama, par exemple. Il remplace la photo et la
   *  vidéo ; les voiles de lisibilité restent posés par-dessus. */
  media?: ReactNode;
  /** `id` du titre de la page, pour nommer la région. */
  labelledBy: string;
  credit?: string;
  /** Voile posé sur le visuel. `strong` pose un dégradé neutre en diagonale, dense
   *  dans le coin bas-gauche où se trouve le texte et effacé vers le haut-droit :
   *  le titre reste lisible sans masquer le plan. `light` : même principe,
   *  nettement plus léger, pour les photos claires et lumineuses. `faint` :
   *  un simple voile noir à 5 %, le texte tient par son ombre portée. `home` :
   *  le voile du diaporama de l'accueil (dégradé vertical, plus dense en bas). */
  overlay?: 'soft' | 'strong' | 'light' | 'faint' | 'home';
  /** `tall` = 70 vh (défaut), `full` = toute la hauteur de la fenêtre. */
  height?: 'tall' | 'full';
  /** Éclaircit une photo naturellement sombre (luminosité +18 %). */
  bright?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={`relative flex ${
        height === 'full' ? 'min-h-svh' : 'min-h-[70vh]'
      } flex-col justify-end overflow-hidden bg-ink px-5 pb-16 pt-36 text-cream sm:px-8 lg:px-14`}
    >
      <div aria-hidden="true" className="absolute inset-0">
        {media ?? (
          <Image src={image} alt="" fill className={`object-cover ${bright ? 'brightness-[1.18] saturate-[1.06]' : ''}`} sizes="100vw" priority />
        )}
        {!media && video && (
          <video
            className="hero-video absolute inset-0 h-full w-full object-cover"
            src={video}
            poster={image}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        )}
        {overlay === 'home' ? (
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 via-[38%] to-black/75 to-[85%]" />
        ) : overlay === 'faint' ? (
          <div className="absolute inset-0 bg-black/5" />
        ) : overlay === 'light' ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/15 via-[40%] to-transparent to-[70%]" />
          </>
        ) : overlay === 'strong' ? (
          <>
            {/* Voile en diagonale, neutre : dense dans le coin bas-gauche, là où se
                pose le texte, puis effacement vers le coin haut-droit pour laisser
                voir le plan. */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/45 via-[40%] to-transparent to-[80%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />
          </>
        )}
      </div>
      <div className="hero-in relative mx-auto w-full max-w-[1360px]">{children}</div>
      {credit && (
        <p className="absolute bottom-3 right-5 m-0 hidden font-mono text-[11px] text-cream/70 sm:block">{credit}</p>
      )}
    </section>
  );
}
