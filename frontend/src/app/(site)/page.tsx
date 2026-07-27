import HeroIntro from '@/components/home/HeroIntro';
import HeroSlider from '@/components/home/HeroSlider';
import CategorySlider from '@/components/home/CategorySlider';
import CustomOrderSteps from '@/components/home/CustomOrderSteps';
import ProductMarquee from '@/components/home/ProductMarquee';
import VisitBeacon from '@/components/VisitBeacon';
import CurvedDivider from '@/components/motion/CurvedDivider';
import Reveal from '@/components/motion/Reveal';
import PromoBanner from '@/components/layout/PromoBanner';
import SmartImage from '@/components/SmartImage';
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

async function getCommunityImages(): Promise<{ id: number; image_url: string; caption: string | null }[]> {
  try {
    const { images } = await apiFetch<{ images: { id: number; image_url: string; caption: string | null }[] }>('/api/community-images');
    return images;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [categories, products, heroImages, communityImages] = await Promise.all([
    getCategories(),
    getAllProducts(),
    getHeroImages(),
    getCommunityImages(),
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

      {communityImages.length > 0 && (
        <section className="overflow-hidden py-10 sm:py-20">
          <Reveal className="mx-auto mb-8 flex max-w-7xl items-end justify-between px-4 sm:mb-12 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Community</h2>
            <Link href="/community" className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-neutral-900 hover:underline">
              View all →
            </Link>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-6 px-4 sm:gap-10">
            {communityImages.slice(0, 8).map((img, i) => {
              const clipPaths = [
                'circle(50% at 50% 50%)',
                'polygon(50% 0%, 0% 100%, 100% 100%)',
                'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                'circle(50% at 50% 50%)',
                'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                'circle(50% at 50% 50%)',
              ];
              return (
                <div
                  key={img.id}
                  className="relative h-32 w-32 flex-shrink-0 sm:h-44 sm:w-44"
                  style={{ clipPath: clipPaths[i] }}
                >
                  <SmartImage
                    src={img.image_url}
                    alt={img.caption ?? 'Community'}
                    fill
                    sizes="176px"
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      <PromoBanner />

      <CustomOrderSteps />
    </>
  );
}
