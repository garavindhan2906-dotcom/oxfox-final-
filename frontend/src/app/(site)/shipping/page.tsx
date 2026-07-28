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
              <div className="mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M1 3h13v13H1z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-neutral-800">Pan-India Delivery</h2>
              <p className="mt-2 text-sm text-neutral-500">
                We ship to all major cities and states via trusted courier partners. Detailed shipping zones and rates coming soon.
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.15} className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <div className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="12.01" strokeWidth={2.5} />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h4l2 2h6l2-2h4" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-neutral-900">Processing Time</h3>
            <p className="mt-2 text-sm text-neutral-500">Orders dispatched within 2–3 business days</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <div className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M1 3h13v13H1z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-neutral-900">Pan-India Shipping</h3>
            <p className="mt-2 text-sm text-neutral-500">Delivered to all major cities and states</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <div className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-neutral-900">Safe Packaging</h3>
            <p className="mt-2 text-sm text-neutral-500">Every mold packed securely to prevent damage</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
