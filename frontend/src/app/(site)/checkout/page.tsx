import PageHero from '@/components/motion/PageHero';
import CheckoutForm from '@/components/cart/CheckoutForm';

export default function CheckoutPage() {
  return (
    <div>
      <PageHero eyebrow="Almost There" heading="Checkout" />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
