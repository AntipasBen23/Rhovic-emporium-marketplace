import Link from "next/link";

type TrustItem = {
  title: string;
  desc: string;
};

const trustItems: TrustItem[] = [
  {
    title: "Paystack-secured payments",
    desc: "Protected checkout with trusted payment rails.",
  },
  {
    title: "Verified vendors",
    desc: "Seller onboarding + approval for quality control.",
  },
  {
    title: "Real-time stock updates",
    desc: "Inventory changes reflect instantly on listings.",
  },
  {
    title: "Transparent payouts",
    desc: "Commission + vendor earnings tracked per order.",
  },
];

export default function TrustBar() {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
              Why buyers trust RHOVIC
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Clean marketplace experience backed by strong transaction controls.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-black/5"
          >
            Explore deals
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-black/5 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-gray-900">
                    {item.title}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-gray-600">
                    {item.desc}
                  </div>
                </div>

                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-black">
                  ✓
                </span>
              </div>

              <div className="mt-4 h-[2px] w-full bg-primary/20" />
            </div>
          ))}
        </div>

        {/* Jumia-style highlight strip */}
        <div className="rounded-2xl bg-primary p-5 text-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white/90">
                Premium marketplace promise
              </div>
              <div className="text-lg font-extrabold tracking-tight">
                One checkout. Multiple vendors. Central trust.
              </div>
            </div>

            <Link
              href="/vendor"
              className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-extrabold text-black transition hover:brightness-105"
            >
              Sell on RHOVIC
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}