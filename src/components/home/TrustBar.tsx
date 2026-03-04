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
    <section className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white dark:border-white/5 dark:bg-white/5 transition-all duration-500 shadow-premium animate-fade-up">
      <div className="flex flex-col gap-8 p-8 sm:p-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-gray-950 font-heading dark:text-white">
              Why buyers trust RHOVIC
            </h2>
            <p className="max-w-md text-base font-medium text-gray-600 dark:text-gray-400">
              Clean marketplace experience backed by strong transaction controls and verified partners.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-gray-900 transition-all hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Explore deals
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, i) => (
            <div
              key={item.title}
              className="group rounded-2xl glass-panel p-6 shadow-sm transition-all duration-300 hover-lift border border-black/[0.03] dark:border-white/[0.03]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex flex-col items-start gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </span>

                <div className="min-w-0">
                  <div className="text-base font-black text-gray-950 dark:text-white font-heading tracking-tight">
                    {item.title}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed font-medium text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </div>
                </div>
              </div>

              <div className="mt-6 h-1 w-0 bg-accent transition-all duration-500 group-hover:w-full rounded-full" />
            </div>
          ))}
        </div>

        {/* Highlight strip */}
        <div className="relative overflow-hidden rounded-3xl bg-primary p-1 gap-2 border border-primary dark:border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-dark to-primary opacity-50" />
          <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                Premium Infrastructure
              </div>
              <div className="text-2xl font-black tracking-tight text-white font-heading sm:text-3xl">
                One checkout. Central trust. <br className="hidden sm:block" />
                <span className="text-accent underline decoration-accent/30 underline-offset-8 transition-all hover:decoration-accent/60">Enterprise ready.</span>
              </div>
            </div>

            <Link
              href="/vendor"
              className="inline-flex items-center justify-center rounded-2xl bg-accent px-8 py-4 text-base font-black text-black transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent/20 active:scale-95"
            >
              Sell on RHOVIC
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
