import HeroIntro from '@/components/home/HeroIntro';
import CategorySlider from '@/components/home/CategorySlider';
import CustomOrderSteps from '@/components/home/CustomOrderSteps';
import ProductGrid from '@/components/catalog/ProductGrid';
import VisitBeacon from '@/components/VisitBeacon';
import FullBleedSlide from '@/components/motion/FullBleedSlide';
import CurvedDivider from '@/components/motion/CurvedDivider';
import Reveal from '@/components/motion/Reveal';
import PromoBanner from '@/components/layout/PromoBanner';
import { apiFetch } from '@/lib/api';
import type { Category, Product } from '@/types';
import { HOMEPAGE_INTRO } from '@/lib/constants';
import Link from 'next/link';

async function getCategories(): Promise<Category[]> {
  try {
    const { categories } = await apiFetch<{ categories: Category[] }>('/api/categories');
    return categories;
  } catch {
    return [];
  }
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const { products } = await apiFetch<{ products: Product[] }>('/api/products?sort=new&limit=20');
    return products;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);
  return (
    <>
      <VisitBeacon pageType="homepage" />

      <FullBleedSlide
        imageSrc={null}
        imageAlt="OXFOX handcrafted silicone molds"
        eyebrow="3D Design + Handcrafted Silicone Molds"
        heading="OXFOX"
        subheading={HOMEPAGE_INTRO}
        ctaLabel="Shop Silicone Molds"
        ctaHref="/molds"
        height="full"
        align="center"
        priority
      />
      <CurvedDivider color="white" />

      <HeroIntro />

      <CategorySlider categories={categories} />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Explore Everything</p>
            <h2 className="mt-2 text-3xl font-bold uppercase tracking-tight text-neutral-900">All Products</h2>
          </div>
          <Link href="/new" className="text-sm font-semibold uppercase tracking-wide text-brand hover:underline">
            View all →
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <ProductGrid products={products} />
        </Reveal>
      </section>

      <PromoBanner />

      <CustomOrderSteps />
    </>
  );
}
