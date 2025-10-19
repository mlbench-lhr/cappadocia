import { CTASection } from "@/components/CTASection";
import { HeroSection } from "../Components/heroSection";
import HeadingCard from "@/components/Cards/HeadingCard";
import aboutCarIcon from "@/public/aboutCarIcon.svg";
import aboutCarIcon1 from "@/public/aboutCarIcon1.svg";
import aboutCarIcon2 from "@/public/aboutCarIcon2.svg";
import aboutCarIcon3 from "@/public/aboutCarIcon3.svg";
import { Fragment } from "react";

const HomePage = () => {
  const roles = [
    {
      heading: "Growth",
      text: "We strive to make a lasting, positive difference in people’s lives and the world around us.",
      icon: aboutCarIcon,
    },
    {
      heading: "Collaboration",
      text: "We embrace fresh thinking and creative solutions to connect talent with the right opportunities.",
      icon: aboutCarIcon1,
    },
    {
      heading: "Innovation",
      text: "We foster partnerships and teamwork to unlock shared success and stronger communities.",
      icon: aboutCarIcon2,
    },
    {
      heading: "Impact",
      text: "We strive to make a lasting, positive difference in people’s lives and the world around us.",
      icon: aboutCarIcon3,
    },
  ];

  return (
    <section id="features" className="mt-[32px] lg:mt-[80px]">
      <div className="container mx-auto">
        <HeroSection
          heading={"Welcome to OpportuniTree"}
          text={
            "At OpportuniTree, we believe that every opportunity is like a seed with the right care, it grows into something extraordinary. Our platform is designed to connect people with meaningful opportunities that empower them to learn, grow, and succeed. We are more than just a platform we are a thriving community that fosters collaboration, skill development, and personal growth."
          }
        />
        <div className="w-full flex justify-center items-center flex-col text-center gap-[16px] mt-[80px]">
          <h2 className="heading-text-style-1">Our Mission</h2>
          <p
            className="plan-text-style-2 w-full lg:w-[1000px]"
            style={{ textAlign: "center" }}
          >
            Our mission is simple: to help individuals and organisations plant
            the seeds of success and watch them flourish. By bridging the gap
            between talent and opportunity, we create a space where ambitions
            turn into achievements. Together, we nurture growth, inspire
            innovation, and build a thriving community for the future.
          </p>
        </div>
        <div className="w-full flex justify-center items-center flex-col text-center gap-[16px] mt-[80px]">
          <h2 className="heading-text-style-1">Our Values</h2>
          <p
            className="plan-text-style-2 w-full lg:w-[1000px]"
            style={{ textAlign: "center" }}
          >
            Our values define who we are and guide every decision we make. They
            shape our culture, inspire our actions, and keep us focused on
            creating meaningful experiences for the people and communities we
            serve.
          </p>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[24px] mt-[56px]">
          {roles.map((role, index) => (
            <Fragment key={index}>
              <HeadingCard
                icon={role.icon}
                heading={role.heading}
                text={role.text}
              />
            </Fragment>
          ))}
        </div>
        <CTASection />
      </div>
    </section>
  );
};
export default HomePage;
