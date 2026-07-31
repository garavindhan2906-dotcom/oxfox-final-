import type { Metadata } from 'next';
import FaqAccordion from '@/components/faq/FaqAccordion';
import VisitBeacon from '@/components/VisitBeacon';
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
    <div className="min-h-screen bg-white">
      <VisitBeacon pageType="faq" />
      <div className="px-5 pb-6 pt-24 sm:px-8 sm:pt-28">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Need Help?</p>
        <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-tight text-[#2A1F14] sm:text-5xl">
          Frequently Asked<br />Questions
        </h1>
      </div>
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        {items.length > 0 ? (
          <FaqAccordion items={items} />
        ) : (
          <p className="text-sm text-neutral-500">FAQs are coming soon.</p>
        )}
      </div>
    </div>
  );
}
