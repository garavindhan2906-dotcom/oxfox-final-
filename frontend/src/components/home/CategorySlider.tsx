'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SmartImage from '@/components/SmartImage';
import type { Category } from '@/types';

export default function CategorySlider({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
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

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="relative z-10 flex w-full flex-col justify-end p-8">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                  {`0${i + 1}`}
                </p>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white">{cat.name}</h3>
                {cat.description && (
                  <p className="mt-2 text-sm text-neutral-300 line-clamp-2">{cat.description}</p>
                )}
                <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-colors group-hover:bg-brand">
                  Shop {cat.name} →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
