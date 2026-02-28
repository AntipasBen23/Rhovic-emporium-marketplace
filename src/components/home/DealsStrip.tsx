import Link from "next/link";

type Deal = {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  vendor: string;
  tag?: "Flash" | "Hot" | "Limited";
};

const deals: Deal[] = [
  {
    id: "d1",
    title: "Wireless Earbuds Pro",
    price: 32000,
    oldPrice: 45000,
    vendor: "GadgetHub",
    tag: "Flash",
  },
  {
    id: "d2",
    title: "Premium Cotton Fabric (Ankara)",
    price: 8500,
    oldPrice: 10500,
    vendor: "Rhovic Textiles",
    tag: "Hot",
  },
  {
    id: "d3",
    title: "Luxury Body Oil – 250ml",
    price: 12000,
    oldPrice: 15000,
    vendor: "Glow & Co",
    tag: "Limited",
  },
  {
    id: "d4",
    title: "Modern Table Lamp",
    price: 18000,
    oldPrice: 22000,
    vendor: "HomeLine",
  },
];

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Tag({ t }: { t: NonNullable<Deal["tag"]> }) {
  const cls =
    t === "Flash"
      ? "bg-accent text-black"
      : t === "Hot"
      ? "bg-primary text-white"
      : "bg-black text-white";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${cls}`}>
      {t}
    </span>
  );
}

export default function DealsStrip() {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="flex items-center justify-between gap-4 bg-primary px-5 py-4 text-white">
        <div>
          <div className="text-xs font-semibold text-white/80">Today’s picks</div>
          <div className="text-lg font-extrabold tracking-tight">
            Deals you don’t want to miss
          </div>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-extrabold text-black transition hover:brightness-105"
        >
          See all deals
        </Link>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {deals.map((d) => {
          const pct =
            d.oldPrice && d.oldPrice > d.price
              ? Math.round(((d.oldPrice - d.price) / d.oldPrice) * 100)
              : null;

          return (
            <Link
              key={d.id}
              href={`/product/${d.id}`}
              className="group rounded-2xl border border-black/10 bg-white p-4 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold text-gray-900">
                    {d.title}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    by <span className="font-semibold">{d.vendor}</span>
                  </div>
                </div>
                {d.tag ? <Tag t={d.tag} /> : null}
              </div>

              <div className="mt-4 rounded-xl bg-black/5 p-3">
                <div className="text-xs text-gray-600">Deal price</div>
                <div className="mt-1 text-lg font-extrabold text-gray-900">
                  {formatNGN(d.price)}
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs">
                  {d.oldPrice ? (
                    <span className="text-gray-500 line-through">
                      {formatNGN(d.oldPrice)}
                    </span>
                  ) : null}
                  {pct !== null ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 font-extrabold text-black">
                      -{pct}%
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  View deal
                </span>
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-black transition group-hover:brightness-105">
                  Add
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="h-[3px] bg-primary" />
    </section>
  );
}