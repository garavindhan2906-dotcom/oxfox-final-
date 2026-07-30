import CartTable from '@/components/cart/CartTable';
import VisitBeacon from '@/components/VisitBeacon';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <VisitBeacon pageType="other" />

      {/* Header */}
      <div className="bg-white px-4 pb-6 pt-24">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2A1F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#2A1F14]">Your Cart</h1>
          <p className="mt-1 text-sm text-neutral-500">Complete your order</p>

          <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M1 3h13v13H1zM14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Ships in 1–2 Days
            </div>
            <span className="text-neutral-200">|</span>
            <div className="flex items-center gap-1.5">
              <span>🇮🇳</span>
              Made in India
            </div>
            <span className="text-neutral-200">|</span>
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure Checkout
            </div>
          </div>
        </div>
      </div>

      {/* Cart content */}
      <div className="mx-auto max-w-lg px-4 py-5 pb-16">
        <CartTable />
      </div>
    </div>
  );
}
