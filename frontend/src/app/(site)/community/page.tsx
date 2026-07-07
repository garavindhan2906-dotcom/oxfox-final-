import type { Metadata } from 'next';
import Image from 'next/image';
import VisitBeacon from '@/components/VisitBeacon';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
import { apiFetch } from '@/lib/api';
import type { CommunityPost } from '@/types';

export const metadata: Metadata = { title: 'Community | OXFOX' };

async function getPosts(): Promise<CommunityPost[]> {
  try {
    const { posts } = await apiFetch<{ posts: CommunityPost[] }>('/api/community');
    return posts;
  } catch {
    return [];
  }
}

export default async function CommunityPage() {
  const posts = await getPosts();

  return (
    <div>
      <VisitBeacon pageType="community" />
      <PageHero
        eyebrow="Made With OXFOX"
        heading="Community"
        subheading="See what creators and brands across India are making with OXFOX silicone molds."
        imageSrc={posts[0]?.image_path}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <p className="text-sm text-neutral-500">Community highlights are coming soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 4) * 0.08} as="section">
                <figure>
                  <div className="media-3-4 rounded-lg">
                    <Image src={post.image_path} alt={post.title ?? 'Community post'} fill sizes="25vw" />
                  </div>
                  {(post.caption || post.customer_name) && (
                    <figcaption className="mt-2 text-sm text-neutral-600">
                      {post.caption}
                      {post.customer_name && (
                        <span className="block font-medium text-neutral-900">— {post.customer_name}</span>
                      )}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
