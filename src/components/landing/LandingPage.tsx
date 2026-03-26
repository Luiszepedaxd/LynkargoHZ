import LandingHeroSection from "@/components/landing/LandingHeroSection";
import LandingServicesSection from "@/components/landing/LandingServicesSection";
import LandingValueSection from "@/components/landing/LandingValueSection";
import LandingProcessSection from "@/components/landing/LandingProcessSection";
import LandingTargetsSection from "@/components/landing/LandingTargetsSection";
import LandingCTASection from "@/components/landing/LandingCTASection";
import LandingFooter from "@/components/landing/LandingFooter";
import WhatsAppFloatingButton from "@/components/landing/WhatsAppFloatingButton";
import ScrollEnhancements from "@/components/landing/ScrollEnhancements";
import { whatsappContactHref } from "@/components/landing/landing.data";

export default function LandingPage() {
  return (
    <>
      <WhatsAppFloatingButton href={whatsappContactHref} />
      <ScrollEnhancements />

      <main>
        <LandingHeroSection />
        <LandingServicesSection />
        <LandingValueSection />
        <LandingProcessSection />
        <LandingTargetsSection />
        <LandingCTASection />
        <LandingFooter />
      </main>
    </>
  );
}

