import type { Metadata } from 'next';
import Link from 'next/link';
import ProductGrid from '@/components/catalog/ProductGrid';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
import { apiFetch } from '@/lib/api';
import type { Product } from '@/types';

export const metadata: Metadata = { title: 'Search | OXFOX' };

interface SearchResults {
  products: Product[];
  categories: { id: number; name: string; slug: string }[];
}

async function search(q: string): Promise<SearchResults> {
  try {
    return await apiFetch<SearchResults>(`/api/search?q=${encodeURIComponent(q)}`);
  } catch {
    return { products: [], categories: [] };
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const results = query ? await search(query) : { products: [], categories: [] };

  return (
    <div>
      <PageHero eyebrow="Search" heading={query ? `"${query}"` : 'Search OXFOX'} />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {results.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {results.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/molds/${cat.slug}`}
                className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-700 hover:border-brand"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <Reveal className="mt-8">
          <ProductGrid products={results.products} />
        </Reveal>
      </div>
    </div>
  );
}
