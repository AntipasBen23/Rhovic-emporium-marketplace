import type { CartItem } from "@/store/cart";

export function roundCartQuantity(value: number) {
  return Math.round(value * 100) / 100;
}

export function mergeCartItems(items: CartItem[], incoming: CartItem): CartItem[] {
  const existing = items.find((item) => item.id === incoming.id);
  if (existing) {
    return items.map((item) =>
      item.id === incoming.id
        ? { ...item, quantity: roundCartQuantity(item.quantity + incoming.quantity) }
        : item
    );
  }
  return [...items, { ...incoming, quantity: roundCartQuantity(incoming.quantity) }];
}

export function normalizeCartQty(items: CartItem[], id: string, qty: number): CartItem[] {
  const rounded = roundCartQuantity(qty);
  if (rounded <= 0) {
    return items.filter((item) => item.id !== id);
  }
  return items.map((item) => (item.id === id ? { ...item, quantity: rounded } : item));
}

export function cartTotal(items: CartItem[]): number {
  return roundCartQuantity(items.reduce((acc, item) => acc + item.price * item.quantity, 0));
}

export function cartCount(items: CartItem[]): number {
  return roundCartQuantity(items.reduce((acc, item) => acc + item.quantity, 0));
}
