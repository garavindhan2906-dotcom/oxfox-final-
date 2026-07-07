import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductGrid from '@/components/catalog/ProductGrid';
import SubcategoryFilterBar from '@/components/catalog/SubcategoryFilterBar';
import VisitBeacon from '@/components/VisitBeacon';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { Category, Product } from '@/types';

async function getCategory(slug: string): Promise<Category> {
  const { category } = await apiFetch<{ category: Category }>(`/api/categories/${slug}`);
  return category;
}

async function getProducts(categorySlug: string): Promise<Product[]> {
  const { products } = await apiFetch<{ products: Product[] }>(`/api/products?category=${categorySlug}`);
  return products;
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

  const products = await getProducts(categorySlug);

  return (
    <div>
      <VisitBeacon pageType="category" />
      <PageHero
        eyebrow="Category"
        heading={category.name}
        subheading={category.description ?? undefined}
        imageSrc={category.banner_image}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SubcategoryFilterBar categorySlug={category.slug} subcategories={category.subcategories} />
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <ProductGrid products={products} />
        </Reveal>
      </div>
    </div>
  );
}
