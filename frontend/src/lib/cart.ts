import { CART_STORAGE_KEY } from './constants';
import type { CartItem, DiscountTier } from '@/types';

/** Best (deepest) discount whose min_qty is met by the given quantity, or 0 if none apply. */
export function bestDiscountPercent(tiers: DiscountTier[] | undefined, quantity: number): number {
  if (!tiers || tiers.length === 0) return 0;
  const applicable = tiers.filter((t) => quantity >= t.min_qty).sort((a, b) => b.min_qty - a.min_qty);
  return applicable.length > 0 ? Number(applicable[0].discount_percent) : 0;
}

export function effectiveUnitPrice(item: Pick<CartItem, 'price' | 'quantity' | 'discountTiers'>): number {
  const discount = bestDiscountPercent(item.discountTiers, item.quantity);
  return item.price * (1 - discount / 100);
}

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('oxfox-cart-updated'));
}

export function getCart(): CartItem[] {
  return readCart();
}

export function addToCart(item: CartItem) {
  const items = readCart();
  const existing = items.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += item.quantity;
    existing.discountTiers = item.discountTiers ?? existing.discountTiers;
  } else {
    items.push(item);
  }
  writeCart(items);
}

export function updateQuantity(productId: number, quantity: number) {
  const items = readCart()
    .map((i) => (i.productId === productId ? { ...i, quantity } : i))
    .filter((i) => i.quantity > 0);
  writeCart(items);
}

export function removeFromCart(productId: number) {
  const items = readCart().filter((i) => i.productId !== productId);
  writeCart(items);
}

export function clearCart() {
  writeCart([]);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + effectiveUnitPrice(i) * i.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
