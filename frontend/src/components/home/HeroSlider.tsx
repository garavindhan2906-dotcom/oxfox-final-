'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SmartImage from '@/components/SmartImage';

interface HeroImage {
  id: number;
  image_url: string;
}

export default function HeroSlider({ images }: { images: HeroImage[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  /* ── No images: warm cream hero ── */
  if (images.length === 0) {
    return (
      <section className="flex min-h-screen w-full items-center bg-[#EDE8E2] pt-20">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
          <div className="max-w-sm sm:max-w-md">
            <h1 className="font-display text-5xl font-bold uppercase leading-tight tracking-tight text-[#2A1F14] sm:text-6xl lg:text-7xl">
              Molds That Bring Ideas to Life
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              Premium food grade silicone molds for candles, chocolates, jars, décor and more.
            </p>
            <Link
              href="/molds"
              className="mt-6 inline-block bg-[#3B2A1C] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#2A1F14]"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ── With images: sliding hero ── */
  return (
    <section className="relative flex min-h-[68vh] w-full items-center overflow-hidden bg-[#EDE8E2] sm:min-h-screen">
      {images.map((img, i) => (
        <div
          key={img.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <SmartImage src={img.image_url} alt="" fill fetchPriority={i === 0 ? 'high' : 'auto'} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#EDE8E2]/80 via-[#EDE8E2]/10 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 sm:py-28">
        <div className="max-w-[58%] sm:max-w-md">
          <h1
            className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-[#2A1F14] sm:text-6xl"
          >
            Molds That Bring Ideas to Life
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#2A1F14]/70 sm:text-base">
            Premium food grade silicone molds for candles, chocolates, jars, décor and more.
          </p>
          <Link
            href="/molds"
            className="mt-6 inline-block bg-[#3B2A1C] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#2A1F14]"
          >
            Shop Collection
          </Link>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-6 z-10 flex gap-2 sm:left-8">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-[#2A1F14]' : 'w-2 bg-[#2A1F14]/30'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
