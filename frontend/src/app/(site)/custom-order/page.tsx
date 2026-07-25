import type { Metadata } from 'next';
import VisitBeacon from '@/components/VisitBeacon';

export const metadata: Metadata = { title: 'Custom Order | OXFOX' };

export default function CustomOrderPage() {
  return (
    <div>
      <VisitBeacon pageType="custom_order" />
    </div>
  );
}
