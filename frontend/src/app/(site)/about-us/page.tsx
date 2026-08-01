import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'About Us | OXFOX' };

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <div className="relative flex min-h-[52vw] items-center overflow-hidden bg-[#2A1F14] px-5 pb-10 pt-24 sm:min-h-[340px] sm:px-10 sm:pt-28">
        <div className="relative z-10 max-w-xs sm:max-w-sm">
          <h1 className="font-display text-5xl font-bold uppercase leading-tight text-white sm:text-6xl">
            About OXFOX
          </h1>
          <p className="font-script mt-2 text-2xl text-white/80">Designed for Makers. Crafted with Precision.</p>
          <div className="mt-3 h-px w-12 bg-white/40" />
          <p className="mt-3 text-xs leading-relaxed text-white/60">
            Premium food-grade silicone molds designed in-house for chocolates, candles, resin, jars and décor.
          </p>
        </div>
      </div>

      {/* ── OUR STORY ── */}
      <section className="bg-white px-5 py-10 sm:px-8">
        <h2 className="mb-8 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Our Story</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {/* We Design First */}
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF8F5]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-[#2A1F14]">We Design First</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Every OXFOX mold begins as an original 3D design — not a copied product.
            </p>
            <p className="mt-3 text-xs font-semibold text-neutral-500">Each model is carefully engineered for:</p>
            <ul className="mt-2 space-y-1.5">
              {['Sharp details', 'Easy demolding', 'Long life', 'Professional results'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* We Build For Creators */}
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF8F5]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-[#2A1F14]">We Build For Creators</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Whether you&apos;re a hobbyist, home business or established brand, our molds are designed to help you create products you&apos;ll be proud to sell.
            </p>
            <p className="mt-3 text-xs font-semibold text-neutral-500">Perfect for:</p>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Chocolate\nMakers', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" /> },
                { label: 'Candle\nArtists', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 18v4M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6C9.5 8 8 10 8 12h8c0-2-1.5-4-4-6z" /></> },
                { label: 'Jesmonite &\nResin Creators', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5H8L9 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 8v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8" /></> },
                { label: 'Small\nBusinesses', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" /></> },
              ].map(({ label, icon }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF8F5]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
                  </div>
                  <p className="whitespace-pre-line text-[9px] font-medium leading-tight text-neutral-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PREMIUM MATERIALS ── */}
      <section className="bg-[#FAF8F5] px-5 py-8 sm:px-8">
        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Premium Materials</h2>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            {
              label: 'Food Grade\nSilicone',
              icon: <><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 5 14.5 5 9a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" /></>,
            },
            {
              label: 'Durable & Tear\nResistant',
              icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" /></>,
            },
            {
              label: 'Flexible\nDemolding',
              icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 12c0 2 .8 3.8 2 5.1M20 12c0 2-.8 3.8-2 5.1" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 17h6" /></>,
            },
            {
              label: 'Handmade\nQuality Check',
              icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" /></>,
            },
          ].map(({ label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 sm:p-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>{icon}</svg>
              <p className="whitespace-pre-line text-[9px] font-bold uppercase leading-tight tracking-wide text-neutral-700">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE OXFOX ── */}
      <section className="bg-white px-5 py-8 sm:px-8">
        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Why Choose OXFOX?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: 'Original\nDesigns', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" /> },
            { label: 'In-House 3D\nEngineering', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline strokeLinecap="round" strokeLinejoin="round" points="3.27 6.96 12 12.01 20.73 6.96" /><line strokeLinecap="round" strokeLinejoin="round" x1="12" y1="22.08" x2="12" y2="12" /></> },
            { label: 'Carefully\nPacked', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></> },
            { label: 'Pan India\nShipping', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M1 3h13v13H1zM14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></> },
            { label: 'Handmade in\nSmall Batches', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" /></> },
          ].map(({ label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-[#FAF8F5]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
              </div>
              <p className="max-w-[72px] whitespace-pre-line text-[10px] font-semibold leading-tight text-neutral-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OUR PROCESS ── */}
      <section className="bg-[#FAF8F5] px-5 py-8 sm:px-8">
        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Our Process</h2>
        <div className="flex items-start justify-between gap-1 overflow-x-auto">
          {[
            { step: 'Idea', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /> },
            { step: '3D Design', icon: <><rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" /></> },
            { step: 'High Precision\nPrinting', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 14h12v8H6z" /></> },
            { step: 'Silicone\nCasting', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5H8L9 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 8v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8" /></> },
            { step: 'Quality\nInspection', icon: <><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" /></> },
            { step: 'Packed\nWith Care', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v4M10 14h4" /></> },
            { step: 'Delivered', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M1 3h13v13H1zM14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></> },
          ].map(({ step, icon }, i, arr) => (
            <div key={step} className="flex flex-1 flex-col items-center gap-1.5 text-center">
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#3B2A1C]/30 bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
                {i < arr.length - 1 && (
                  <span className="absolute left-full top-1/2 h-px w-full -translate-y-1/2 bg-neutral-300" />
                )}
              </div>
              <p className="text-[8px] font-medium leading-tight text-neutral-400">{i + 1}</p>
              <p className="whitespace-pre-line text-[8px] leading-tight text-neutral-500">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="grid grid-cols-4 bg-[#2A1F14] divide-x divide-white/10">
        {[
          { value: '1000+', label: 'Happy Customers' },
          { value: '500+', label: 'Original Designs' },
          { value: 'Food Grade', label: 'Silicone' },
          { value: 'Made in', label: 'India 🇮🇳' },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center px-2 py-6 text-center">
            <p className="font-display text-sm font-bold text-white sm:text-lg">{value}</p>
            <p className="text-[8px] text-white/50 sm:text-[10px]">{label}</p>
          </div>
        ))}
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bg-white px-5 py-10 sm:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-neutral-500">
              We believe great products begin with great tools. Every OXFOX mold is thoughtfully designed and carefully handcrafted to help creators produce beautiful chocolates, candles and décor with confidence.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="font-display text-xl font-bold text-[#2A1F14]">Ready to Create<br />Something Beautiful?</p>
            <Link href="/molds" className="inline-block bg-[#2A1F14] px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-[#3B2A1C]">
              Shop Our Collection
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
