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
    <section className="relative flex min-h-[60vh] w-full items-center overflow-hidden bg-brand sm:min-h-screen">
      {/* Sliding images */}
      {images.map((img, i) => (
        <div
          key={img.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <SmartImage src={img.image_url} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Text content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 text-left sm:px-8 sm:py-28">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white sm:text-5xl"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
            3D Design + Handcrafted Silicone Molds
          </h1>
          <p className="mt-4 hidden text-base text-white/90 sm:block sm:text-lg"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
            {subheading}
          </p>
          <Link href="/molds"
            className="mt-8 inline-block rounded-full border-2 border-white bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:bg-transparent hover:text-white">
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
