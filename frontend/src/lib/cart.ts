import { CART_STORAGE_KEY } from './constants';
import type { CartItem } from '@/types';

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
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
