import Reveal from '@/components/motion/Reveal';
import { HOMEPAGE_INTRO } from '@/lib/constants';

export default function HeroIntro() {
  return (
    <section className="bg-[#FAF8F5] py-12 sm:py-20">
      <Reveal className="mx-auto max-w-2xl px-6 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2A1F14]">The OXFOX Standard</p>
        <p className="mx-auto mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">{HOMEPAGE_INTRO}</p>
      </Reveal>
    </section>
  );
}
