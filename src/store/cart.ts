import { create } from "zustand";
import { cartCount, cartTotal, mergeCartItems, normalizeCartQty } from "@/lib/cart";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit?: string;
  vendor: string;
  quantity: number; // supports decimals
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({ items: mergeCartItems(state.items, item) })),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  setQty: (id, qty) =>
    set((state) => ({ items: normalizeCartQty(state.items, id, qty) })),

  clear: () => set({ items: [] }),

  total: () => {
    const { items } = get();
    return cartTotal(items);
    },

  count: () => {
    const { items } = get();
    return cartCount(items);
  },
}));
