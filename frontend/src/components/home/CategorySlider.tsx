import Link from 'next/link';
import FullBleedSlide from '@/components/motion/FullBleedSlide';
import CurvedDivider from '@/components/motion/CurvedDivider';
import type { Category } from '@/types';

export default function CategorySlider({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <div>
      {categories.map((cat, i) => (
        <div key={cat.id}>
          <FullBleedSlide
            imageSrc={cat.banner_image}
            imageAlt={cat.name}
            eyebrow={`Category ${String(i + 1).padStart(2, '0')} / ${String(categories.length).padStart(2, '0')}`}
            heading={cat.name}
            subheading={cat.description ?? undefined}
            height="tall"
            align={i % 2 === 0 ? 'left' : 'right'}
          >
            <Link
              href={`/molds/${cat.slug}`}
              className="mt-8 inline-block rounded-full bg-brand px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
            >
              Shop {cat.name}
            </Link>
          </FullBleedSlide>
          <CurvedDivider color="white" />
        </div>
      ))}
    </div>
  );
}
