"use client";

import { useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import CategoryPills from "@/components/home/CategoryPills";
import DealsStrip from "@/components/home/DealsStrip";
import ProductGrid from "@/components/home/ProductGrid";
import TrustBar from "@/components/home/TrustBar";
import HowItWorks from "@/components/home/HowItWorks";
import VendorCTA from "@/components/home/VendorCTA";
import NewsletterStrip from "@/components/home/NewsletterStrip";
import FooterLinks from "@/components/home/FooterLinks";

export default function HomePage() {
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [activeCategoryName, setActiveCategoryName] = useState("All");

  return (
    <div className="space-y-24 pb-20">
      <HeroSection />
      <CategoryPills
        activeCategoryId={activeCategoryId}
        onSelectCategory={(categoryId, categoryName) => {
          setActiveCategoryId(categoryId);
          setActiveCategoryName(categoryName);
        }}
      />
      <DealsStrip />
      <ProductGrid
        activeCategoryId={activeCategoryId}
        activeCategoryName={activeCategoryName}
      />
      <TrustBar />
      <HowItWorks />
      <VendorCTA />
      <NewsletterStrip />
      <FooterLinks />
    </div>
  );
}
