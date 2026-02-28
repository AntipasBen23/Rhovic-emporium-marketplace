"use client";

import { useState } from "react";
import Link from "next/link";

type Plan = {
  name: string;
  monthly: string;
  yearly: string;
  commission: string;
  features: string[];
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Vendor",
    monthly: "$19 / month",
    yearly: "$190 / year",
    commission: "10% commission",
    features: [
      "Up to 50 product listings",
      "Full storefront access",
      "Order management dashboard",
      "Basic analytics",
      "Standard support",
    ],
  },
  {
    name: "Vendor Pro",
    monthly: "$49 / month",
    yearly: "$490 / year",
    commission: "Reduced commission",
    highlight: true,
    features: [
      "Unlimited product listings",
      "Advanced analytics dashboard",
      "Built-in marketing tools",
      "Automatic promotional placements",
      "Multiple staff accounts",
      "Priority support",
    ],
  },
  {
    name: "Vendor Prime",
    monthly: "$99 / month",
    yearly: "$990 / year",
    commission: "Lowest commission rate",
    features: [
      "Unlimited products",
      "Unlimited staff accounts",
      "Advanced automation tools",
      "Variable product configurations",
      "Aggressive marketing boosts",
      "Early access to new features",
      "Dedicated support",
    ],
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Vendor Subscription Plans
        </h1>
        <p className="text-sm text-gray-600">
          Choose the plan that matches your growth stage. Scale when ready.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex rounded-full border border-black/10 bg-white p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              billing === "monthly"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-black/5"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              billing === "yearly"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-black/5"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col justify-between rounded-2xl border p-6 transition ${
              plan.highlight
                ? "border-primary bg-primary text-white"
                : "border-black/10 bg-white"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-extrabold text-black">
                Most Popular
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h2
                  className={`text-xl font-extrabold ${
                    plan.highlight ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h2>
                <p
                  className={`mt-2 text-lg font-semibold ${
                    plan.highlight ? "text-white" : "text-gray-900"
                  }`}
                >
                  {billing === "monthly" ? plan.monthly : plan.yearly}
                </p>
                <p
                  className={`text-sm ${
                    plan.highlight ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  {plan.commission}
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span
                      className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                        plan.highlight
                          ? "bg-accent text-black"
                          : "bg-primary text-white"
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={
                        plan.highlight ? "text-white/90" : "text-gray-700"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <Link
                href="/vendor/register"
                className={`inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-extrabold transition ${
                  plan.highlight
                    ? "bg-accent text-black hover:brightness-105"
                    : "bg-primary text-white hover:brightness-105"
                }`}
              >
                Get Started
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="rounded-2xl border border-black/10 bg-black/5 p-6 text-center text-sm text-gray-700">
        All plans include secure Paystack integration, automated commission
        tracking, and access to RHOVIC’s marketplace infrastructure.
      </div>
    </div>
  );
}