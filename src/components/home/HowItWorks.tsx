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

function StepCard({ s, i }: { s: Step, i: number }) {
  return (
    <div
      className="group rounded-2xl glass-panel p-6 shadow-sm transition-all duration-300 hover-lift border border-black/[0.03] dark:border-white/[0.03]"
      style={{ animationDelay: `${i * 100}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
          {s.tag}
        </div>
        <div className="min-w-0">
          <div className="text-base font-black text-gray-950 font-heading dark:text-white leading-tight">
            {s.title}
          </div>
          <div className="mt-2 text-sm leading-relaxed font-medium text-gray-600 dark:text-gray-400">
            {s.desc}
          </div>
        </div>
      </div>
      <div className="mt-6 h-1 w-0 bg-accent transition-all duration-500 group-hover:w-full rounded-full opacity-30" />
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="space-y-10 animate-fade-up">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-gray-950 font-heading dark:text-white sm:text-4xl">
            How it works
          </h2>
          <p className="max-w-md text-base font-medium text-gray-600 dark:text-gray-400">
            A professional commerce engine designed for scalability, transparency, and trust.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/shop"
            className="group inline-flex items-center justify-center rounded-xl border-2 border-black/10 bg-white px-6 py-3 text-sm font-black text-gray-900 transition-all hover:bg-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white dark:hover:bg-black/40"
          >
            Shop now
          </Link>
          <Link
            href="/vendor"
            className="btn-accent"
          >
            Start selling
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Buyer flow */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-black/[0.02] dark:border-white/5 dark:bg-white/[0.02] group">
          <div className="p-8 sm:p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary">For buyers</div>
                <div className="text-xl font-black text-gray-950 font-heading dark:text-white">
                  Find. Add. Pay. Track.
                </div>
              </div>
              <span className="rounded-full bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">
                Premium flow
              </span>
            </div>

            <div className="grid gap-4">
              {buyerSteps.map((s, i) => (
                <StepCard key={s.title} s={s} i={i} />
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-primary/20" />
        </div>

        {/* Vendor flow */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-black/[0.02] dark:border-white/5 dark:bg-white/[0.02] group">
          <div className="p-8 sm:p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-accent">For vendors</div>
                <div className="text-xl font-black text-gray-950 font-heading dark:text-white">
                  List. Manage. Earn.
                </div>
              </div>
              <span className="rounded-full bg-accent px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black shadow-lg shadow-accent/20">
                Live dashboard
              </span>
            </div>

            <div className="grid gap-4">
              {vendorSteps.map((s, i) => (
                <StepCard key={s.title} s={s} i={i + 3} />
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-accent/20" />
        </div>
      </div>
    </section>
  );
}
