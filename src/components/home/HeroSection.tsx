import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white dark:border-white/5 dark:bg-white/5 transition-all duration-500 shadow-premium">
      <div className="grid gap-12 p-8 sm:p-12 md:grid-cols-2 md:items-center">
        <div className="space-y-8 animate-fade-up">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider animate-fade-up delay-100">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Verified Commerce Infrastructure
            </p>

            <h1 className="text-balance text-4xl font-black tracking-tight text-gray-950 sm:text-6xl font-heading leading-[1.1] animate-fade-up delay-200 dark:text-white">
              The Next Era of <br />
              <span className="text-primary italic">Trusted</span> Marketplaces.
            </h1>

            <p className="max-w-xl text-pretty text-lg leading-relaxed text-gray-700 sm:text-xl animate-fade-up delay-300 dark:text-gray-300">
              Unified checkout across curated vendors. Professional inventory management.
              Real-time payouts. All in one place.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row animate-fade-up delay-300">
            <Link href="/shop" className="btn-primary group">
              Start Shopping
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>

            <Link
              href="/vendor"
              className="group inline-flex items-center justify-center rounded-xl border-2 border-black/10 px-8 py-3.5 text-center font-bold text-gray-900 transition-all hover:bg-black/5 hover:border-black/20 sm:w-auto dark:border-white/10 dark:text-gray-100 dark:hover:bg-white/5 dark:hover:border-white/20"
            >
              Become a Vendor
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 animate-fade-up delay-300">
            {[
              { label: "Secured", val: "Paystack" },
              { label: "Verified", val: "Curated" },
              { label: "Live", val: "Stock" }
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-black/5 p-4 transition-transform hover:scale-105 dark:bg-white/5">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">{item.label}</div>
                <div className="mt-1 font-bold text-gray-950 dark:text-white">{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right visual block */}
        <div className="relative aspect-square md:aspect-auto md:h-[500px] overflow-hidden rounded-[2rem] border border-black/5 bg-primary shadow-2xl animate-fade-up delay-200">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-dark opacity-90" />

          <div className="relative h-full flex flex-col justify-end p-8 sm:p-10">
            <div className="space-y-4 max-w-sm">
              <div className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md">
                Spotlight
              </div>

              <div className="text-3xl font-black tracking-tight text-white font-heading">
                Rhovic Textiles
              </div>

              <p className="text-base leading-relaxed text-white/80">
                Premium fabrics and bespoke materials — curated, professionally photographed, and stocked for instant fulfillment.
              </p>

              <div className="rounded-2xl bg-white/10 p-5 text-white backdrop-blur-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-white/60">Featured collection</span>
                  <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-black text-black uppercase tracking-tight">
                    Premium Picks
                  </span>
                </div>
                <div className="text-sm font-bold">
                  Bestselling fabrics, accessories, and electronics — direct from verified source.
                </div>
              </div>
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent opacity-20 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-black opacity-30 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}