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
      <section className="flex min-h-screen w-full items-center justify-center bg-[#FAF8F5] pt-20">
        <div className="mx-auto w-full max-w-3xl px-6 text-center sm:px-8">
          <h1 className="font-display text-5xl font-bold uppercase leading-tight tracking-tight text-[#2A1F14] sm:text-7xl lg:text-8xl">
            Molds That Bring Ideas to Life
          </h1>
          <Link
            href="/molds"
            className="mt-10 inline-block border border-[#3B2A1C] px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-[#3B2A1C] transition-colors hover:bg-[#3B2A1C] hover:text-white"
          >
            Shop Collection
          </Link>
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

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-10 text-center sm:px-8 sm:py-28">
        <h1
          className="font-display text-5xl font-bold uppercase leading-tight tracking-tight text-white sm:text-7xl"
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.55)' }}
        >
          Molds That Bring Ideas to Life
        </h1>
        <Link
          href="/molds"
          className="mt-10 inline-block border-2 border-white px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-[#2A1F14]"
        >
          Shop Collection
        </Link>
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
