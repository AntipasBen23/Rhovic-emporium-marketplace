import Link from "next/link";

const GREEN = "rgb(18,77,52)";
const GOLD = "rgb(255,183,3)";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-gray-50 dark:bg-[rgb(14,22,18)] border border-gray-100 dark:border-white/5 shadow-premium">
      <div className="grid gap-0 md:grid-cols-2 md:items-stretch min-h-[520px]">

        {/* LEFT — brand text */}
        <div className="flex flex-col justify-center gap-8 p-8 sm:p-12 animate-fade-up">

          {/* Badge */}
          <p
            className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em]"
            style={{ background: "rgba(18,77,52,0.08)", color: GREEN }}
          >
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: GOLD }} />
            Verified Commerce Infrastructure
          </p>

          {/* Heading */}
          <h1 className="font-heading text-[2.75rem] sm:text-6xl font-black tracking-tight leading-[1.05] text-gray-950 dark:text-white">
            The Next Era of{" "}
            <br />
            <span style={{ color: GREEN }} className="italic">Trusted</span>{" "}
            Marketplaces.
          </h1>

          {/* Sub */}
          <p className="max-w-lg text-lg sm:text-xl leading-relaxed font-semibold text-gray-700 dark:text-gray-300">
            Unified checkout across curated vendors. Professional inventory management.
            Real-time payouts.{" "}
            <span
              className="font-black underline underline-offset-4"
              style={{ color: GREEN, textDecorationColor: GOLD }}
            >
              All in one place.
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/shop" className="btn-primary group">
              Start Shopping
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-1">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/vendor"
              className="inline-flex items-center justify-center rounded-xl border-2 px-8 py-3.5 font-black text-center transition-all"
              style={{ borderColor: "rgba(18,77,52,0.25)", color: GREEN }}
            >
              Become a Vendor
            </Link>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Secured", val: "Paystack" },
              { label: "Verified", val: "Curated" },
              { label: "Live", val: "Stock" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 shadow-sm"
              >
                <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: GREEN }}>
                  {item.label}
                </div>
                <div className="mt-1 font-black text-gray-950 dark:text-white text-sm">
                  {item.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — green spotlight panel */}
        <div
          className="relative overflow-hidden animate-fade-up delay-200 rounded-b-[2.5rem] md:rounded-b-none md:rounded-r-[2.5rem] min-h-[320px]"
          style={{ background: `linear-gradient(135deg, ${GREEN} 0%, rgb(10,46,33) 100%)` }}
        >
          {/* Gold glow blob */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl opacity-20"
            style={{ background: GOLD }}
          />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-black opacity-25 blur-3xl" />

          {/* Content */}
          <div className="relative flex h-full flex-col justify-end p-8 sm:p-10">
            <div className="space-y-4 max-w-sm">

              {/* Gold badge */}
              <span
                className="inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"
                style={{ background: GOLD, color: "#111" }}
              >
                Spotlight
              </span>

              {/* Vendor name */}
              <div
                className="font-heading text-3xl font-black tracking-tight text-white"
                style={{ textDecoration: "underline", textDecorationColor: GOLD, textDecorationThickness: "3px", textUnderlineOffset: "8px" }}
              >
                Rhovic Textiles
              </div>

              <p className="text-base leading-relaxed font-medium text-white/90">
                Premium fabrics and bespoke materials — curated, professionally photographed, and stocked for instant fulfillment.
              </p>

              <div className="rounded-2xl backdrop-blur-xl border border-white/20 bg-white/10 p-5 text-white shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    Verified Source
                  </span>
                  <span
                    className="rounded-full border px-3 py-1 text-[10px] font-black uppercase"
                    style={{ borderColor: `${GOLD}60`, color: GOLD, background: `${GOLD}15` }}
                  >
                    AUTHENTIC
                  </span>
                </div>
                <div className="text-sm font-bold leading-snug">
                  Bestselling fabrics, accessories, and electronics — direct from verified source.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}