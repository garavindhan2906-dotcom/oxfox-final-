import PageHero from '@/components/motion/PageHero';
import CartTable from '@/components/cart/CartTable';

export default function CartPage() {
  return (
    <div>
      <PageHero eyebrow="Checkout" heading="Your Cart" />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <CartTable />
      </div>
    </div>
  );
}
