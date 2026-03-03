import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5 transition-colors">
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-300">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Premium multi-vendor marketplace
          </p>

          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Curated shopping across trusted vendors — in one checkout.
          </h1>

          <p className="max-w-xl text-pretty text-sm leading-6 text-gray-600 sm:text-base dark:text-gray-400">
            Browse across categories, add items from multiple vendors, and pay once.
            Vendors manage inventory, orders, and payouts transparently.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn-primary w-full sm:w-auto">
              Start Shopping
            </Link>

            <Link
              href="/vendor"
              className="w-full rounded-md border border-black/10 px-6 py-3 text-center font-semibold text-gray-900 transition hover:bg-black/5 sm:w-auto dark:border-white/10 dark:text-gray-100 dark:hover:bg-white/5"
            >
              Become a Vendor
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-xs text-gray-600 sm:max-w-md dark:text-gray-400">
            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5">
              <div className="font-semibold text-gray-900 dark:text-white">Paystack</div>
              <div>Secure checkout</div>
            </div>
            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5">
              <div className="font-semibold text-gray-900 dark:text-white">Commission</div>
              <div>Auto-calculated</div>
            </div>
            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5">
              <div className="font-semibold text-gray-900 dark:text-white">Stock</div>
              <div>Real-time updates</div>
            </div>
          </div>
        </div>

        {/* Right visual block */}
        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-primary dark:border-white/10">
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
                  Best sellers across fabrics, beauty, and gadgets — with vendor-set
                  delivery options.
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
  );
}