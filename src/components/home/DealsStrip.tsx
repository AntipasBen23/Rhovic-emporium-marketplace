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
      ? "bg-accent text-black shadow-lg shadow-accent/20"
      : t === "Hot"
        ? "bg-primary text-white shadow-lg shadow-primary/20"
        : "bg-black text-white dark:bg-white dark:text-black";
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${cls}`}>
      {t}
    </span>
  );
}

export default function DealsStrip() {
  return (
    <section className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-premium animate-fade-up dark:border-white/5 dark:bg-white/5">
      <div className="flex flex-col gap-6 bg-primary p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Limited Opportunities</div>
          <div className="text-2xl font-black tracking-tight font-heading sm:text-3xl">
            Live Flash Deals
          </div>
        </div>

        <Link
          href="/shop"
          className="group inline-flex items-center justify-center rounded-xl bg-accent px-8 py-3 text-sm font-black text-black transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent/20"
        >
          See all inventory
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </Link>
      </div>

      <div className="grid gap-6 p-8 sm:grid-cols-2 lg:grid-cols-4 lg:p-10">
        {deals.map((d, i) => {
          const pct =
            d.oldPrice && d.oldPrice > d.price
              ? Math.round(((d.oldPrice - d.price) / d.oldPrice) * 100)
              : null;

          return (
            <Link
              key={d.id}
              href={`/product/${d.id}`}
              className="group flex flex-col hover-lift rounded-[2rem] border border-black/[0.03] bg-black/[0.01] p-6 dark:border-white/[0.03] dark:bg-white/[0.01] transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-base font-black text-gray-950 font-heading dark:text-white group-hover:text-primary transition-colors leading-tight">
                    {d.title}
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    VENDOR: <span className="text-primary">{d.vendor}</span>
                  </div>
                </div>
                {d.tag ? <Tag t={d.tag} /> : null}
              </div>

              <div className="mt-8 rounded-3xl glass-panel p-5 border border-black/[0.03] dark:border-white/[0.03]">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Exclusive Price</div>
                <div className="mt-1 text-2xl font-black text-gray-950 dark:text-white leading-none">
                  {formatNGN(d.price)}
                </div>

                <div className="mt-2 flex items-center gap-3">
                  {d.oldPrice ? (
                    <span className="text-xs font-bold text-gray-400 line-through">
                      {formatNGN(d.oldPrice)}
                    </span>
                  ) : null}
                  {pct !== null ? (
                    <span className="inline-flex rounded-full bg-accent/20 px-2.5 py-1 text-[10px] font-black text-black dark:text-accent">
                      -{pct}%
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm font-black text-primary uppercase tracking-widest">
                  Secure item
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-black shadow-lg shadow-accent/10 transition-all group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="h-1.5 w-full bg-accent opacity-20" />
    </section>
  );
}
