'use client';

import { useState } from 'react';
import SmartImage from '@/components/SmartImage';
import type { ProductImage } from '@/types';

export default function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div>
      <div className="media-3-4 relative rounded-xl">
        {active ? (
          <SmartImage
            src={active.file_path}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">No image available</div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md ring-1 ring-neutral-200 transition hover:bg-brand hover:text-white text-sm font-bold"
            >
              ←
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md ring-1 ring-neutral-200 transition hover:bg-brand hover:text-white text-sm font-bold"
            >
              →
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`media-3-4 w-16 rounded-md border-2 ${
                i === activeIndex ? 'border-brand' : 'border-transparent'
              }`}
            >
              <SmartImage src={img.file_path} alt={`${productName} ${i + 1}`} fill sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
