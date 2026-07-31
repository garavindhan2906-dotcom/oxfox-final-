import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductsClientSection from '@/components/catalog/ProductsClientSection';
import SubcategoryFilterBar from '@/components/catalog/SubcategoryFilterBar';
import VisitBeacon from '@/components/VisitBeacon';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { Category } from '@/types';

async function getCategory(slug: string): Promise<Category> {
  const { category } = await apiFetch<{ category: Category }>(`/api/categories/${slug}`);
  return category;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  try {
    const category = await getCategory(categorySlug);
    return { title: `${category.name} Silicone Molds | OXFOX` };
  } catch {
    return { title: 'OXFOX' };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;

  let category: Category;
  try {
    category = await getCategory(categorySlug);
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="min-h-screen bg-white">
      <VisitBeacon pageType="category" />
      <div className="px-5 pb-6 pt-24 sm:px-8 sm:pt-28">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Category</p>
        <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-tight text-[#2A1F14] sm:text-5xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-sm text-neutral-500">{category.description}</p>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <SubcategoryFilterBar categorySlug={category.slug} subcategories={category.subcategories} />
        <div className="mt-10">
          <ProductsClientSection
            apiPath={`/api/products?category=${categorySlug}&limit=100`}
            skeletonCount={20}
          />
        </div>
      </div>
    </div>
  );
}
