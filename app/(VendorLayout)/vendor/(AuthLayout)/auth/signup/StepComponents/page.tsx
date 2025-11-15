"use client";
import { setUpdateProfileStep } from "@/lib/store/slices/generalSlice";
import { VendorSignUpStep1 } from "./Step1";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { VendorSignUpStep2 } from "./Step2";
import { VendorSignUpStep3 } from "./Step3";
import { VendorSignUpStep4 } from "./Step4";
import { VendorSignUpStep5 } from "./Step5";
import Success from "@/app/(UpdateProfileLayout)/update-profile/Success";

const VendorSignUp = () => {
  const signupSteps = useAppSelector((state) => state.general.signupSteps);
  console.log("signupSteps-----", signupSteps);
  const dispatch = useAppDispatch();
  const steps = [
    { component: <VendorSignUpStep1 />, name: "VendorSignUpStep1" },
    { component: <VendorSignUpStep2 />, name: "VendorSignUpStep2" },
    { component: <VendorSignUpStep3 />, name: "VendorSignUpStep3" },
    { component: <VendorSignUpStep4 />, name: "VendorSignUpStep4" },
    { component: <VendorSignUpStep5 />, name: "VendorSignUpStep5" },
  ];
  const handleStepClick = (name: string, index: number) => {
    console.log(name, index);
    dispatch(setUpdateProfileStep(index));
  };

  if (signupSteps === 5) {
    return <Success />;
  }
  return (
    <div>
      <div className="flex justify-start mx-auto w-fit items-center mb-6">
        {steps.map((item, index) => (
          <div
            key={item.name}
            className="flex justify-start items-center gap-0 w-fit"
          >
            <div
              className={`cursor-pointer flex justify-start items-center gap-2 hover:bg-gray-100 rounded-lg`}
              onClick={() => {
                handleStepClick(item.name, index);
              }}
            >
              <div
                className={`w-[20px] h-[20px] rounded-full flex justify-center items-center font-[500] text-[11px] lg:text-[16px] ${
                  signupSteps === index || index < signupSteps
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              >
                <div className="w-[13px] h-[13px] rounded-full ring-[1.5px] ring-white"></div>
              </div>
            </div>
            {index !== 4 && (
              <div
                className={`w-[35px] h-[3px] border-t-[3px] ${
                  index < signupSteps ? "border-primary" : "border-secondary"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
      <div>{steps[signupSteps]?.component}</div>
    </div>
  );
};
export default VendorSignUp;
