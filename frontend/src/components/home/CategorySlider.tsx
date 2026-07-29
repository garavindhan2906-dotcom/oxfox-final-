'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SmartImage from '@/components/SmartImage';
import type { Category } from '@/types';

const categoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('chocolate') || n.includes('sweet') || n.includes('candy'))
    return <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 10h.01M12 10h.01M16 10h.01" />;
  if (n.includes('candle') || n.includes('soap') || n.includes('wax'))
    return <><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 6a6 6 0 0 1 6 6v8H6v-8a6 6 0 0 1 6-6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 20h6" /></>;
  if (n.includes('festive') || n.includes('gift') || n.includes('rakhi') || n.includes('diwali'))
    return <><rect x="3" y="8" width="18" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8V21M3 12h18M9 8a3 3 0 0 1 3-3 3 3 0 0 1 3 3" /></>;
  if (n.includes('jar') || n.includes('resin') || n.includes('jesmonite') || n.includes('eco'))
    return <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5H8L9 3ZM8 8v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8" />;
  // default: diamond/gem
  return <path strokeLinecap="round" strokeLinejoin="round" d="M2 9l4-6h12l4 6-10 12L2 9ZM2 9h20M8 3 6 9l6 12M16 3l2 6-6 12" />;
};

export default function CategorySlider({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-[#FAF8F5] px-3 pb-12 pt-10 sm:px-6 sm:pb-20 sm:pt-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6 text-center sm:mb-10"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-neutral-500">Shop By</p>
        <h2 className="font-display mt-1 text-4xl font-bold uppercase tracking-tight text-[#2A1F14] sm:text-5xl">
          Category
        </h2>
        <div className="mt-2 flex justify-center text-[#3B2A1C] opacity-60">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M7 0 L14 7 L7 14 L0 7 Z" />
          </svg>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              href={`/molds/${cat.slug}`}
              className="group relative flex aspect-square flex-col overflow-hidden rounded-2xl bg-neutral-900"
            >
              {/* Image */}
              {cat.banner_image ? (
                <SmartImage
                  src={cat.banner_image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-dark to-neutral-900" />
              )}

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              {/* Bottom content */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-4 pt-2 text-center">
                {/* Icon circle */}
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    {categoryIcon(cat.name)}
                  </svg>
                </div>

                {/* Name */}
                <h3 className="px-2 text-xs font-bold uppercase tracking-[0.1em] text-white sm:text-sm">
                  {cat.name}
                </h3>

                {/* Description */}
                {cat.description && (
                  <p className="mt-0.5 px-3 text-[10px] text-white/75 sm:text-xs line-clamp-1">
                    {cat.description}
                  </p>
                )}

                {/* Explore button */}
                <div className="mt-3 border border-[#E8E2DA] bg-[#FAF8F5]/90 px-5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2A1F14] transition-colors group-hover:bg-white sm:px-6 sm:text-xs">
                  Explore &rarr;
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
