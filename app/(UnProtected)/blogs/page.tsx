import { HeroSection } from "@/app/(UnProtected)/blogs/hero-section";
import { CardSection } from "@/app/(UnProtected)/blogs/cards-section";

export default function app() {
  return (
    <div className="w-full">
      <HeroSection />
      <CardSection />
    </div>
  );
}
