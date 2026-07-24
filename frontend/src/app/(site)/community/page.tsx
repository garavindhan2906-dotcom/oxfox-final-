'use client';

import { useEffect, useState } from 'react';
import SmartImage from '@/components/SmartImage';
import VisitBeacon from '@/components/VisitBeacon';
import type { CommunityPost } from '@/types';

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    fetch('/api/community')
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-brand">
      <VisitBeacon pageType="community" />

      {/* Header */}
      <div className="px-6 pt-16 pb-8 text-center sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Made With OXFOX</p>
        <h1 className="mt-3 text-5xl font-bold uppercase tracking-tight text-white sm:text-7xl">Community</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
          See what creators and brands across India are making with OXFOX silicone molds.
        </p>
      </div>

      {/* Masonry photo grid */}
      {posts.length === 0 ? (
        <div className="px-6 pb-20 text-center">
          <p className="text-white/60">Community highlights are coming soon.</p>
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
            {posts.map((post) => (
              <div
                key={post.id}
                className="mb-3 break-inside-avoid overflow-hidden rounded-2xl"
                style={{ breakInside: 'avoid' }}
              >
                <div className="relative w-full">
                  <SmartImage
                    src={post.image_path}
                    alt={post.title ?? post.customer_name ?? 'Community'}
                    width={400}
                    height={500}
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                    className="h-auto w-full object-cover"
                    style={{ display: 'block' }}
                  />
                  {(post.customer_name || post.caption) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3">
                      {post.customer_name && (
                        <p className="text-xs font-semibold text-white">{post.customer_name}</p>
                      )}
                      {post.caption && (
                        <p className="text-xs text-white/80 line-clamp-2">{post.caption}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom big text like the screenshot */}
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
