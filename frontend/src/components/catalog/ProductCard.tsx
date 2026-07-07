import Link from 'next/link';
import SmartImage from '@/components/SmartImage';
import type { Product } from '@/types';

const BADGE_LABEL: Record<string, string> = {
  new: 'New',
  bestseller: 'Bestseller',
  sale: 'Sale',
  limited: 'Limited',
};

export default function ProductCard({ product }: { product: Product }) {
  const badgeLabel = product.badge && product.badge !== 'none' ? BADGE_LABEL[product.badge] : product.is_new ? 'New' : null;
  const showMrp = product.mrp != null && product.price != null && product.mrp > product.price;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="media-3-4 rounded-lg">
        {product.primary_image ? (
          <SmartImage
            src={product.primary_image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">No image</div>
        )}
        {badgeLabel && (
          <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
            {badgeLabel}
          </span>
        )}
        {product.emoji_icon && (
          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm shadow-sm">
            {product.emoji_icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-neutral-900 group-hover:text-brand">{product.name}</p>
      <p className="text-sm text-neutral-600">
        {product.price != null ? (
          <>
            <span className="font-medium text-neutral-900">₹{product.price}</span>
            {showMrp && <span className="ml-2 text-neutral-400 line-through">₹{product.mrp}</span>}
          </>
        ) : (
          'Price on request'
        )}
      </p>
    </Link>
  );
}
