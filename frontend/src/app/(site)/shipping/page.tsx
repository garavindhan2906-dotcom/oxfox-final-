import type { Metadata } from 'next';
import Image from 'next/image';
import VisitBeacon from '@/components/VisitBeacon';

export const metadata: Metadata = {
  title: 'Shipping & Delivery | OXFOX Studio',
  description: 'Shipping zones, delivery timelines, and packaging details for OXFOX silicone molds across India.',
};

const faqs = [
  { q: 'Do you ship across India?', a: 'Yes! We ship to all states and cities across India through trusted courier partners.' },
  { q: 'When will my order ship?', a: 'Orders are dispatched within 2–3 business days of confirmation.' },
  { q: 'How are molds packed?', a: 'Every mold is bubble-wrapped and placed in a sturdy carton box with a thank-you sticker.' },
  { q: 'Can I track my order?', a: 'Yes, you will receive a tracking link via WhatsApp/email once your order is shipped.' },
];

const deliveryZones = [
  { zone: 'Tamil Nadu', days: '2 – 4 business days' },
  { zone: 'South India', days: '3 – 5 business days' },
  { zone: 'North & West India', days: '4 – 7 business days' },
  { zone: 'Remote Areas', days: '5 – 9 business days' },
];


export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <VisitBeacon pageType="shipping" />

      {/* Hero */}
      <div className="relative flex min-h-[44vw] items-center overflow-hidden px-5 pb-8 pt-24 sm:min-h-[280px] sm:px-8 sm:pt-28" style={{ backgroundImage: 'url(/ship.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="pointer-events-none absolute inset-0 bg-[#2A1F14]/55" />
        <div className="relative z-10 max-w-xs">
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Shipping &amp;<br />Delivery
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Carefully packed in the Nilgiris and delivered across India.
          </p>
        </div>
      </div>

      {/* 4-feature strip */}
      <div className="mx-4 grid grid-cols-4 divide-x divide-neutral-200 rounded-2xl border border-neutral-200 bg-white sm:mx-6">
        {[
          {
            icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M1 3h13v13H1zM14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>,
            title: 'Ships in\n2–3 Days',
            desc: 'Orders dispatched within 2–3 business days',
          },
          {
            icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3C8 7 6 10 6 12s2 5 6 9c4-4 6-7 6-9s-2-5-6-9Z" /></>,
            title: 'Pan India\nDelivery',
            desc: 'Delivered to all major cities and states',
          },
          {
            icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" /></>,
            title: 'Safe & Secure\nPackaging',
            desc: 'Every mold packed with extra care',
          },
          {
            icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" /></>,
            title: 'Premium\nQuality',
            desc: 'High quality molds, made to last',
          },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center px-2 py-5 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
              {icon}
            </svg>
            <p className="mt-2 whitespace-pre-line text-[10px] font-bold leading-tight text-neutral-800 sm:text-xs">{title}</p>
            <p className="mt-1 hidden text-[9px] leading-tight text-neutral-400 sm:block">{desc}</p>
          </div>
        ))}
      </div>

      {/* Estimated Delivery Time */}
      <div className="mx-4 mt-4 rounded-2xl bg-white p-5 sm:mx-6">
        <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-[0.15em] text-[#2A1F14]">Estimated Delivery Time</h2>
        <div className="space-y-3">
          {deliveryZones.map(({ zone, days }) => (
            <div key={zone} className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 5 14.5 5 9a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" />
                </svg>
                <span className="text-sm text-neutral-700">{zone}</span>
              </div>
              <span className="text-sm font-semibold text-[#2A1F14]">{days}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-4 mt-4 rounded-2xl bg-white p-5 sm:mx-6">
        <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-[0.15em] text-[#2A1F14]">Frequently Asked Questions</h2>
        <div className="space-y-0 divide-y divide-neutral-100">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-800">
                {q}
                <span className="ml-2 flex-shrink-0 text-neutral-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom banner */}
      <div className="mx-4 mb-10 mt-4 flex items-center gap-4 rounded-2xl bg-[#2A1F14] p-5 sm:mx-6">
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-white">Packed With Care,<br />Delivered With Love 🧡</h3>
          <p className="mt-2 text-xs leading-relaxed text-white/60">
            Every OXFOX mold is individually inspected, safely packed in protective bubble packaging and shipped in a sturdy carton to ensure it reaches you in perfect condition.
          </p>
          <p className="mt-3 text-xs italic text-white/40">Thank you for supporting handmade 🧡</p>
        </div>
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
          <Image src="/ship.jpeg" alt="Shipping" width={96} height={96} className="h-full w-full object-cover opacity-80" />
        </div>
      </div>
    </div>
  );
}
