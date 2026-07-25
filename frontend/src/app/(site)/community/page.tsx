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

  useEffect(() => {
    fetch('/api/community-images')
      .then((r) => r.json())
      .then((d) => setImages(d.images ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-brand">
      <VisitBeacon pageType="community" />

      {/* Header */}
      <div className="px-6 pt-16 pb-8 text-center sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Made By OXFOX</p>
        <h1 className="mt-3 text-5xl font-bold uppercase tracking-tight text-white sm:text-7xl">Community</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
          Real silicone molds designed and crafted by OXFOX Studio for creators and brands across India.
        </p>
      </div>

      {/* Masonry photo grid */}
      {images.length === 0 ? (
        <div className="px-6 pb-20 text-center">
          <p className="text-white/60">Community images coming soon.</p>
        </div>
      ) : (
        <div className="px-4 pb-20 sm:px-6 lg:px-8">
          <div
            style={{
              columns: 'auto',
              columnWidth: '180px',
              columnGap: '12px',
            }}
          >
            {images.map((img) => (
              <div
                key={img.id}
                className="mb-3 break-inside-avoid overflow-hidden rounded-2xl"
                style={{ breakInside: 'avoid' }}
              >
                <div className="relative w-full">
                  <SmartImage
                    src={img.image_url}
                    alt={img.caption ?? 'Community'}
                    width={400}
                    height={500}
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                    className="h-auto w-full object-cover"
                    style={{ display: 'block' }}
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3">
                      <p className="text-xs text-white/80 line-clamp-2">{img.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              For Creators/<br />Brands/ Artists
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
