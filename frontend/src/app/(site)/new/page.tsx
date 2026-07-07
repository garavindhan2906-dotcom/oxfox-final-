import type { Metadata } from 'next';
import ProductGrid from '@/components/catalog/ProductGrid';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
import { apiFetch } from '@/lib/api';
import type { Product } from '@/types';

export const metadata: Metadata = { title: 'New Arrivals | OXFOX' };

async function getNewProducts(): Promise<Product[]> {
  try {
    const { products } = await apiFetch<{ products: Product[] }>('/api/products?sort=new&limit=48');
    return products;
  } catch {
    return [];
  }
}

export default async function NewProductsPage() {
  const products = await getNewProducts();

  return (
    <div>
      <PageHero
        eyebrow="Just Dropped"
        heading="New Arrivals"
        subheading="The latest silicone molds added to the OXFOX catalog."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <ProductGrid products={products} />
        </Reveal>
      </div>
    </div>
  );
}
