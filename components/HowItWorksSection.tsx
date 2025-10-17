import searchIcon from "@/public/search.svg";
import listCheckIcon from "@/public/list-checks.svg";
import chatIcon from "@/public/messages-square.svg";
import HeadingCard from "./Cards/HeadingCard";
import { Fragment } from "react";

const roles = [
  {
    heading: "Discover Opportunities",
    text: "Get personalized extracurricular, competition, and program recommendations tailored to your unique skills, passions, and future goals.",
    icon: searchIcon,
    number: "01",
  },
  {
    heading: "Connect & Apply",
    text: "They apply or show interest in opportunities that align with their unique skills, passions, expertise, values, career goals, and long-term aspirations, ensuring the right fit for personal growth.",
    icon: listCheckIcon,
    number: "02",
  },
  {
    heading: "Plan & Track Milestones",
    text: "Set your academic and career goals, track your progress effortlessly, and visualize your readiness with clear, real-time updates that keep you motivated.",
    icon: listCheckIcon,
    number: "03",
  },
  {
    heading: "Get AI Feedback",
    text: "Receive tailored advice from AI alongside expert input from teachers and mentors. Identify strengths, address gaps, and ensure you’re always moving toward your goals.",
    icon: chatIcon,
    number: "04",
  },
];

export function RoleCards() {
  return (
    <section id="features" className="mt-[80px]">
      <div className="container mx-auto">
        <div className="w-full flex justify-center items-center flex-col text-center gap-[16px]">
          <h2 className="heading-text-style-1">How it Works? </h2>
          <p
            className="plan-text-style-2 w-full lg:w-[1000px]"
            style={{ textAlign: "center" }}
          >
            OpportuniTree works by allowing students to create detailed profiles
            showcasing their skills, achievements, and interests. Students can
            track applications, manage participation, and receive personalized
            recommendations, making it easier to discover and engage in
            activities that support their personal and academic growth.{" "}
          </p>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[24px] mt-[30px]">
          {roles.map((role, index) => (
            <Fragment key={index}>
              <HeadingCard
                icon={role.icon}
                heading={role.heading}
                number={role.number}
                text={role.text}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
