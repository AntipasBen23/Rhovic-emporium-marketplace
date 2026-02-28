import { create } from "zustand";

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

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: round2(i.quantity + item.quantity) }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: round2(item.quantity) }] };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  setQty: (id, qty) =>
    set((state) => {
      const q = round2(qty);
      if (q <= 0) return { items: state.items.filter((i) => i.id !== id) };
      return { items: state.items.map((i) => (i.id === id ? { ...i, quantity: q } : i)) };
    }),

  clear: () => set({ items: [] }),

  total: () => {
    const { items } = get();
    return round2(items.reduce((acc, i) => acc + i.price * i.quantity, 0));
    },

  count: () => {
    const { items } = get();
    return round2(items.reduce((acc, i) => acc + i.quantity, 0));
  },
}));