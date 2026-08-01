import type { Metadata } from 'next';
import Link from 'next/link';
import SmartImage from '@/components/SmartImage';
import { apiFetch } from '@/lib/api';

export const metadata: Metadata = { title: 'About Us | OXFOX' };

async function getCommunityImages() {
  try {
    const { images } = await apiFetch<{ images: { id: number; image_url: string; caption: string | null }[] }>('/api/community-images?limit=4');
    return images.slice(0, 4);
  } catch {
    return [];
  }
}

export default async function AboutUsPage() {
  const photos = await getCommunityImages();

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <div
        className="relative flex min-h-[58vw] items-center overflow-hidden px-5 pb-10 pt-24 sm:min-h-[360px] sm:px-10 sm:pt-28"
        style={{ backgroundImage: 'url(/about.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[#2A1F14]/62" />
        <div className="relative z-10 max-w-[58%] sm:max-w-sm">
          <h1 className="font-display text-5xl font-bold uppercase leading-tight text-white sm:text-6xl">
            About OXFOX
          </h1>
          <p className="font-script mt-1 text-2xl text-white/80 sm:text-3xl">
            Designed for Makers. Crafted with Precision.
          </p>
          <div className="mt-3 h-px w-12 bg-white/40" />
          <p className="mt-3 text-xs leading-relaxed text-white/60 sm:text-sm">
            Premium food-grade silicone molds designed in-house for chocolates, candles, resin, jars and décor.
          </p>
        </div>
      </div>

      {/* ── OUR STORY ── */}
      <section className="bg-white px-5 py-10 sm:px-8 sm:py-14">
        <h2 className="mb-1 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Our Story</h2>
        <div className="mx-auto mb-6 mt-2 h-px w-8 bg-neutral-300" />
        <div className="grid gap-10 sm:grid-cols-2">

          {/* We Design First */}
          <div className="flex gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#F5EDE0]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 7l-2 3h4l-2 3" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#2A1F14]">We Design First</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                Every OXFOX mold begins as an original 3D design — not a copied product.
              </p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Each model is carefully engineered for:</p>
              <ul className="mt-2 space-y-1.5">
                {['Sharp details', 'Easy demolding', 'Long life', 'Professional results'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* We Build For Creators */}
          <div className="flex gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#F5EDE0]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21c2-3 5-4 5-4s3 1 5 4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#2A1F14]">We Build For Creators</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                Whether you&apos;re a hobbyist, home business or established brand, our molds are designed to help you create products you&apos;ll be proud to sell.
              </p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Perfect for:</p>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                {[
                  {
                    label: 'Chocolate\nMakers',
                    icon: <><rect x="3" y="4" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 16h18M9 4v6M15 4v6" /></>,
                  },
                  {
                    label: 'Candle\nArtists',
                    icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 2c-1 1.5-2 3.2-2 4.5 0 1.1.9 2 2 2s2-.9 2-2C14 5.2 13 3.5 12 2z" /><rect x="8" y="8.5" width="8" height="11" rx="1" strokeLinecap="round" strokeLinejoin="round" /></>,
                  },
                  {
                    label: 'Jesmonite &\nResin Creators',
                    icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M10 3h4" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 3C9 7 6 10 6 14a6 6 0 0 0 12 0c0-4-3-7-4-11H10z" /></>,
                  },
                  {
                    label: 'Small\nBusinesses',
                    icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2" /></>,
                  },
                ].map(({ label, icon }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5EDE0]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>{icon}</svg>
                    </div>
                    <p className="whitespace-pre-line text-[9px] leading-tight text-neutral-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PREMIUM MATERIALS ── */}
      <section className="bg-[#F7F3EE] px-5 py-10 sm:px-8">
        <h2 className="mb-1 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">Premium Materials</h2>
        <div className="mx-auto mb-6 mt-2 h-px w-8 bg-neutral-300" />
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            {
              label: 'Food Grade\nSilicone',
              icon: <><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 15c0-2.5 1.5-5 4-7 2.5 2 4 4.5 4 7a4 4 0 0 1-8 0z" /></>,
            },
            {
              label: 'Durable & Tear\nResistant',
              icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" /></>,
            },
            {
              label: 'Flexible\nDemolding',
              icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M7 9c0-2.8 2.2-5 5-5s5 2.2 5 5v2H7V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 11h14v2a7 7 0 0 1-14 0v-2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 20h6" /></>,
            },
            {
              label: 'Handmade\nQuality Check',
              icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 13c1 2 5 4 5 4" /></>,
            },
          ].map(({ label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-3 rounded-2xl bg-white px-2 py-5 sm:px-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5EDE0]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>{icon}</svg>
              </div>
              <p className="whitespace-pre-line text-[9px] font-bold uppercase leading-tight tracking-wide text-neutral-700 sm:text-[10px]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE OXFOX ── */}
      <section className="bg-white px-5 py-10 sm:px-8">
        <h2 className="mb-1 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">Why Choose OXFOX?</h2>
        <div className="mx-auto mb-6 mt-2 h-px w-8 bg-neutral-300" />
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {[
            {
              label: 'Original\nDesigns',
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />,
            },
            {
              label: 'In-House 3D\nEngineering',
              icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline strokeLinecap="round" strokeLinejoin="round" points="3.27 6.96 12 12.01 20.73 6.96" /><line strokeLinecap="round" strokeLinejoin="round" x1="12" y1="22.08" x2="12" y2="12" /></>,
            },
            {
              label: 'Carefully\nPacked',
              icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>,
            },
            {
              label: 'Pan India\nShipping',
              icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M1 3h13v13H1zM14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>,
            },
            {
              label: 'Handmade in\nSmall Batches',
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />,
            },
          ].map(({ label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 text-center sm:p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3B2A1C] sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>{icon}</svg>
              <p className="whitespace-pre-line text-[8px] font-bold uppercase leading-tight tracking-wide text-neutral-700 sm:text-[9px]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OUR PROCESS ── */}
      <section className="bg-[#F7F3EE] px-5 py-10 sm:px-8">
        <h2 className="mb-1 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">Our Process</h2>
        <div className="mx-auto mb-6 mt-2 h-px w-8 bg-neutral-300" />
        <div className="flex items-start justify-between">
          {[
            { num: 1, step: 'Idea', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /> },
            { num: 2, step: '3D Design', icon: <><rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" /></> },
            { num: 3, step: 'High Precision\nPrinting', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" rx="1" strokeLinecap="round" strokeLinejoin="round" /></> },
            { num: 4, step: 'Silicone\nCasting', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5H8L9 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 8v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8" /></> },
            { num: 5, step: 'Quality\nInspection', icon: <><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" /></> },
            { num: 6, step: 'Packed\nWith Care', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v4M10 14h4" /></> },
            { num: 7, step: 'Delivered', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M1 3h13v13H1zM14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></> },
          ].map(({ num, step, icon }, i, arr) => (
            <div key={step} className="relative flex flex-1 flex-col items-center gap-1 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9B49A] bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
              </div>
              {i < arr.length - 1 && (
                <span className="absolute left-[calc(50%+20px)] top-[18px] text-[10px] text-neutral-300" style={{ width: 'calc(100% - 40px)', textAlign: 'center' }}>→</span>
              )}
              <p className="text-[8px] font-bold text-[#3B2A1C]">{num}</p>
              <p className="whitespace-pre-line text-[7.5px] leading-tight text-neutral-400">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREATED BY MAKERS ── */}
      {photos.length > 0 && (
        <section className="bg-white px-5 py-10 sm:px-8">
          <h2 className="mb-1 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">Created by Makers, Loved by Makers</h2>
          <div className="mx-auto mb-6 mt-2 h-px w-8 bg-neutral-300" />
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {photos.map((img) => (
              <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
                <SmartImage src={img.image_url} alt={img.caption ?? 'Maker creation'} fill sizes="25vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── STATS BAR ── */}
      <section className="grid grid-cols-4 divide-x divide-white/10 bg-[#2A1F14]">
        {[
          {
            value: '1000+', label: 'Happy Customers',
            icon: <><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" /></>,
          },
          {
            value: '500+', label: 'Original Designs',
            icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" /></>,
          },
          {
            value: 'Food Grade', label: 'Silicone',
            icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" /></>,
          },
          {
            value: 'Made in', label: 'India 🇮🇳',
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />,
          },
        ].map(({ value, label, icon }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 px-2 py-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>{icon}</svg>
            <p className="font-display text-sm font-bold leading-tight text-white sm:text-base">{value}</p>
            <p className="text-[8px] leading-tight text-white/50 sm:text-[10px]">{label}</p>
          </div>
        ))}
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bg-white px-5 py-10 sm:px-8">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            {/* Botanical SVG */}
            <svg className="h-16 w-12 flex-shrink-0 text-[#C9B49A]" viewBox="0 0 50 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 75 C25 50 20 35 10 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M25 60 C20 55 12 52 8 45" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <ellipse cx="6" cy="43" rx="5" ry="9" transform="rotate(-30 6 43)" fill="currentColor" opacity="0.5"/>
              <path d="M25 45 C30 40 38 38 42 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <ellipse cx="44" cy="28" rx="5" ry="9" transform="rotate(30 44 28)" fill="currentColor" opacity="0.5"/>
              <path d="M25 30 C22 25 16 22 14 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <ellipse cx="13" cy="13" rx="4" ry="7" transform="rotate(-20 13 13)" fill="currentColor" opacity="0.45"/>
              <circle cx="25" cy="8" r="3" fill="currentColor" opacity="0.4"/>
            </svg>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
              We believe great products begin with great tools. Every OXFOX mold is thoughtfully designed and carefully handcrafted to help creators produce beautiful chocolates, candles and décor with confidence.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end sm:text-right">
            <p className="font-display text-xl font-bold leading-tight text-[#2A1F14]">Ready to Create<br />Something Beautiful?</p>
            <Link href="/molds" className="inline-block bg-[#2A1F14] px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-[#3B2A1C]">
              Shop Our Collection
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
