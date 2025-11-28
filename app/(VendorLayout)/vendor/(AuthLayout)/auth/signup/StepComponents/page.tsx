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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VendorDetails } from "@/lib/mongodb/models/User";
import { signUp } from "@/lib/auth/auth-helpers";
import Swal from "sweetalert2";

type SignupFormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  agreedToTerms?: boolean;
  vendorDetails?: VendorDetails;
};

const VendorSignUp = () => {
  const signupSteps = useAppSelector((state) => state.general.signupSteps);
  const vendorData = useAppSelector((s) => s.vendor.vendorDetails);
  console.log("vendorData-----", vendorData);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   dispatch(setUpdateProfileStep(4));
  // }, []);

  const handleEmailSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const signupData: SignupFormValues = {
        fullName: vendorData?.companyName ? vendorData?.companyName : "",
        email: vendorData?.businessEmail ? vendorData?.businessEmail : "",
        phoneNumber: vendorData?.contactPhoneNumber
          ? vendorData?.contactPhoneNumber
          : "",
        password: vendorData?.password ? vendorData?.password : "",
        vendorDetails: vendorData,
      };
      console.log("signupData", signupData);

      const { data: res, error } = await signUp(signupData);
      if (error) {
        setError(error.message);
      } else {
        if (res?.requiresVerification) {
          setSuccess(true);
          dispatch(updateProfileStepNext());
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "Please try again.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const email = vendorData.businessEmail;
      router.push(
        `/vendor/auth/verify-email?email=${encodeURIComponent(email || "")}`
      );
    }
  }, [success, router]);

  const handleNext = () => {
    if (signupSteps < 4) {
      dispatch(updateProfileStepNext());
    } else {
      handleEmailSignup();
      console.log("Vendor registration completed:", vendorState);
    }
  };

  const handleBack = () => {
    if (signupSteps > 0) {
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
      component: (
        <VendorSignupStep5
          onNext={handleNext}
          onBack={handleBack}
          loading={loading}
        />
      ),
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
              className={`flex justify-start items-center gap-2 hover:bg-gray-100 rounded-lg`}
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
