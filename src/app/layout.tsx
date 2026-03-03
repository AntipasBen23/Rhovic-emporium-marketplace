import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "RHOVIC Marketplace",
  description: "Multi-vendor commerce infrastructure platform.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <div className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))] transition-colors duration-300">
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          </div>
        </ThemeProvider>
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}