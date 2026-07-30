import type { Metadata } from 'next';
import ProductsClientSection from '@/components/catalog/ProductsClientSection';

export const metadata: Metadata = { title: 'New Arrivals | OXFOX' };

export default function NewProductsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="px-4 pb-4 pt-24 text-center sm:pt-28">
        <h1 className="font-display text-4xl font-bold text-[#2A1F14] sm:text-5xl">
          New Arrivals
        </h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <ProductsClientSection apiPath="/api/products?sort=new&limit=100" skeletonCount={20} />
      </div>
    </div>
  );
}
