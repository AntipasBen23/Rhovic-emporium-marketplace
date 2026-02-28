import Link from "next/link";

export default function VendorCTA() {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-gray-700">
            <span className="h-2 w-2 rounded-full bg-accent" />
            For vendors
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Sell on RHOVIC — keep your brand, gain distribution.
          </h2>

          <p className="text-sm leading-6 text-gray-600">
            RHOVIC gives you a premium storefront, order tools, real-time stock
            control, and transparent payout tracking — so you focus on selling.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/vendor" className="btn-primary w-full sm:w-auto">
              Become a Vendor
            </Link>
            <Link
              href="/pricing"
              className="w-full rounded-md border border-black/10 px-6 py-3 text-center font-semibold text-gray-900 transition hover:bg-black/5 sm:w-auto"
            >
              View pricing plans
            </Link>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            <div className="rounded-xl bg-black/5 p-3">
              <div className="text-sm font-extrabold text-gray-900">
                Self-service
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Manage products, stock, and orders.
              </div>
            </div>
            <div className="rounded-xl bg-black/5 p-3">
              <div className="text-sm font-extrabold text-gray-900">
                Commission logic
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Auto-calculated per order item.
              </div>
            </div>
            <div className="rounded-xl bg-black/5 p-3">
              <div className="text-sm font-extrabold text-gray-900">
                Payout tracking
              </div>
              <div className="mt-1 text-xs text-gray-600">
                See earnings + payout status clearly.
              </div>
            </div>
          </div>
        </div>

        {/* Right highlight panel */}
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white sm:p-8">
          <div className="space-y-4">
            <div className="text-sm font-semibold text-white/90">
              Marketplace infrastructure
            </div>

            <div className="text-3xl font-extrabold tracking-tight">
              RHOVIC is your trust + transaction layer.
            </div>

            <p className="text-sm leading-6 text-white/80">
              You get discovery, checkout, and customer trust — without building a
              payment system, commission engine, or admin tooling from scratch.
            </p>

            <div className="rounded-2xl bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Seller benefits</span>
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-black">
                  Premium
                </span>
              </div>

              <ul className="mt-3 space-y-2 text-sm text-white/85">
                <li>• Multi-category listings (no vendor restrictions)</li>
                <li>• Vendor storefront + badge system</li>
                <li>• Real-time stock + order dashboard</li>
                <li>• Dispute tools + payout controls</li>
              </ul>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent blur-3xl" />
            <div className="absolute -left-24 -bottom-24 h-60 w-60 rounded-full bg-black blur-3xl" />
          </div>
        </div>
      </div>

      <div className="h-[3px] bg-primary" />
    </section>
  );
}