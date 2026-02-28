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
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-sm font-extrabold tracking-tight text-gray-900">
                {col.title}
              </h4>

              <ul className="space-y-2 text-sm text-gray-600">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition hover:text-primary hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="h-[2px] w-full bg-primary/20" />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-primary">RHOVIC</span>{" "}
            Marketplace — multi-vendor commerce infrastructure.
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Secure checkout</span>
            <span>•</span>
            <span>Transparent commission</span>
            <span>•</span>
            <span>Vendor-controlled inventory</span>
          </div>
        </div>
      </div>

      <div className="h-[3px] bg-primary" />
    </section>
  );
}