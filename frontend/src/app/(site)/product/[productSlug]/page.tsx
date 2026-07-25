import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductGallery from '@/components/product/ProductGallery';
import AddToCartPanel from '@/components/product/AddToCartPanel';
import ShareButton from '@/components/product/ShareButton';
import CommentList from '@/components/product/CommentList';
import CommentForm from '@/components/product/CommentForm';
import VisitBeacon from '@/components/VisitBeacon';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { Product, ProductComment } from '@/types';

async function getProduct(slug: string): Promise<Product> {
  const { product } = await apiFetch<{ product: Product }>(`/api/products/${slug}`);
  return product;
}

async function getComments(productId: number): Promise<ProductComment[]> {
  try {
    const { comments } = await apiFetch<{ comments: ProductComment[] }>(`/api/products/${productId}/comments`);
    return comments;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;
  try {
    const product = await getProduct(productSlug);
    return { title: `${product.name} | OXFOX Silicone Molds` };
  } catch {
    return { title: 'OXFOX' };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const { productSlug } = await params;

  let product: Product;
  try {
    product = await getProduct(productSlug);
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) notFound();
    throw err;
  }

  const comments = await getComments(product.id);
  const breadcrumbTrail = [product.category_name, product.subcategory_name].filter(Boolean).join(' / ');

  return (
    <div>
      <VisitBeacon pageType="product" />
      <PageHero eyebrow={breadcrumbTrail || 'Silicone Mold'} heading={product.name} imageSrc={product.primary_image} />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <ProductGallery images={product.images ?? []} productName={product.name} />
          </Reveal>

          <Reveal delay={0.1}>
            {product.category_name && (
              <p className="text-sm text-neutral-500">
                <Link href={`/molds/${product.category_slug}`} className="hover:text-brand">
                  {product.category_name}
                </Link>
                {product.subcategory_name ? ` / ${product.subcategory_name}` : ''}
              </p>
            )}
            <p className="mt-2 text-2xl font-semibold text-brand">
              {product.price != null ? `₹${product.price}` : 'Price on request'}
            </p>

            {product.description && <p className="mt-4 leading-relaxed text-neutral-600">{product.description}</p>}

            <dl className="mt-6 space-y-1 text-sm text-neutral-600">
              <div className="flex gap-2">
                <dt className="font-medium text-neutral-900">Material:</dt>
                <dd>{product.material}</dd>
              </div>
              {product.dimensions && (
                <div className="flex gap-2">
                  <dt className="font-medium text-neutral-900">Dimensions:</dt>
                  <dd>{product.dimensions}</dd>
                </div>
              )}
            </dl>

            <AddToCartPanel product={product} />
            <ShareButton name={product.name} />
          </Reveal>
        </div>

        {product.video_url && (
          <Reveal delay={0.12} className="mt-16">
            <h2 className="mb-4 text-xl font-bold uppercase tracking-tight text-neutral-900">Product Video</h2>
            <video
              src={product.video_url}
              controls
              playsInline
              className="w-full max-w-2xl rounded-2xl object-cover shadow-md"
            />
          </Reveal>
        )}

        <Reveal delay={0.15} className="mt-16 max-w-3xl">
          <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-900">Reviews</h2>
          <div className="mt-4">
            <CommentList comments={comments} />
          </div>
          <CommentForm productId={product.id} />
        </Reveal>
      </div>
    </div>
  );
}
