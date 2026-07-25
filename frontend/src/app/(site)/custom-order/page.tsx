'use client';

import { useEffect, useState } from 'react';
import SmartImage from '@/components/SmartImage';
import VisitBeacon from '@/components/VisitBeacon';
import CustomOrderInquiryForm from '@/components/forms/CustomOrderInquiryForm';
import type { CommunityPost } from '@/types';

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Share Your Design',
    desc: "Tell us your shape, size, and material. Upload a sketch, reference photo, or just describe it — we'll handle the rest.",
  },
  {
    num: '02',
    title: 'We Model & Create',
    desc: 'Our engineers 3D-model your mold and share a digital proof for your approval. Once approved, we move to high-precision 3D printing and master preparation.',
  },
  {
    num: '03',
    title: 'Handcrafted & Delivered',
    desc: 'Once your design is finalized, we hand-pour your custom mold using premium, food-grade silicone. After rigorous quality inspection, it\'s securely packed and dispatched.',
  },
];

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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Made By OXFOX</p>
        <h1 className="mt-3 text-5xl font-bold uppercase tracking-tight text-white sm:text-7xl">Custom Order<br />Images</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
          Real custom silicone molds designed and crafted by OXFOX Studio for creators and brands across India.
        </p>
      </div>

      {/* Masonry photo grid */}
      {posts.length === 0 ? (
        <div className="px-6 pb-20 text-center">
          <p className="text-white/60">Custom order images coming soon.</p>
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
                    alt={post.title ?? post.customer_name ?? 'Custom Order'}
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

          <div className="mt-12 text-center">
            <p className="text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              For Creators/<br />Brands/ Artists
            </p>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand">How It Works</p>
          <h2 className="mt-3 text-center text-3xl font-bold uppercase tracking-tight text-neutral-900 sm:text-4xl">
            Custom Order Process
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.num} className="flex flex-col gap-3">
                <span className="text-5xl font-black text-brand/20 leading-none">{step.num}</span>
                <h3 className="text-lg font-bold text-neutral-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA + inline form */}
      <div className="bg-neutral-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-neutral-200 lg:grid lg:grid-cols-2">

            {/* Left panel */}
            <div className="flex flex-col justify-center bg-brand px-8 py-12 sm:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Ready to build?</p>
              <h2 className="mt-3 text-3xl font-bold uppercase leading-tight tracking-tight text-white sm:text-4xl">
                Start Your<br />Custom Order
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/80">
                Tell us your shape, size, and material. Our team will follow up with a design plan and quote — usually within 24 hours.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  { icon: '✏️', text: 'Share your shape, size & material' },
                  { icon: '📐', text: 'We 3D-model and send a digital proof' },
                  { icon: '📦', text: 'Handcrafted & delivered across India' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg leading-none">{item.icon}</span>
                    <span className="text-sm text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel — form */}
            <div className="px-8 py-12 sm:px-12">
              <h3 className="text-xl font-bold text-neutral-900">Tell Us About Your Mold</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Fill in the details below and we will get back to you with a plan and quote.
              </p>
              <div className="mt-6">
                <CustomOrderInquiryForm />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
