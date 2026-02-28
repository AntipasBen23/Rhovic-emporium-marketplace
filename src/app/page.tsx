import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  unit?: string; // e.g. "per yard", "per item"
  vendor: string;
  category: string;
  badge?: "Top Rated" | "New" | "Best Deal";
};

const categories = [
  "All",
  "Fashion",
  "Electronics",
  "Beauty",
  "Home",
  "Industrial",
  "Fabrics",
];

const products: Product[] = [
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
  const styles =
    text === "Top Rated"
      ? "bg-primary text-white"
      : text === "Best Deal"
      ? "bg-accent text-black"
      : "bg-black text-white";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>
      {text}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-gray-700">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Premium multi-vendor marketplace
            </p>

            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Curated shopping across trusted vendors — in one checkout.
            </h1>

            <p className="max-w-xl text-pretty text-sm leading-6 text-gray-600 sm:text-base">
              Discover products across categories with a clean, premium experience.
              Vendors manage their inventory and payouts transparently.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn-primary w-full sm:w-auto">
                Start Shopping
              </Link>
              <Link
                href="/vendor"
                className="w-full rounded-md border border-black/10 px-6 py-3 text-center font-semibold text-gray-900 transition hover:bg-black/5 sm:w-auto"
              >
                Become a Vendor
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs text-gray-600 sm:max-w-md">
              <div className="rounded-xl bg-black/5 p-3">
                <div className="font-semibold text-gray-900">Paystack</div>
                <div>Secure checkout</div>
              </div>
              <div className="rounded-xl bg-black/5 p-3">
                <div className="font-semibold text-gray-900">Commission</div>
                <div>Auto-calculated</div>
              </div>
              <div className="rounded-xl bg-black/5 p-3">
                <div className="font-semibold text-gray-900">Stock</div>
                <div>Real-time updates</div>
              </div>
            </div>
          </div>

          {/* Right visual block (no images yet) */}
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-primary">
            <div className="p-6 sm:p-8">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-white/90">
                  Featured vendor
                </div>
                <div className="text-2xl font-extrabold tracking-tight text-white">
                  Rhovic Textiles
                </div>
                <div className="text-sm leading-6 text-white/80">
                  Premium fabrics and materials — curated, photographed, and stocked
                  for quick fulfillment.
                </div>

                <div className="mt-5 rounded-2xl bg-white/10 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">This week</span>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-black">
                      Gold Picks
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-white/80">
                    Best sellers across fabrics, beauty, and gadgets — fast shipping
                    options set by vendors.
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent blur-3xl" />
              <div className="absolute -left-24 -bottom-24 h-60 w-60 rounded-full bg-black blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
            Browse categories
          </h2>
          <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-black/5"
              type="button"
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Product grid */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
            Popular right now
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
    </div>
  );
}