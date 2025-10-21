import { EmailSection } from "../Components/EmailSection";
import { HeroSection } from "../Components/heroSection";

const HomePage = () => {
  return (
    <>
      <HeroSection
        heading={"Contact Us"}
        text={
          "Let’s grow together! Reach out and discover how Cappadocia can help you branch into new opportunities. Our team is here to guide and support you every step of the way."
        }
      />
      <EmailSection />
    </>
  );
};
export default HomePage;
