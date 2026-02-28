import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  unit?: string;
  vendor: string;
  category: string;
  badge?: "Top Rated" | "New" | "Best Deal";
};

type ProductGridProps = {
  title?: string;
  products?: Product[];
};

const defaultProducts: Product[] = [
  {
    id: "p1",
    name: "Premium Cotton Fabric (Ankara)",
    price: 8500,
    unit: "per yard",
    vendor: "Rhovic Textiles",
    category: "Fabrics",
    badge: "Top Rated",
  },
  {
    id: "p2",
    name: "Wireless Earbuds Pro",
    price: 32000,
    unit: "per item",
    vendor: "GadgetHub",
    category: "Electronics",
    badge: "Best Deal",
  },
  {
    id: "p3",
    name: "Luxury Body Oil – 250ml",
    price: 12000,
    unit: "per bottle",
    vendor: "Glow & Co",
    category: "Beauty",
    badge: "New",
  },
  {
    id: "p4",
    name: "Minimalist Sneakers (Unisex)",
    price: 28000,
    unit: "per pair",
    vendor: "Urban Kicks",
    category: "Fashion",
  },
  {
    id: "p5",
    name: "Modern Table Lamp",
    price: 18000,
    unit: "per item",
    vendor: "HomeLine",
    category: "Home",
  },
  {
    id: "p6",
    name: "Industrial Safety Gloves",
    price: 9500,
    unit: "per pair",
    vendor: "WorkSupply",
    category: "Industrial",
  },
];

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Badge({ text }: { text: NonNullable<Product["badge"]> }) {
  const cls =
    text === "Top Rated"
      ? "bg-primary text-white"
      : text === "Best Deal"
      ? "bg-accent text-black"
      : "bg-black text-white";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {text}
    </span>
  );
}

export default function ProductGrid({
  title = "Popular right now",
  products = defaultProducts,
}: ProductGridProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
          {title}
        </h2>
        <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
          Shop
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:shadow-md"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-gray-900">
                    {p.name}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    by <span className="font-semibold">{p.vendor}</span> •{" "}
                    {p.category}
                  </div>
                </div>
                {p.badge ? <Badge text={p.badge} /> : null}
              </div>

              <div className="mt-4 rounded-xl bg-black/5 p-3">
                <div className="text-xs text-gray-600">Price</div>
                <div className="mt-1 text-lg font-extrabold text-gray-900">
                  {formatNGN(p.price)}
                </div>
                {p.unit ? (
                  <div className="text-xs text-gray-500">{p.unit}</div>
                ) : null}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  View details
                </span>
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-black transition group-hover:brightness-105">
                  Add to cart
                </span>
              </div>
            </div>

            <div className="h-[3px] bg-primary" />
          </Link>
        ))}
      </div>
    </section>
  );
}