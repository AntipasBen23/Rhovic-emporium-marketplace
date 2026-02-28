import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "RHOVIC Marketplace",
  description: "A premium multi-vendor marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header cartCount={0} />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

        <footer className="mt-10 border-t border-black/10">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>
                <span className="font-semibold text-primary">RHOVIC</span>{" "}
                Marketplace — curated multi-vendor commerce.
              </span>
              <span className="text-gray-500">
                © {new Date().getFullYear()} RHOVIC
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}