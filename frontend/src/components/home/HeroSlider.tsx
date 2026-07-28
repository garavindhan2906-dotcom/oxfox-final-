'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SmartImage from '@/components/SmartImage';

interface HeroImage {
  id: number;
  image_url: string;
}

export default function HeroSlider({ images, subheading }: { images: HeroImage[]; subheading: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  /* ── No images: warm cream hero (matches reference design) ── */
  if (images.length === 0) {
    return (
      <section className="flex min-h-[60vh] w-full items-center bg-[#FAF8F5] pt-24 sm:min-h-screen sm:pt-32">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
          <div className="max-w-2xl text-center sm:text-left">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#2A1F14] sm:text-6xl lg:text-7xl">
              Molds That Bring Ideas to Life
            </h1>
            <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
              Premium food grade silicone molds for candles, chocolates, jars, décor and more.
            </p>
            <Link
              href="/molds"
              className="mt-8 inline-block bg-[#3B2A1C] px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#2A1F14]"
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
    <section className="relative flex min-h-[60vh] w-full items-center overflow-hidden bg-[#FAF8F5] sm:min-h-screen">
      {images.map((img, i) => (
        <div
          key={img.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <SmartImage src={img.image_url} alt="" fill fetchPriority={i === 0 ? 'high' : 'auto'} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A1F14]/75 via-[#2A1F14]/35 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 sm:py-28">
        <div className="max-w-xl">
          <h1
            className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
          >
            3D Design + Handcrafted Silicone Molds
          </h1>
          <p
            className="mt-4 hidden text-base text-white/90 sm:block sm:text-lg"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
          >
            {subheading}
          </p>
          <Link
            href="/molds"
            className="mt-8 inline-block border-2 border-white bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wide text-[#2A1F14] transition-colors hover:bg-transparent hover:text-white"
          >
            Shop Collection
          </Link>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
