import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/motion/PageHero';
import Reveal from '@/components/motion/Reveal';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { OrderSummary } from '@/types';

async function getOrder(orderNumber: string): Promise<OrderSummary> {
  const { order } = await apiFetch<{ order: OrderSummary }>(`/api/orders/${orderNumber}`);
  return order;
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  let order: OrderSummary;
  try {
    order = await getOrder(orderNumber);
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div>
      <PageHero eyebrow="Order Confirmed" heading="Thank You" />

      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-neutral-600">
            Order <span className="font-semibold text-neutral-900">{order.orderNumber}</span> has been received. Our
            team will contact you shortly to confirm payment (COD, UPI, or bank transfer).
          </p>

          <div className="mt-8 rounded-xl border border-neutral-200 p-5 text-left">
            <ul className="space-y-2 text-sm text-neutral-600">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span>₹{Number(item.line_total).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-semibold text-neutral-900">
              <span>Subtotal</span>
              <span>₹{Number(order.subtotal).toFixed(2)}</span>
            </div>
          </div>

          <Link href="/" className="mt-8 inline-block text-sm font-medium text-brand hover:underline">
            Continue shopping
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
