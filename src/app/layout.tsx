import type { Metadata } from "next";
import { Inter, Lato, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "RHOVIC Marketplace",
  description: "Multi-vendor commerce infrastructure platform.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["600"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${lato.variable} ${outfit.variable} antialiased selection:bg-yellow-200/50`}
      >
        <ThemeProvider>
          <div className="min-h-screen bg-white text-gray-950 dark:bg-[rgb(8,15,12)] dark:text-gray-50 transition-colors duration-300">
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">{children}</main>
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
