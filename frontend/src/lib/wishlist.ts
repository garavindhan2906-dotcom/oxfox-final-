const KEY = 'oxfox_wishlist';

export function getWishlist(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch {
    return new Set();
  }
}

export function toggleWishlist(id: number): boolean {
  const list = getWishlist();
  if (list.has(id)) {
    list.delete(id);
  } else {
    list.add(id);
  }
  localStorage.setItem(KEY, JSON.stringify([...list]));
  window.dispatchEvent(new Event('oxfox-wishlist-updated'));
  return list.has(id);
}

export function isInWishlist(id: number): boolean {
  return getWishlist().has(id);
}
