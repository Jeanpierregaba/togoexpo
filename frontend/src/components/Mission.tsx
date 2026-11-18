import Image from 'next/image';
import { getDictionary } from '@/i18n/dict';
import { lz, type Lang } from '@/i18n/lang';
import { Reveal } from './Reveal';
import { SectionKicker } from './SectionKicker';

export function Mission({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  return (
    <section id="mission" aria-labelledby="mission-title" className="bg-cream px-5 pb-[100px] text-forest sm:px-8 lg:px-14">
      <div className="mx-auto grid max-w-[1360px] gap-10 border-t border-[#D3D6C8] pt-10 lg:grid-cols-2 lg:gap-24 lg:pt-20">
        {/* Colonne gauche : l'image occupe la hauteur restante (flex-1) pour que
            les deux colonnes se terminent exactement au même niveau. */}
        <div className="flex flex-col">
          <Reveal>
            <SectionKicker className="mb-6">{t.mission.kicker}</SectionKicker>
          </Reveal>
          <Reveal>
            <h2 id="mission-title" className="m-0 font-display text-[clamp(34px,8.6vw,57px)] font-semibold leading-[0.95] tracking-[-0.035em]">
              {t.mission.h1a}<span className="text-blood">{t.mission.h1b}</span>
            </h2>
          </Reveal>
          <Reveal className="mt-10 flex min-h-[300px] flex-1 sm:min-h-[380px]">
            <div className="relative w-full overflow-hidden rounded-3xl">
              <Image src="/design/comite-delegation.jpg" alt={t.mission.imgAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </Reveal>
        </div>
        <div className="flex flex-col justify-between gap-12">
          <Reveal className="flex flex-col gap-5 text-[clamp(17px,1.35vw,20px)] leading-relaxed text-[#25372E]">
            <p className="m-0">
              {t.mission.lead}
              <strong className="text-forest">
                {t.mission.strong}
              </strong>
              {t.mission.tail}
            </p>
            <p className="m-0">
              {t.mission.p2}
            </p>
            <a href={lz('/a-propos#comite', lang)} className="inline-flex gap-2 self-start border-b-2 border-pine pb-0.5 font-semibold text-pine transition-colors hover:text-forest">
              {t.mission.link}
            </a>
          </Reveal>
          <ol className="m-0 flex list-none flex-col p-0">
            {t.mission.pillars.map((p, i) => (
              <li key={p.n} className="border-t border-[#D3D6C8]">
                <Reveal delay={i * 80} className="grid grid-cols-[56px_1fr] gap-4 py-6">
                  <span className="pt-1.5 font-mono text-[13px] text-pine">{p.n}</span>
                  <div>
                    <h3 className="mb-2 font-display text-2xl font-semibold tracking-tight text-blood">{p.t}</h3>
                    <p className="m-0 leading-relaxed text-[#42574C]">{p.d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
