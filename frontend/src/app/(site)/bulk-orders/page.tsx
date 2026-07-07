import type { Metadata } from 'next';
import BulkOrderForm from '@/components/forms/BulkOrderForm';
import VisitBeacon from '@/components/VisitBeacon';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';

export const metadata: Metadata = { title: 'Bulk Orders | OXFOX' };

export default function BulkOrdersPage() {
  return (
    <div>
      <VisitBeacon pageType="bulk_orders" />
      <PageHero
        eyebrow="For Brands & Studios"
        heading="Bulk Orders"
        subheading="Sourcing silicone molds at scale? Let's talk pricing."
      />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-neutral-600">
            Share your requirements below and our team will follow up with bulk pricing.
          </p>
          <div className="mt-6">
            <BulkOrderForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
