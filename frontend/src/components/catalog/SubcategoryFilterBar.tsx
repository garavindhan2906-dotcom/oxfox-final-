import Link from 'next/link';
import type { Subcategory } from '@/types';

export default function SubcategoryFilterBar({
  categorySlug,
  subcategories,
  activeSlug,
}: {
  categorySlug: string;
  subcategories: Subcategory[];
  activeSlug?: string;
}) {
  if (subcategories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/molds/${categorySlug}`}
        className={`rounded-full border px-4 py-1.5 text-sm ${
          !activeSlug ? 'border-brand bg-brand text-white' : 'border-neutral-300 text-neutral-700 hover:border-brand'
        }`}
      >
        All
      </Link>
      {subcategories.map((sub) => (
        <Link
          key={sub.id}
          href={`/molds/${categorySlug}/${sub.slug}`}
          className={`rounded-full border px-4 py-1.5 text-sm ${
            activeSlug === sub.slug
              ? 'border-brand bg-brand text-white'
              : 'border-neutral-300 text-neutral-700 hover:border-brand'
          }`}
        >
          {sub.name}
        </Link>
      ))}
    </div>
  );
}
