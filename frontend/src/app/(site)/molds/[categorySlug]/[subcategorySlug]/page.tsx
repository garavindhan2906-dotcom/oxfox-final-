import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductGrid from '@/components/catalog/ProductGrid';
import SubcategoryFilterBar from '@/components/catalog/SubcategoryFilterBar';
import VisitBeacon from '@/components/VisitBeacon';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { Category, Product, Subcategory } from '@/types';

interface SubcategoryDetail extends Subcategory {
  category: Category;
}

async function getSubcategory(categorySlug: string, subSlug: string): Promise<SubcategoryDetail> {
  const { subcategory } = await apiFetch<{ subcategory: SubcategoryDetail }>(
    `/api/categories/${categorySlug}/subcategories/${subSlug}`
  );
  return subcategory;
}

async function getProducts(categorySlug: string, subSlug: string): Promise<Product[]> {
  const { products } = await apiFetch<{ products: Product[] }>(
    `/api/products?category=${categorySlug}&subcategory=${subSlug}`
  );
  return products;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, subcategorySlug } = await params;
  try {
    const sub = await getSubcategory(categorySlug, subcategorySlug);
    return { title: `${sub.name} | OXFOX` };
  } catch {
    return { title: 'OXFOX' };
  }
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}) {
  const { categorySlug, subcategorySlug } = await params;

  let subcategory: SubcategoryDetail;
  try {
    subcategory = await getSubcategory(categorySlug, subcategorySlug);
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) notFound();
    throw err;
  }

  const products = await getProducts(categorySlug, subcategorySlug);

  return (
    <div>
      <VisitBeacon pageType="subcategory" />
      <PageHero eyebrow={subcategory.category.name} heading={subcategory.name} />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SubcategoryFilterBar
            categorySlug={categorySlug}
            subcategories={subcategory.category.subcategories}
            activeSlug={subcategory.slug}
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <ProductGrid products={products} />
        </Reveal>
      </div>
    </div>
  );
}
