import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
import { apiFetch } from '@/lib/api';
import type { Category } from '@/types';

export const metadata: Metadata = { title: 'Silicone Mold Categories | OXFOX' };

async function getCategories(): Promise<Category[]> {
  try {
    const { categories } = await apiFetch<{ categories: Category[] }>('/api/categories');
    return categories;
  } catch {
    return [];
  }
}

export default async function MoldsPage() {
  const categories = await getCategories();

  return (
    <div>
      <PageHero
        eyebrow="Full Catalog"
        heading="Silicone Molds"
        subheading="Browse our full range of handcrafted, food-grade silicone mold categories."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 4) * 0.08}>
              <Link
                href={`/molds/${cat.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center bg-neutral-100">
                  {cat.banner_image ? (
                    <Image
                      src={cat.banner_image}
                      alt={cat.name}
                      fill
                      sizes="25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-5xl">{cat.emoji ?? '📦'}</span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-lg font-bold text-neutral-900">{cat.name}</p>
                  {cat.description && (
                    <p className="mt-2 text-sm text-neutral-500">{cat.description}</p>
                  )}
                  <div className="mt-4 border-t border-neutral-200 pt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 group-hover:text-brand">
                    {`${cat.product_count ?? 0} designs →`}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
