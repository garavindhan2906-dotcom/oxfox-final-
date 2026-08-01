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
    desc: "Once your design is finalized, we hand-pour your custom mold using premium, food-grade silicone. After rigorous quality inspection, it's securely packed and dispatched.",
  },
];

export default function CustomOrderPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    fetch('/api/community')
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <VisitBeacon pageType="community" />

      {/* ── How It Works ── */}
      <div className="bg-white px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#3B2A1C]">How It Works</p>
          <h2 className="font-display mt-3 text-center text-3xl font-bold uppercase tracking-tight text-[#2A1F14] sm:text-4xl">
            Custom Order Process
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.num} className="flex flex-col gap-3">
                <span className="text-5xl font-black leading-none text-[#3B2A1C]/20">{step.num}</span>
                <h3 className="text-lg font-bold text-neutral-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA + Form ── */}
      <div className="bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-neutral-200 lg:grid lg:grid-cols-2">

            {/* Left panel */}
            <div className="flex flex-col justify-center bg-[#3B2A1C] px-8 py-12 sm:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Ready to build?</p>
              <h2 className="font-display mt-3 text-3xl font-bold uppercase leading-tight tracking-tight text-white sm:text-4xl">
                Start Your<br />Custom Order
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/80">
                Tell us your shape, size, and material. Our team will follow up with a design plan and quote — usually within 24 hours.
              </p>
              <div className="mt-10 space-y-4">
                {[
                  { text: 'Share your shape, size & material' },
                  { text: 'We 3D-model and send a digital proof' },
                  { text: 'Handcrafted & delivered across India' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span className="text-sm text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel — form */}
            <div className="px-8 py-12 sm:px-12">
              <h3 className="font-display text-xl font-bold text-neutral-900">Tell Us About Your Mold</h3>
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

      {/* ── Gallery — scrolling left to right ── */}
      {posts.length > 0 && (
        <div className="overflow-hidden bg-[#FAF8F5] py-12">
          <div className="mb-6 px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Made By OXFOX</p>
            <h2 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight text-[#2A1F14] sm:text-4xl">Custom Order Gallery</h2>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: '10px', animation: 'oxfox-marquee-ltr 35s linear infinite', width: 'max-content' }}>
              {[...posts, ...posts].map((post, i) => (
                <div key={i} style={{ width: '200px', height: '260px', flexShrink: 0, borderRadius: '14px', overflow: 'hidden', position: 'relative' }}>
                  <SmartImage
                    src={post.image_path}
                    alt={post.title ?? post.customer_name ?? 'Custom Order'}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  {(post.customer_name || post.caption) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-3">
                      {post.customer_name && <p className="text-xs font-semibold text-white">{post.customer_name}</p>}
                      {post.caption && <p className="line-clamp-1 text-[10px] text-white/80">{post.caption}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
