"use client";

import Section1 from "@/app/(UnProtected)/LandingPageSections/Section1";
import Section2 from "@/app/(UnProtected)/LandingPageSections/Section2";
import Section3 from "@/app/(UnProtected)/LandingPageSections/Section3";
import Section4 from "@/app/(UnProtected)/LandingPageSections/Section4";
import Section5 from "@/app/(UnProtected)/LandingPageSections/Section5";
import Section6 from "@/app/(UnProtected)/LandingPageSections/Section6";
import Section7 from "@/app/(UnProtected)/LandingPageSections/Section7";
import Section8 from "@/app/(UnProtected)/LandingPageSections/Section8";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";

export default function LandingEditor() {
  return (
    <BasicStructureWithName
      name="Landing Page Editor"
      subHeading="Click the edit icons on images and texts"
      showBackOption
    >
      <BoxProviderWithName noBorder={true} className="!p-0">
        <div className="w-full h-fit">
          <div className="w-full h-fit">
            {/* Hero */}
            <Section1 editorMode={true} />
            {/* Explore lists */}
            <Section2 />
            {/* Why choose */}
            <Section3 editorMode={true} />
            {/* Gallery */}
            <Section4 editorMode={true} />
            {/* Vendor CTA */}
            <Section5 />
            {/* Contact */}
            <Section6 editorMode={true} />
            {/* Testimonials */}
            <Section8 editorMode={true} />
            {/* About */}
            <Section7 editorMode={true} />
          </div>
        </div>
      </BoxProviderWithName>
    </BasicStructureWithName>
  );
}
