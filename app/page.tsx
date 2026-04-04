import { Footer } from "@/components/Footer";
import { GalleryShowcaseSection } from "@/components/home/GalleryShowcaseSection";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PricingSection } from "@/components/home/PricingSection";
import Testimonials from "@/components/home/Testimonials";


export default function Home() {
  return (
    <main className="min-h-screen bg-background p-3 sm:p-4 lg:p-5">
      <HomeHeroSection />
      <GalleryShowcaseSection />
      <HowItWorksSection />
      <PricingSection/>
      <Testimonials />
      <Footer />
    </main>
  );
}
