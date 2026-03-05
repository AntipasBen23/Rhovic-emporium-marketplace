"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

const GREEN = "rgb(18,77,52)";

const COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "United Kingdom",
  "United States", "Canada", "Germany", "France", "Other",
];

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500";

const labelClass = "mb-1.5 block text-sm font-semibold text-gray-950 dark:text-gray-100";
const requiredStar = <span style={{ color: "red" }} aria-hidden="true"> *</span>;

type VendorApplication = {
  has_application: boolean;
  status?: "pending" | "approved" | "rejected" | "suspended";
  business_name?: string;
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && requiredStar}
      </label>
      {children}
    </div>
  );
}

export default function VendorRegisterPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const [application, setApplication] = useState<VendorApplication | null>(null);
  const [loadingState, setLoadingState] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopURL, setShopURL] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyID, setCompanyID] = useState("");
  const [vatID, setVatID] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountIBAN, setAccountIBAN] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [toastOk, setToastOk] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/signup?next=/vendor/register");
      return;
    }

    async function loadApplication() {
      try {
        setLoadingState(true);
        const data = await api.get<VendorApplication>("/vendor/application");
        if (data?.has_application && data.status === "approved") {
          router.replace("/vendor/dashboard");
          return;
        }
        setApplication(data);
      } finally {
        setLoadingState(false);
      }
    }

    loadApplication();
  }, [token, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setToast("");

    if (!agreed) {
      setToast("You must agree to the Terms & Conditions to continue.");
      setToastOk(false);
      return;
    }

    const required = [
      { val: firstName, name: "First Name" },
      { val: lastName, name: "Last Name" },
      { val: shopName, name: "Shop Name" },
      { val: phone, name: "Phone Number" },
      { val: street, name: "Street" },
      { val: city, name: "City" },
      { val: zipCode, name: "Post/ZIP Code" },
      { val: country, name: "Country" },
    ];

    const missing = required.find((f) => !f.val.trim());
    if (missing) {
      setToast(`${missing.name} is required.`);
      setToastOk(false);
      return;
    }

    setLoading(true);
    try {
      await api.post("/vendor/apply", {
        first_name: firstName,
        last_name: lastName,
        shop_name: shopName,
        shop_url: shopURL,
        phone,
        street,
        street2,
        city,
        zip_code: zipCode,
        country,
        state,
        company_name: companyName,
        company_id: companyID,
        vat_id: vatID,
        bank_name: bankName,
        account_iban: accountIBAN,
      });
      setToastOk(true);
      setToast("Application submitted successfully. Awaiting admin approval...");
      setTimeout(() => router.push("/vendor"), 1800);
    } catch (err: any) {
      setToastOk(false);
      setToast(err.message || "Application failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingState) {
    return <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-gray-600">Checking vendor status...</div>;
  }

  if (application?.has_application && application.status === "pending") {
    return (
      <section className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Application Submitted</h1>
        <p className="mt-2 text-sm text-gray-700">Your application is awaiting admin approval.</p>
        <div className="mt-4">
          <span className="inline-flex rounded-full bg-yellow-200 px-3 py-1 text-xs font-bold text-yellow-800">Status: pending</span>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-4xl">
            Vendor Application
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            Submit your details. Your store goes live after admin approval.
          </p>
        </div>
        <Link href="/vendor" className="text-sm font-bold hover:underline underline-offset-4" style={{ color: GREEN }}>
          ← Back
        </Link>
      </div>

      {toast && (
        <div
          className="rounded-xl border p-4 text-sm font-medium"
          style={
            toastOk
              ? { borderColor: "rgba(18,77,52,0.3)", background: "rgba(18,77,52,0.06)", color: GREEN }
              : { borderColor: "rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.05)", color: "#dc2626" }
          }
        >
          {toast}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-0">
        <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden shadow-sm">
          <div className="border-b border-gray-100 dark:border-white/10 p-6 space-y-4">
            <h2 className="font-heading text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Personal Information
            </h2>
            <Field label="First Name" required>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={inputClass} />
            </Field>
            <Field label="Last Name" required>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} required className={inputClass} />
            </Field>
          </div>

          <div className="border-b border-gray-100 dark:border-white/10 p-6 space-y-4">
            <h2 className="font-heading text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Shop Details
            </h2>
            <Field label="Shop Name" required>
              <input value={shopName} onChange={(e) => setShopName(e.target.value)} required className={inputClass} />
            </Field>
            <Field label="Shop URL" required>
              <input
                value={shopURL}
                onChange={(e) => setShopURL(e.target.value.replace(/\s+/g, "").toLowerCase())}
                required
                placeholder="yourshopslug"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                https://rhovic.store/<span className="font-bold text-gray-700 dark:text-gray-300">{shopURL || "yourshopslug"}</span>
              </p>
            </Field>
            <Field label="Phone Number" required>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+234..." className={inputClass} />
            </Field>
          </div>

          <div className="border-b border-gray-100 dark:border-white/10 p-6 space-y-4">
            <h2 className="font-heading text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Business Address
            </h2>
            <Field label="Street" required>
              <input value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="Street address" className={inputClass} />
            </Field>
            <Field label="Street 2">
              <input value={street2} onChange={(e) => setStreet2(e.target.value)} placeholder="Apartment, suite, unit etc. (optional)" className={inputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" required>
                <input value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Town / City" className={inputClass} />
              </Field>
              <Field label="Post/ZIP Code" required>
                <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} required placeholder="Postcode / Zip" className={inputClass} />
              </Field>
            </div>
            <Field label="Country" required>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">— Select a country —</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="State">
              <input value={state} onChange={(e) => setState(e.target.value)} className={inputClass} />
            </Field>
          </div>

          <div className="border-b border-gray-100 dark:border-white/10 p-6 space-y-4">
            <h2 className="font-heading text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Company &amp; Tax (optional)
            </h2>
            <Field label="Company Name">
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Company ID / EUID Number">
              <input value={companyID} onChange={(e) => setCompanyID(e.target.value)} className={inputClass} />
            </Field>
            <Field label="VAT / TAX ID">
              <input value={vatID} onChange={(e) => setVatID(e.target.value)} className={inputClass} />
            </Field>
          </div>

          <div className="p-6 space-y-4">
            <h2 className="font-heading text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Payout Information
            </h2>
            <Field label="Name of Bank">
              <input value={bankName} onChange={(e) => setBankName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Account / IBAN">
              <input value={accountIBAN} onChange={(e) => setAccountIBAN(e.target.value)} placeholder="Account number or IBAN" className={inputClass} />
            </Field>
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-green-800"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              I have read and agree to the{" "}
              <Link href="/terms" className="underline underline-offset-4 font-bold" style={{ color: GREEN }}>
                Terms &amp; Conditions
              </Link>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full rounded-xl py-4 text-sm font-black uppercase tracking-widest text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
            style={{ background: loading ? "rgba(18,77,52,0.6)" : GREEN, boxShadow: "0 4px 14px rgba(18,77,52,0.3)" }}
          >
            {loading ? "Submitting..." : "Submit Vendor Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
