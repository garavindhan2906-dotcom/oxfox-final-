import HeroIntro from '@/components/home/HeroIntro';
import HeroSlider from '@/components/home/HeroSlider';
import CategorySlider from '@/components/home/CategorySlider';
import CustomOrderSteps from '@/components/home/CustomOrderSteps';
import ProductMarquee from '@/components/home/ProductMarquee';
import VisitBeacon from '@/components/VisitBeacon';
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

async function getHeroImages(): Promise<{ id: number; image_url: string }[]> {
  try {
    const { images } = await apiFetch<{ images: { id: number; image_url: string }[] }>('/api/hero-images');
    return images;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [categories, products, heroImages] = await Promise.all([
    getCategories(),
    getAllProducts(),
    getHeroImages(),
  ]);

  return (
    <>
      <VisitBeacon pageType="homepage" />

      <HeroSlider images={heroImages} subheading={HOMEPAGE_INTRO} />
      <CurvedDivider color="white" />

      <HeroIntro />

      <CategorySlider categories={categories} />

      <section className="py-10 sm:py-20">
        <Reveal className="mx-auto mb-6 flex max-w-7xl items-end justify-between px-4 sm:mb-10 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Explore Everything</h2>
          <Link href="/new" className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-neutral-900 hover:underline">
            View all →
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <ProductMarquee products={products} />
        </Reveal>
      </section>

      <PromoBanner />

      <CustomOrderSteps />
    </>
  );
}
