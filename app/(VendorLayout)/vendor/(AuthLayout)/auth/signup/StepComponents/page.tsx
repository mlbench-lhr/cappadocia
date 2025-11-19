"use client";
import {
  setUpdateProfileStep,
  updateProfileStepBack,
  updateProfileStepNext,
} from "@/lib/store/slices/generalSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import Success from "@/app/(UpdateProfileLayout)/update-profile/Success";
import VendorSignupStep1 from "./Step1";
import VendorSignupStep2 from "./Step2";
import VendorSignupStep3 from "./Step3";
import VendorSignupStep4 from "./Step4";
import VendorSignupStep5 from "./Step5";

const VendorSignUp = () => {
  const signupSteps = useAppSelector((state) => state.general.signupSteps);
  console.log("signupSteps-----", signupSteps);
  const dispatch = useAppDispatch();

  const handleNext = () => {
    if (signupSteps < 5) {
      dispatch(updateProfileStepNext());
    } else {
      console.log("Vendor registration completed:", vendorState);
    }
  };

  const handleBack = () => {
    if (signupSteps > 1) {
      dispatch(updateProfileStepBack());
    }
  };

  const steps = [
    {
      component: <VendorSignupStep1 onNext={handleNext} />,
      name: "VendorSignUpStep1",
    },
    {
      component: <VendorSignupStep2 onNext={handleNext} onBack={handleBack} />,
      name: "VendorSignUpStep2",
    },
    {
      component: <VendorSignupStep3 onNext={handleNext} onBack={handleBack} />,
      name: "VendorSignUpStep3",
    },
    {
      component: <VendorSignupStep4 onNext={handleNext} onBack={handleBack} />,
      name: "VendorSignUpStep4",
    },
    {
      component: <VendorSignupStep5 onNext={handleNext} onBack={handleBack} />,
      name: "VendorSignUpStep5",
    },
  ];
  const handleStepClick = (name: string, index: number) => {
    console.log(name, index);
    dispatch(setUpdateProfileStep(index));
  };
  const vendorState = useAppSelector((s) => s.vendor.vendorDetails);

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
