'use client';

import { useState } from 'react';
import SmartImage from '@/components/SmartImage';

interface ShippingImage {
  id: number;
  image_url: string;
}

export default function ShippingImageSlider({ images }: { images: ShippingImage[] }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="relative mt-12 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Image */}
      <div className="relative w-full" style={{ minHeight: '320px' }}>
        <SmartImage
          src={images[current].image_url}
          alt={`Shipping info ${current + 1}`}
          width={1200}
          height={700}
          sizes="(max-width: 768px) 100vw, 900px"
          className="h-auto w-full object-contain"
        />
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md ring-1 ring-neutral-200 transition hover:bg-brand hover:text-white"
          >
            ←
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md ring-1 ring-neutral-200 transition hover:bg-brand hover:text-white"
          >
            →
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 py-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'w-6 bg-brand' : 'w-2 bg-neutral-300'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute right-4 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
