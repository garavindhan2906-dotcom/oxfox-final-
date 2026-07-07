import type { Metadata } from 'next';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
import { HOMEPAGE_INTRO } from '@/lib/constants';

export const metadata: Metadata = { title: 'About Us | OXFOX' };

export default function AboutUsPage() {
  return (
    <div>
      <PageHero eyebrow="Our Story" heading="About OXFOX" />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <p className="leading-relaxed text-neutral-700">{HOMEPAGE_INTRO}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 leading-relaxed text-neutral-700">
            Every OXFOX silicone mold starts as a 3D-modeled digital design, refined with our creators before
            it&apos;s precision 3D-printed and hand-poured in premium, food-grade silicone. Whether you&apos;re a
            home baker, a candle studio, or a growing concrete decor brand, our molds are built to hold their
            shape, release cleanly, and last through repeated use.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-4 leading-relaxed text-neutral-700">
            We work with creators and brands across India, offering both a growing catalog of ready-made silicone
            molds and a fully custom design service for one-of-a-kind shapes.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
