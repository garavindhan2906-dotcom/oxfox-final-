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

      <HeroSlider images={heroImages} />
      <CurvedDivider color="white" />

      {/* 4-tile feature grid */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-2 divide-x divide-y divide-neutral-200">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 6 5 9 5 13a7 7 0 0 0 14 0c0-4-3-7-7-11Z" />
                </svg>
              ),
              title: 'Food Grade',
              desc: 'Made with 100% food grade silicone',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              ),
              title: 'Premium Quality',
              desc: 'Durable, detailed & made to last',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
                </svg>
              ),
              title: 'Custom Molds',
              desc: 'Bring your ideas to life with our custom service',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
                </svg>
              ),
              title: 'Made With Care',
              desc: 'Thoughtfully handcrafted for creators like you',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center px-6 py-10 text-center sm:py-14">
              <span className="text-[#3B2A1C]">{icon}</span>
              <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-[#2A1F14]">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500 sm:text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

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
