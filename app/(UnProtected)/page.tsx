import { HeroSection } from "@/components/hero-section";
import { RoleCards } from "@/components/HowItWorksSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { CTASection } from "@/components/CTASection";

export default function app() {
  return (
    <>
      <HeroSection />
      <RoleCards />
      <TestimonialSection />
      <CTASection />
    </>
  );
}
