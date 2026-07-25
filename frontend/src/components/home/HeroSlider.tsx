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

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-brand">
      {/* Sliding images */}
      {images.map((img, i) => (
        <div
          key={img.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <SmartImage src={img.image_url} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Text content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 text-left sm:px-8 sm:py-28">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-white sm:text-6xl"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
            OXFOX
          </h1>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.35em] text-white/80 sm:text-base"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
            3D Design + Handcrafted Silicone Molds
          </p>
          <p className="mt-4 text-base text-white/90 sm:text-lg"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
            {subheading}
          </p>
          <Link href="/molds"
            className="mt-8 inline-block rounded-full bg-brand px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark">
            Shop Silicone Molds
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
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
