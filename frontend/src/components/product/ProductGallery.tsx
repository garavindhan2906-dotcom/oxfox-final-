'use client';

import { useState } from 'react';
import SmartImage from '@/components/SmartImage';
import type { ProductImage } from '@/types';

export default function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div>
      <div className="media-3-4 rounded-xl">
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
