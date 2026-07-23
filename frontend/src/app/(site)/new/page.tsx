import type { Metadata } from 'next';
import ProductsClientSection from '@/components/catalog/ProductsClientSection';
import PageHero from '@/components/motion/PageHero';

export const metadata: Metadata = { title: 'New Arrivals | OXFOX' };

export default function NewProductsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Just Dropped"
        heading="New Arrivals"
        subheading="The latest silicone molds added to the OXFOX catalog."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ProductsClientSection apiPath="/api/products?sort=new&limit=100" skeletonCount={20} />
      </div>
    </div>
  );
}
