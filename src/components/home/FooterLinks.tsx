import Link from "next/link";

type Column = {
  title: string;
  links: { label: string; href: string }[];
};

const columns: Column[] = [
  {
    title: "Marketplace",
    links: [
      { label: "Shop all products", href: "/shop" },
      { label: "Top deals", href: "/shop?filter=deals" },
      { label: "New arrivals", href: "/shop?filter=new" },
      { label: "Categories", href: "/shop#categories" },
    ],
  },
  {
    title: "Sell on RHOVIC",
    links: [
      { label: "Vendor registration", href: "/vendor" },
      { label: "Pricing plans", href: "/pricing" },
      { label: "Vendor dashboard", href: "/vendor/dashboard" },
      { label: "Commission structure", href: "/pricing#commission" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "/support" },
      { label: "Order tracking", href: "/orders" },
      { label: "Returns & refunds", href: "/support#returns" },
      { label: "Dispute resolution", href: "/support#disputes" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About RHOVIC", href: "/about" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];

export default function FooterLinks() {
  return (
    <section className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-premium animate-fade-up dark:border-white/5 dark:bg-white/5">
      <div className="p-8 sm:p-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col, i) => (
            <div key={col.title} className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.15em] text-gray-950 font-heading dark:text-white">
                {col.title}
              </h4>

              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-gray-600 transition-all hover:text-primary hover:translate-x-1 inline-block dark:text-gray-400 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="h-[1px] w-12 bg-primary/30" />
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-8 border-t border-black/5 pt-10 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div className="space-y-2">
            <div className="text-xl font-black tracking-tighter text-gray-950 font-heading dark:text-white">
              RHOVIC <span className="text-primary">EMPORIUM</span>
            </div>
            <p className="max-w-xs text-xs font-medium leading-relaxed text-gray-500">
              Modern commerce infrastructure for the next generation of retailers.
              Unified. Secured. Verified.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Secure checkout
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Transparent commission
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
              Vendor dashboard
            </span>
          </div>
        </div>
      </div>

      <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
    </section>
  );
}