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
  return (
    <div className="space-y-24 pb-20">
      <HeroSection />
      <CategoryPills />
      <DealsStrip />
      <ProductGrid />
      <TrustBar />
      <HowItWorks />
      <VendorCTA />
      <NewsletterStrip />
      <FooterLinks />
    </div>
  );
}