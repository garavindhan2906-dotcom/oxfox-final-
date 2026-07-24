'use client';

import SmartImage from '@/components/SmartImage';

interface ShippingImage {
  id: number;
  image_url: string;
}

export default function ShippingImageSlider({ images }: { images: ShippingImage[] }) {
  if (images.length === 0) return null;

  // Duplicate for seamless infinite loop
  const track = [...images, ...images, ...images];

  return (
    <div className="mt-12 overflow-hidden rounded-2xl">
      <style>{`
        @keyframes shipping-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .shipping-track {
          display: flex;
          gap: 12px;
          animation: shipping-scroll ${Math.max(images.length * 3, 10)}s linear infinite;
          width: max-content;
        }
        .shipping-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="shipping-track">
        {track.map((img, i) => (
          <div
            key={`${img.id}-${i}`}
            className="relative h-48 w-64 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm sm:h-56 sm:w-72"
          >
            <SmartImage
              src={img.image_url}
              alt={`Shipping info`}
              fill
              sizes="288px"
              className="object-contain p-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
