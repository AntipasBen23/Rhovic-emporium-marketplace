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
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
          Browse categories
        </h2>
        <Link
          href="/shop"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                "border",
                isActive
                  ? "border-transparent bg-primary text-white"
                  : "border-black/10 bg-white text-gray-800 hover:bg-black/5",
              ].join(" ")}
              aria-pressed={isActive}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Small helper row */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Curated vendors
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Real-time stock
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-black" />
          One checkout
        </span>
      </div>
    </section>
  );
}