import Link from "next/link";

type Step = {
  title: string;
  desc: string;
  tag: string;
};

const buyerSteps: Step[] = [
  {
    tag: "1",
    title: "Browse across vendors",
    desc: "Search products by category, price, and vendor — all in one catalog.",
  },
  {
    tag: "2",
    title: "Add to cart (multi-vendor)",
    desc: "Mix items from different vendors in the same cart without friction.",
  },
  {
    tag: "3",
    title: "Pay once, track everything",
    desc: "Secure checkout, order updates, and a clean dashboard for tracking.",
  },
];

const vendorSteps: Step[] = [
  {
    tag: "1",
    title: "Register & get approved",
    desc: "Submit your business details. RHOVIC approves vendors to keep quality high.",
  },
  {
    tag: "2",
    title: "List products + manage stock",
    desc: "Upload products, set pricing units, and update inventory in real time.",
  },
  {
    tag: "3",
    title: "Fulfill orders + see payouts",
    desc: "Track orders, commissions, and payout balances transparently.",
  },
];

function StepCard({ s }: { s: Step }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-extrabold text-black">
          {s.tag}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-gray-900">{s.title}</div>
          <div className="mt-1 text-sm leading-6 text-gray-600">{s.desc}</div>
        </div>
      </div>
      <div className="mt-4 h-[2px] w-full bg-primary/20" />
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
            How it works
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Built like a marketplace engine — not a patched storefront.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-black/5"
          >
            Shop now
          </Link>
          <Link
            href="/vendor"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Start selling
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Buyer flow */}
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-black/5">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-600">For buyers</div>
                <div className="mt-1 text-base font-extrabold text-gray-900">
                  Find. Add. Pay. Track.
                </div>
              </div>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-white">
                Premium checkout
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {buyerSteps.map((s) => (
                <StepCard key={s.title} s={s} />
              ))}
            </div>
          </div>
          <div className="h-[3px] bg-primary" />
        </div>

        {/* Vendor flow */}
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-black/5">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-600">For vendors</div>
                <div className="mt-1 text-base font-extrabold text-gray-900">
                  Register. List. Sell. Earn.
                </div>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-black">
                Transparent payouts
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {vendorSteps.map((s) => (
                <StepCard key={s.title} s={s} />
              ))}
            </div>
          </div>
          <div className="h-[3px] bg-primary" />
        </div>
      </div>
    </section>
  );
}