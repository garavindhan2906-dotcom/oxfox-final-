import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';
import { CUSTOM_ORDER_STEPS } from '@/lib/constants';

export default function CustomOrderSteps() {
  return (
    <section className="bg-neutral-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">How It Works</p>
          <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl">Custom Order Process</h2>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {CUSTOM_ORDER_STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.12} className="relative rounded-2xl border border-white/10 bg-white/5 p-8">
              <span className="text-5xl font-bold text-white/10">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 text-lg font-semibold uppercase tracking-wide text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{step.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-14 text-center">
          <Link
            href="/custom-order"
            className="inline-block rounded-full bg-brand px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-dark"
          >
            Start Your Custom Order
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
