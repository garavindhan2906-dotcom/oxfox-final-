import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'About Us | OXFOX' };

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* Hero */}
      <div className="flex items-center justify-between bg-[#2A1F14] px-5 pb-8 pt-24 sm:px-8 sm:pt-28">
        <div className="max-w-xs">
          <h1 className="font-display text-4xl font-bold uppercase leading-tight text-white sm:text-5xl">
            About OXFOX
          </h1>
          <p className="mt-2 text-sm font-medium text-white/70">Designed for Makers. Crafted with Precision.</p>
          <p className="mt-3 text-xs leading-relaxed text-white/50">
            Premium food-grade silicone molds designed and made in the Nilgiris for chocolates, candles, resins, jars and décor.
          </p>
        </div>
        {/* Image placeholder */}
        <div className="h-36 w-36 flex-shrink-0 overflow-hidden rounded-2xl bg-white/10 sm:h-44 sm:w-44">
          <div className="flex h-full w-full items-center justify-center text-xs text-white/20">Product Image</div>
        </div>
      </div>

      {/* OUR STORY */}
      <section className="bg-white px-5 py-10 sm:px-8">
        <h2 className="mb-8 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Our Story</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Design First */}
          <div>
            <h3 className="font-display text-lg font-bold text-[#2A1F14]">We Design First</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Every OXFOX mold begins as an original 3D design on a rigorous process.
            </p>
            <ul className="mt-4 space-y-2">
              {['Sharp detail', 'Easy demolding', 'Long life', 'Professional results'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Build for Creators */}
          <div>
            <h3 className="font-display text-lg font-bold text-[#2A1F14]">We Build For Creators</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Whether you&apos;re a hobbyist, home baker, or professional brand, our molds help you create and share products worth being proud of.
            </p>
            <div className="mt-4 grid grid-cols-4 gap-3 text-center">
              {[
                { label: 'Chocolatiers', icon: <rect x="3" y="8" width="18" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" /> },
                { label: 'Artists', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 6 5 9 5 13a7 7 0 0 0 14 0c0-4-3-7-7-11Z" /> },
                { label: 'Resin Creators', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5H8L9 3ZM8 8v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8" /> },
                { label: 'Businesses', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" /></> },
              ].map(({ label, icon }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF8F5]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
                  </div>
                  <p className="text-[9px] font-medium text-neutral-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM MATERIALS */}
      <section className="bg-[#FAF8F5] px-5 py-8 sm:px-8">
        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Premium Materials</h2>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { label: 'Food Grade\nSilicone', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 6 5 9 5 13a7 7 0 0 0 14 0c0-4-3-7-7-11Z" /> },
            { label: 'Durable & Tear\nResistant', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
            { label: 'Flexible\nDemolding', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M7 16.5A4.5 4.5 0 0 1 12 12v0a4.5 4.5 0 0 1 4.5 4.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12V3" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4 4 4" /></> },
            { label: 'Handmade\nQuality Choice', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" /></> },
          ].map(({ label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>{icon}</svg>
              <p className="whitespace-pre-line text-[9px] font-bold uppercase leading-tight tracking-wide text-neutral-700">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE OXFOX */}
      <section className="bg-white px-5 py-8 sm:px-8">
        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Why Choose OXFOX?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: 'Original Designs', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /> },
            { label: 'In-House 3D Engineering', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></> },
            { label: 'Carefully Packed', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></> },
            { label: 'Pan India Shipping', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M1 3h13v13H1zM14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></> },
            { label: 'Handmade in Small Batches', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M18 11V6l-2-2H8L6 6v5" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 11c0 3.31 2.69 6 6 6s6-2.69 6-6" /></> },
          ].map(({ label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-[#FAF8F5]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
              </div>
              <p className="max-w-[72px] text-[10px] font-semibold leading-tight text-neutral-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="bg-[#FAF8F5] px-5 py-8 sm:px-8">
        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Our Process</h2>
        <div className="relative flex items-start justify-between gap-1 overflow-x-auto">
          {['Idea', '3D Design', 'High Precision Printing', 'Silicone Casting', 'Quality Inspection', 'Packed With Care', 'Delivered'].map((step, i, arr) => (
            <div key={step} className="flex flex-1 flex-col items-center gap-1.5 text-center">
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#3B2A1C] bg-white text-xs font-bold text-[#3B2A1C]">
                {i + 1}
                {i < arr.length - 1 && (
                  <span className="absolute left-full top-1/2 h-px w-full -translate-y-1/2 bg-neutral-300" />
                )}
              </div>
              <p className="text-[9px] leading-tight text-neutral-500">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CREATED BY MAKERS */}
      <section className="bg-white px-5 py-8 sm:px-8">
        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Created by Makers, Loved by Makers</h2>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`overflow-hidden rounded-xl bg-neutral-100 ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}>
              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-300">Photo</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BAR */}
      <section className="grid grid-cols-4 bg-[#2A1F14] divide-x divide-white/10">
        {[
          { value: '1000+', label: 'Happy Customers' },
          { value: '500+', label: 'Original Designs' },
          { value: 'Food Grade', label: 'Silicone' },
          { value: 'Made in', label: 'India 🇮🇳' },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center px-2 py-6 text-center">
            <p className="font-display text-lg font-bold text-white sm:text-xl">{value}</p>
            <p className="text-[9px] text-white/50 sm:text-[10px]">{label}</p>
          </div>
        ))}
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#FAF8F5] px-5 py-10 sm:px-8">
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
