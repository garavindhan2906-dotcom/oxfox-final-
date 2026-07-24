import type { Metadata } from 'next';
import VisitBeacon from '@/components/VisitBeacon';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
import ShippingImageSlider from '@/components/shipping/ShippingImageSlider';
import { apiFetch } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Shipping & Delivery | OXFOX Studio',
  description: 'Shipping zones, delivery timelines, and rates for OXFOX silicone molds across India.',
};

interface ShippingInfo {
  id: number;
  title: string | null;
  description: string | null;
}

interface ShippingImage {
  id: number;
  image_url: string;
}

async function getShippingData(): Promise<{ info: ShippingInfo | null; images: ShippingImage[] }> {
  try {
    const { shipping, images } = await apiFetch<{ shipping: ShippingInfo | null; images: ShippingImage[] }>('/api/shipping');
    return { info: shipping, images: images ?? [] };
  } catch {
    return { info: null, images: [] };
  }
}

export default async function ShippingPage() {
  const { info, images } = await getShippingData();

  const heading = info?.title || 'Shipping & Delivery';
  const description = info?.description || 'We deliver premium silicone molds across India. Orders are carefully packed and dispatched within 2–3 business days.';

  return (
    <div>
      <VisitBeacon pageType="shipping" />
      <PageHero eyebrow="Delivery Info" heading={heading} />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-base leading-relaxed text-neutral-600 sm:text-lg">{description}</p>
        </Reveal>

        {images.length > 0 ? (
          <Reveal delay={0.1}>
            <ShippingImageSlider images={images} />
          </Reveal>
        ) : (
          <Reveal delay={0.1} className="mt-12">
            <div className="rounded-2xl bg-neutral-50 px-8 py-12 text-center">
              <div className="mb-4 text-5xl">🚚</div>
              <h2 className="text-lg font-bold text-neutral-800">Pan-India Delivery</h2>
              <p className="mt-2 text-sm text-neutral-500">
                We ship to all major cities and states via trusted courier partners. Detailed shipping zones and rates coming soon.
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.15} className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
            <div className="mb-2 text-3xl">📦</div>
            <h3 className="font-semibold text-neutral-900">Processing Time</h3>
            <p className="mt-1 text-sm text-neutral-500">Orders dispatched within 2–3 business days</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
            <div className="mb-2 text-3xl">🇮🇳</div>
            <h3 className="font-semibold text-neutral-900">Pan-India Shipping</h3>
            <p className="mt-1 text-sm text-neutral-500">Delivered to all major cities and states</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
            <div className="mb-2 text-3xl">🔒</div>
            <h3 className="font-semibold text-neutral-900">Safe Packaging</h3>
            <p className="mt-1 text-sm text-neutral-500">Every mold packed securely to prevent damage</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
