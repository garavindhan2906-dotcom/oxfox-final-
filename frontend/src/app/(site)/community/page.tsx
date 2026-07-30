'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
    <div className="min-h-screen bg-white">
      <VisitBeacon pageType="community" />

      {/* Header */}
      <div className="px-4 pb-4 pt-24 sm:px-6 sm:pt-28">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2A1F14] sm:text-3xl">
              Made with Oxfox <span className="text-pink-500">♥</span>
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Real creations by our amazing customers.
            </p>
          </div>
          <Link
            href="https://www.instagram.com/oxfoxmolds/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 rounded-full border border-neutral-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-700 hover:bg-neutral-50"
          >
            View Gallery →
          </Link>
        </div>
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-neutral-400">Community images coming soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 px-4 pb-12 sm:px-6">
          {images.map((img) => (
            <div key={img.id} className="flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <SmartImage
                  src={img.image_url}
                  alt={img.caption ?? 'Community'}
                  fill
                  sizes="(max-width: 640px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              {img.caption && (
                <p className="truncate px-0.5 pt-1 text-[10px] text-neutral-500">
                  {img.caption.startsWith('@') ? img.caption : `@${img.caption}`}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
