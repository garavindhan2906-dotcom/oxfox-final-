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
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Made with Oxfox <span className="text-pink-400">♥</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm font-light tracking-wide text-white/60 sm:text-base">
          Real creations by our amazing customers.
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
                  </div>
                  {img.caption && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white">
                        {img.caption.replace('@', '').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white/90">
                        {img.caption.startsWith('@') ? img.caption : `@${img.caption}`}
                      </span>
                    </div>
                  )}
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
