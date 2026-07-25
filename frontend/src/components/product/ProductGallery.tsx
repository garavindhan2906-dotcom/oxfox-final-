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
              className="absolute left-0 top-1/2 -translate-y-1/2 flex h-12 w-10 items-center justify-center rounded-r-xl bg-black/30 backdrop-blur-sm text-white text-2xl transition hover:bg-brand"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-0 top-1/2 -translate-y-1/2 flex h-12 w-10 items-center justify-center rounded-l-xl bg-black/30 backdrop-blur-sm text-white text-2xl transition hover:bg-brand"
            >
              ›
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
