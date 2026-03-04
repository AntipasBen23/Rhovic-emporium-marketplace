import Link from "next/link";

export default function VendorEntryPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-gray-700">
              <span className="h-2 w-2 rounded-full bg-accent" />
              For vendors
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Sell on RHOVIC Marketplace
            </h1>

            <p className="text-sm leading-6 text-gray-600">
              List products, manage stock in real time, fulfill orders, and track
              commissions + payouts — all in a clean vendor dashboard.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/vendor/register" className="btn-primary w-full sm:w-auto">
                Register as a Vendor
              </Link>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-xl bg-black/5 p-3">
                <div className="text-sm font-extrabold text-gray-900">Storefront</div>
                <div className="mt-1 text-xs text-gray-600">
                  Your vendor page + badge system.
                </div>
              </div>
              <div className="rounded-xl bg-black/5 p-3">
                <div className="text-sm font-extrabold text-gray-900">Orders</div>
                <div className="mt-1 text-xs text-gray-600">
                  Track orders, statuses, and fulfillment.
                </div>
              </div>
              <div className="rounded-xl bg-black/5 p-3">
                <div className="text-sm font-extrabold text-gray-900">Payouts</div>
                <div className="mt-1 text-xs text-gray-600">
                  Transparent commission + payout tracking.
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white sm:p-8">
            <div className="space-y-4">
              <div className="text-sm font-semibold text-white/90">
                What you get out of the box
              </div>

              <ul className="space-y-2 text-sm text-white/85">
                <li>• Self-service product listings + stock</li>
                <li>• Multi-category selling (category-agnostic)</li>
                <li>• Order management + basic analytics</li>
                <li>• Commission calculation + payout balances</li>
                <li>• Dispute tools + trust controls (admin)</li>
              </ul>

              <div className="rounded-2xl bg-white/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Recommended</span>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-black">
                    Vendor Pro
                  </span>
                </div>
                <div className="mt-2 text-sm text-white/80">
                  For growing sellers who want visibility boosts and better support.
                </div>
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

      <section className="rounded-2xl border border-black/10 bg-black/5 p-6">
        <h2 className="text-sm font-extrabold text-gray-900">
          Already a vendor?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Jump into your dashboard to manage products, orders, and payouts.
        </p>
        <div className="mt-4">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-extrabold text-white transition hover:brightness-105"
          >
            Go to Vendor Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}