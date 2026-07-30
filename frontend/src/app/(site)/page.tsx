import HeroIntro from '@/components/home/HeroIntro';
import HeroSlider from '@/components/home/HeroSlider';
import CategorySlider from '@/components/home/CategorySlider';
import CustomOrderSteps from '@/components/home/CustomOrderSteps';
import HomeProductGrid from '@/components/home/HomeProductGrid';
import VisitBeacon from '@/components/VisitBeacon';
import CurvedDivider from '@/components/motion/CurvedDivider';
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
    const { products } = await apiFetch<{ products: Product[] }>('/api/products?sort=new&limit=6');
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12C9 9 6 5 7 2c3 1 6 4 5 10z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c3-3 6-7 5-10-3 1-6 4-5 10z" />
                </svg>
              ),
              title: 'Food Grade',
              desc: 'Made with 100% food grade silicone',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3 6 9l6 12M15 3l3 6-6 12" />
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

      {/* Explore Everything */}
      <section className="bg-[#FAF8F5] px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">Explore Everything</h2>
            <p className="mt-1 text-sm text-neutral-500">Handpicked favorites, just for you.</p>
          </div>
          <Link
            href="/new"
            className="flex-shrink-0 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-700 hover:bg-neutral-50"
          >
            View All →
          </Link>
        </div>
        <HomeProductGrid products={products} />
      </section>

      {/* Community */}
      {communityImages.length > 0 && (
        <section className="bg-[#FAF8F5] px-4 pb-10 sm:px-6 sm:pb-16">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">Community</h2>
              <p className="mt-1 text-sm text-neutral-500">Real creations from our amazing makers.</p>
            </div>
            <Link
              href="/community"
              className="flex-shrink-0 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-700 hover:bg-neutral-50"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {communityImages.slice(0, 4).map((img) => (
              <Link key={img.id} href="/community" className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-200">
                <SmartImage
                  src={img.image_url}
                  alt={img.caption ?? 'Community'}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-[8px] font-bold text-neutral-700">
                      {img.caption.replace('@', '').charAt(0).toUpperCase()}
                    </div>
                    <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                      {img.caption.startsWith('@') ? img.caption : `@${img.caption}`}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <PromoBanner />

      <CustomOrderSteps />
    </>
  );
}
