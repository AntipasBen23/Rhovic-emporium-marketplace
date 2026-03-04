"use client";

import Link from "next/link";
import { useState } from "react";

type CategoryPillsProps = {
  categories?: string[];
};

const defaultCategories = [
  "All",
  "Fashion",
  "Electronics",
  "Beauty",
  "Home",
  "Industrial",
  "Fabrics",
];

export default function CategoryPills({
  categories = defaultCategories,
}: CategoryPillsProps) {
  const [active, setActive] = useState(categories[0] ?? "All");

  return (
    <section className="space-y-6 animate-fade-up delay-300">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-black tracking-tight text-gray-950 font-heading dark:text-white">
          Browse categories
        </h2>
        <Link
          href="/shop"
          className="text-sm font-bold text-primary hover:underline underline-offset-4"
        >
          View all
        </Link>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {categories.map((c, i) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={[
                "rounded-xl px-5 py-2.5 text-sm font-black transition-all duration-300",
                "border hover-lift shadow-sm",
                isActive
                  ? "border-transparent bg-primary text-white shadow-md shadow-primary/30"
                  : "border-black/10 bg-white text-gray-950 hover:bg-primary/5 hover:border-primary/20 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:hover:bg-white/10",
              ].join(" ")}
              style={{ animationDelay: `${i * 50}ms` }}
              aria-pressed={isActive}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Small helper row */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Curated vendors
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Real-time stock
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-950 dark:bg-gray-100" />
          One checkout
        </span>
      </div>
    </section>
  );
}
