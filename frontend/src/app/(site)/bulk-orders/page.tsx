import type { Metadata } from 'next';
import BulkOrderForm from '@/components/forms/BulkOrderForm';
import VisitBeacon from '@/components/VisitBeacon';

export const metadata: Metadata = { title: 'Bulk Orders | OXFOX' };

export default function BulkOrdersPage() {
  return (
    <div className="min-h-screen bg-white">
      <VisitBeacon pageType="bulk_orders" />
      <div className="px-5 pb-6 pt-24 sm:px-8 sm:pt-28">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">For Brands &amp; Studios</p>
        <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-tight text-[#2A1F14] sm:text-5xl">
          Bulk Orders
        </h1>
        <p className="mt-2 text-sm text-neutral-500">Sourcing silicone molds at scale? Let&apos;s talk pricing.</p>
      </div>
      <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-neutral-600">
          Share your requirements below and our team will follow up with bulk pricing.
        </p>
        <div className="mt-6">
          <BulkOrderForm />
        </div>
      </div>
    </div>
  );
}
