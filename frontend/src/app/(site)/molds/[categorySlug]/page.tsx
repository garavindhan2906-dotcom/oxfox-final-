import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductsClientSection from '@/components/catalog/ProductsClientSection';
import SubcategoryFilterBar from '@/components/catalog/SubcategoryFilterBar';
import VisitBeacon from '@/components/VisitBeacon';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
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
