'use client';

import { useEffect, useState } from 'react';
import ProductGrid from './ProductGrid';
import ProductGridSkeleton from './ProductGridSkeleton';
import type { Product } from '@/types';

export default function ProductsClientSection({
  apiPath,
  skeletonCount = 20,
}: {
  apiPath: string;
  skeletonCount?: number;
}) {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    fetch(apiPath)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));
  }, [apiPath]);

  if (products === null) return <ProductGridSkeleton count={skeletonCount} />;
  return <ProductGrid products={products} />;
}
