import type { Metadata } from 'next';
import VisitBeacon from '@/components/VisitBeacon';
import PageHero from '@/components/motion/PageHero';

export const metadata: Metadata = { title: 'Custom Order | OXFOX' };

export default function CustomOrderPage() {
  return (
    <div>
      <VisitBeacon pageType="custom_order" />
      <PageHero
        eyebrow="Made For You"
        heading="Custom Order"
        subheading="From concept to hand-poured mold — tell us your idea and we'll build it."
      />
    </div>
  );
}
