import Link from "next/link";

export default function VendorCTA() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white dark:border-white/5 dark:bg-white/5 transition-all duration-500 shadow-premium animate-fade-up">
      <div className="grid gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Scale your business
            </div>

            <h2 className="text-3xl font-black tracking-tight text-gray-950 font-heading dark:text-white sm:text-5xl leading-tight">
              Professional Tools for <br />
              <span className="text-primary italic">Modern Builders.</span>
            </h2>

            <p className="max-w-md text-base leading-relaxed font-medium text-gray-700 dark:text-gray-300">
              RHOVIC provides the infrastructure you need to sell at scale. Unified checkouts,
              automated commissions, and professional dashboard tools.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/vendor" className="btn-primary group">
              Become a Vendor
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            {[
              { title: "Self-service", desc: "Full inventory control." },
              { title: "Smart Logic", desc: "Auto-commissions per item." },
              { title: "Live Tracking", desc: "Real-time payout dashboard." }
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-black/5 p-4 dark:bg-white/5">
                <div className="text-xs font-black text-gray-950 dark:text-white uppercase tracking-tight">
                  {item.title}
                </div>
                <div className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right highlight panel */}
        <div className="relative aspect-square md:aspect-auto md:h-[500px] overflow-hidden rounded-[2rem] bg-dark p-8 text-white sm:p-12 shadow-2xl border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-tr from-dark via-primary/50 to-primary opacity-40" />

          <div className="relative h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/80">
                Marketplace OS
              </div>

              <div className="text-3xl font-black tracking-tight font-heading leading-tight">
                Your trust + transaction <br /> layer, solved.
              </div>

              <p className="text-base leading-relaxed text-white/70">
                Forget building payment gateways and commission engines. Focus on your products while RHOVIC handles the heavy lifting.
              </p>
            </div>

            <div className="rounded-[2rem] glass-panel p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Ecosystem Benefits</span>
                <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-black text-black uppercase tracking-widest">
                  Verified
                </span>
              </div>

              <ul className="grid grid-cols-1 gap-3">
                {[
                  "Global Checkout (One Cart)",
                  "Vendor-Specific Storefronts",
                  "Automated Fee Distribution",
                  "Advanced Dispute Resolution"
                ].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/90">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </span>
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent opacity-10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-primary opacity-20 blur-3xl" />
          </div>
        </div>
      </div>

      <div className="h-1.5 w-full bg-accent opacity-10" />
    </section>
  );
}
