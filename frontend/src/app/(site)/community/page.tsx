'use client';

import { useEffect, useState } from 'react';
import SmartImage from '@/components/SmartImage';
import VisitBeacon from '@/components/VisitBeacon';

interface CommunityImage {
  id: number;
  image_url: string;
  caption: string | null;
}

export default function CommunityPage() {
  const [images, setImages] = useState<CommunityImage[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/community-images')
      .then((r) => r.json())
      .then((d) => setImages(d.images ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-[#3B2A1C]">
      <VisitBeacon pageType="community" />

      {/* Header */}
      <div className="px-6 pb-10 pt-24 text-center sm:pt-28">
        <h1 className="font-display text-6xl font-bold uppercase tracking-tight text-white sm:text-8xl lg:text-9xl">
          Community
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm font-light tracking-wide text-white/60 sm:text-base">
          Made by our loyal customers
        </p>
      </div>

      {/* Slideshow */}
      {images.length === 0 ? (
        <div className="pb-20 text-center">
          <p className="text-white/40">Community images coming soon.</p>
        </div>
      ) : (
        <div className="pb-20">
          {/* Carousel track */}
          <div className="relative mx-auto max-w-sm overflow-hidden sm:max-w-md">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {images.map((img) => (
                <div key={img.id} className="w-full flex-shrink-0 px-4">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <SmartImage
                      src={img.image_url}
                      alt={img.caption ?? 'Community'}
                      fill
                      sizes="(max-width: 640px) 90vw, 448px"
                      className="object-cover"
                    />
                    {img.caption && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-1 py-1 pr-3 shadow-sm backdrop-blur-sm">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[9px] font-bold text-neutral-600">
                          {img.caption.replace('@', '').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[11px] font-medium text-neutral-800">
                          {img.caption.startsWith('@') ? img.caption : `@${img.caption}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/25 hover:bg-white/50'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
