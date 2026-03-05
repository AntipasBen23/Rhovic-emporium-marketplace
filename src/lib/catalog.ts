export type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  pricingUnit?: string;
  stockQuantity?: number | string;
  categoryId?: string | null;
  imageUrl?: string | null;
  status?: string;
};

export type Category = {
  id: string;
  name: string;
};

function readString(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string") return v;
  }
  return "";
}

function readNumber(obj: Record<string, unknown>, ...keys: string[]): number {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  }
  return 0;
}

export function normalizeProduct(raw: unknown): CatalogProduct {
  const obj = (raw || {}) as Record<string, unknown>;
  const categoryId = readString(obj, "category_id", "CategoryID");
  const imageUrl = readString(obj, "image_url", "ImageURL");

  return {
    id: readString(obj, "id", "ID"),
    name: readString(obj, "name", "Name"),
    description: readString(obj, "description", "Description"),
    price: readNumber(obj, "price", "Price"),
    pricingUnit: readString(obj, "pricing_unit", "PricingUnit"),
    stockQuantity: readString(obj, "stock_quantity", "StockQuantity") || readNumber(obj, "stock_quantity", "StockQuantity"),
    categoryId: categoryId || null,
    imageUrl: imageUrl || null,
    status: readString(obj, "status", "Status"),
  };
}

export function normalizeCategories(raw: unknown): Category[] {
  const items = Array.isArray(raw) ? raw : [];
  return items
    .map((it) => {
      const obj = it as Record<string, unknown>;
      const id = readString(obj, "id", "ID");
      const name = readString(obj, "name", "Name");
      if (!id || !name) return null;
      return { id, name };
    })
    .filter((x): x is Category => !!x);
}
