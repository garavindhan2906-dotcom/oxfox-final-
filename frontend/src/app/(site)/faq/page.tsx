import type { Metadata } from 'next';
import FaqAccordion from '@/components/faq/FaqAccordion';
import VisitBeacon from '@/components/VisitBeacon';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
import { apiFetch } from '@/lib/api';
import type { FaqItem } from '@/types';

export const metadata: Metadata = { title: 'FAQ | OXFOX' };

async function getFaqItems(): Promise<FaqItem[]> {
  try {
    const { items } = await apiFetch<{ items: FaqItem[] }>('/api/faq');
    return items;
  } catch {
    return [];
  }
}

export default async function FaqPage() {
  const items = await getFaqItems();

  return (
    <div>
      <VisitBeacon pageType="faq" />
      <PageHero eyebrow="Need Help?" heading="Frequently Asked Questions" />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          {items.length > 0 ? (
            <FaqAccordion items={items} />
          ) : (
            <p className="text-sm text-neutral-500">FAQs are coming soon.</p>
          )}
        </Reveal>
      </div>
    </div>
  );
}
