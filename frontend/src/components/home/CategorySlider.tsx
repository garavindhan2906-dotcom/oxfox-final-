'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SmartImage from '@/components/SmartImage';
import type { Category } from '@/types';

const categoryIcon = (name: string) => {
  const n = name.toLowerCase();

  // Chocolate bar — grid rectangle
  if (n.includes('chocolate') || n.includes('sweet') || n.includes('candy'))
    return (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 16h18M9 4v6M15 4v6" />
      </>
    );

  // Candle with flame
  if (n.includes('candle') || n.includes('soap') || n.includes('wax'))
    return (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c-1 1.5-2 3.2-2 4.5 0 1.1.9 2 2 2s2-.9 2-2C14 5.2 13 3.5 12 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.5V10" />
        <rect x="7" y="10" width="10" height="12" rx="1" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );

  // Gift box with bow
  if (n.includes('festive') || n.includes('gift') || n.includes('rakhi') || n.includes('diwali'))
    return (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 7H2v5h20V7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </>
    );

  // Pottery vase
  if (n.includes('jar') || n.includes('resin') || n.includes('jesmonite') || n.includes('eco') || n.includes('décor') || n.includes('decor'))
    return (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 3h4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 3C9 7 6 10 6 14a6 6 0 0 0 12 0c0-4-3-7-4-11H10z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" />
      </>
    );

  // Default: gem/diamond
  return (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20" />
    </>
  );
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
