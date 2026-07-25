import type { Metadata } from 'next';
import ProductsClientSection from '@/components/catalog/ProductsClientSection';
import PageHero from '@/components/motion/PageHero';

export const metadata: Metadata = { title: 'New Products | OXFOX' };

export default function NewProductsPage() {
  return (
    <div>
      <PageHero
        eyebrow="New Products"
        heading="New Products"
        subheading="Freshly added silicone molds — explore the latest from OXFOX Studio."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ProductsClientSection apiPath="/api/products?sort=new&limit=100" skeletonCount={20} />
      </div>
    </div>
  );
}
