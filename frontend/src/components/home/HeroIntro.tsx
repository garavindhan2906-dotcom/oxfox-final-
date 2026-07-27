import Reveal from '@/components/motion/Reveal';
import { HOMEPAGE_INTRO } from '@/lib/constants';

export default function HeroIntro() {
  return (
    <section className="bg-white py-10 sm:py-20">
      <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">The OXFOX Standard</p>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-neutral-700">{HOMEPAGE_INTRO}</p>
      </Reveal>
    </section>
  );
}
