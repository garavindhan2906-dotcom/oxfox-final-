export type PageType =
  | 'homepage'
  | 'category'
  | 'subcategory'
  | 'product'
  | 'custom_order'
  | 'community'
  | 'shipping'
  | 'faq'
  | 'bulk_orders'
  | 'other';

export function trackVisit(pageType: PageType) {
  if (typeof window === 'undefined') return;

  const body = JSON.stringify({ pageType });
  const url = '/api/visits';

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(
      () => {}
    );
  }
}
