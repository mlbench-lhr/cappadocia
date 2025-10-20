"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import PersonalInfo from "./PersonalInfo";
import AcademicInfo from "./AcademicInfo";
import DreamsAndGoals from "./DreamsAndGoals";
import ExtracurricularsAndAwards from "./ExtracurricularsAndAwards";
import Success from "./Success";
import { useEffect } from "react";
import { setReduxUser } from "@/lib/store/slices/authSlice";
import { setUpdateProfileStep } from "@/lib/store/slices/generalSlice";

export default function UpdateProfile() {
  const updateProfileStep = useAppSelector(
    (state) => state.general.updateProfileStep
  );
  const userData = useAppSelector((state) => state.auth.user);
  console.log(
    "userData?.extracurricularsAndAwards?.awards",
    userData?.extracurricularsAndAwards?.awards
  );
  const dispatch = useAppDispatch();
  const steps = [
    { name: "Personal Info", component: <PersonalInfo /> },
    { name: "Academic Info", component: <AcademicInfo /> },
    { name: "Dreams & Goals", component: <DreamsAndGoals /> },
    {
      name: "Extracurriculars & Awards",
      component: <ExtracurricularsAndAwards />,
    },
  ];
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(setReduxUser(data.user));
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  if (updateProfileStep === 4) {
    return <Success />;
  }
  const handleStepClick = (name: string, index: number) => {
    if (!userData?.profileUpdated) {
      return;
    }
    console.log(name, index);
    dispatch(setUpdateProfileStep(index));
  };

  return (
    <div className="flex flex-col gap-[32px] justify-between items-start w-full min-h-[calc(100vh-220px)] max-h-fit">
      <div className="w-full flex flex-col gap-[40px] justify-start items-center">
        <div className="flex justify-start mx-auto w-fit items-center">
          {steps.map((item, index) => (
            <div
              key={item.name}
              className="flex justify-start items-center gap-2 w-fit"
            >
              <div
                className={`${
                  userData?.profileUpdated
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                } flex justify-start items-center gap-2 hover:bg-gray-100 px-2.5 py-2 rounded-lg`}
                onClick={() => {
                  handleStepClick(item.name, index);
                }}
              >
                <div
                  className={`w-[20px] md:w-[24px] h-[20px] md:h-[24px] rounded-full flex justify-center items-center font-[500] text-[11px] lg:text-[16px] ${
                    updateProfileStep === index || index < updateProfileStep
                      ? "text-white bg-[#B32053]"
                      : "text-black bg-[#D5DCD6]"
                  }`}
                >
                  {index + 1}
                </div>
                <h2
                  className="hidden md:block font-[500] text-[11px] lg:text-[16px] w-fit"
                  style={{ textAlign: "center" }}
                >
                  {item.name}
                </h2>
              </div>
              {index !== 3 && (
                <div
                  className={`w-[38px] md:w-[66px] h-[1px] border-t-[1px] ${
                    index < updateProfileStep
                      ? "border-[#B32053]"
                      : "border-[#D5DCD6]"
                  } ms-2 me-[16px] mb-0`}
                ></div>
              )}
            </div>
          ))}
        </div>
        {steps[updateProfileStep]?.component}
      </div>
    </div>
  );
}
