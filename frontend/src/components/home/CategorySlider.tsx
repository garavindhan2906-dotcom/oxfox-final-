'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SmartImage from '@/components/SmartImage';
import type { Category } from '@/types';

export default function CategorySlider({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-center sm:mb-10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Collections</p>
        <h2 className="mt-2 text-3xl font-bold uppercase tracking-tight text-neutral-900">Shop by Category</h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Link
              href={`/molds/${cat.slug}`}
              className="group relative flex min-h-[320px] overflow-hidden rounded-2xl bg-neutral-900"
            >
              {cat.banner_image ? (
                <SmartImage
                  src={cat.banner_image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-dark to-neutral-900" />
              )}

              <div className="absolute inset-0 bg-black/40" />

              <div className="relative z-10 flex w-full flex-col items-center justify-center p-8 text-center">
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">{cat.name}</h3>
                <span className="mt-5 inline-flex items-center gap-2 border border-white px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors group-hover:bg-white group-hover:text-neutral-900">
                  Shop {cat.name}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
