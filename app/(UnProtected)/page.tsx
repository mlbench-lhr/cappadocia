import Section1 from "./LandingPageSections/Section1";
import Section2 from "./LandingPageSections/Section2";
import Section3 from "./LandingPageSections/Section3";
import Section4 from "./LandingPageSections/Section4";
import Section5 from "./LandingPageSections/Section5";
import Section6 from "./LandingPageSections/Section6";
import Section7 from "./LandingPageSections/Section7";
import Section8 from "./LandingPageSections/Section8";

export default function app() {
  return (
    <div className="w-full h-fit">
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section8 />
      <Section7 />
    </div>
  );
}
