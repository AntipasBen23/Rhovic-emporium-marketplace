import { describe, expect, it } from "vitest";
import { cartCount, cartTotal, mergeCartItems, normalizeCartQty } from "../src/lib/cart";

const baseItem = {
  id: "prd_1",
  name: "Ankara",
  price: 5000,
  vendor: "Vendor A",
  quantity: 1,
};

describe("cart helpers", () => {
  it("merges repeated products and rounds decimal quantities", () => {
    const items = mergeCartItems([baseItem], { ...baseItem, quantity: 1.257 });
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2.26);
  });

  it("removes items when quantity is set to zero or below", () => {
    const items = normalizeCartQty([baseItem], "prd_1", 0);
    expect(items).toEqual([]);
  });

  it("computes checkout totals and item counts with decimal quantities", () => {
    const items = [
      { ...baseItem, quantity: 2.5 },
      { id: "prd_2", name: "Bag", price: 3200, vendor: "Vendor B", quantity: 1.25 },
    ];

    expect(cartTotal(items)).toBe(16500);
    expect(cartCount(items)).toBe(3.75);
  });
});
