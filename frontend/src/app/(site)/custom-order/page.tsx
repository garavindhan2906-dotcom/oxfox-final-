import type { Metadata } from 'next';
import CustomOrderSteps from '@/components/home/CustomOrderSteps';
import CustomOrderInquiryForm from '@/components/forms/CustomOrderInquiryForm';
import VisitBeacon from '@/components/VisitBeacon';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';

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
      <CustomOrderSteps />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-neutral-900">Tell Us About Your Mold</h2>
          <p className="mt-2 text-neutral-600">
            Share your shape, size, and material below and our team will follow up with a plan and quote.
          </p>
          <div className="mt-6">
            <CustomOrderInquiryForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
