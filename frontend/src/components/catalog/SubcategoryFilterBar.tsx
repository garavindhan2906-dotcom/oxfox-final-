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
        className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
          !activeSlug
            ? 'bg-[#2A1F14] text-white'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        }`}
      >
        All
      </Link>
      {subcategories.map((sub) => (
        <Link
          key={sub.id}
          href={`/molds/${categorySlug}/${sub.slug}`}
          className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeSlug === sub.slug
              ? 'bg-[#2A1F14] text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          {sub.name}
        </Link>
      ))}
    </div>
  );
}
