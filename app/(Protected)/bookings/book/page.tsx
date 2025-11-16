"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import {
  RadioInputComponent,
  SelectInputComponent,
  TextInputComponent,
} from "@/components/SmallComponents/InputComponents";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { Label } from "@/components/ui/label";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddressLocationSelector, { LocationData } from "@/components/map";
import { Plus } from "lucide-react";
import { addToArray } from "@/lib/store/slices/addbooking";

export type DashboardCardProps = {
  image: string;
  title: string;
  description: string;
};

export default function BookingsPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const bookingState = useAppSelector((s) => s.addBooking);
  console.log("bookingState-------", bookingState);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);
  const [location1, setLocation1] = useState<LocationData>({
    address: "1600 Amphitheatre Parkway, Mountain View, CA",
    coordinates: { lat: 37.4224764, lng: -122.0842499 },
  });

  return (
    <BasicStructureWithName name="Book Now" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-5 h-fit p-4">
        <BoxProviderWithName
          noBorder={true}
          className="!p-0"
          name="Trip Details"
          textClasses=" text-[18px] font-semibold "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInputComponent
              label="Select Date"
              placeholder="Select Date"
              options={["Nov 2,2025", "Apr 2, 2025"]}
            />
            <TextInputComponent
              label="Participants"
              placeholder="Enter no of participants"
            />
          </div>
        </BoxProviderWithName>
        <BoxProviderWithName
          noBorder={true}
          className="!p-0"
          name="Contact Details"
          textClasses=" text-[18px] font-semibold "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInputComponent label="Email Address" />
            <TextInputComponent label="Full Name" />
            <div className="space-y-1 col-span-1">
              <Label className="text-[14px] font-semibold">Phone Number</Label>
              <PhoneNumberInput
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
              />
            </div>
          </div>
        </BoxProviderWithName>
        <BoxProviderWithName
          noBorder={true}
          className="!p-0"
          name="Travelers Details"
          textClasses=" text-[18px] font-semibold "
          rightSideComponent={
            <Button
              variant={"green_secondary_button"}
              size={"sm"}
              onClick={() => {
                dispatch(
                  addToArray({
                    field: "travelers",
                    value: {
                      fullName: "",
                      dob: "",
                      nationality: "",
                      passport: "",
                    },
                  })
                );
              }}
            >
              Add Traveler <Plus className="ml-2 h-4 w-4" />
            </Button>
          }
        >
          <div className="space-y-4">
            {bookingState.travelers.map((item, index) => (
              <BoxProviderWithName
                key={index}
                noBorder={true}
                className="!p-0"
                name={`Traveler ${index + 1}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInputComponent label="Full Name" />
                  <TextInputComponent label="Date of Birth" />
                  <TextInputComponent label="Nationality" />
                  <TextInputComponent label="Passport Number / TC ID Number" />
                </div>
              </BoxProviderWithName>
            ))}
          </div>
        </BoxProviderWithName>
        <BoxProviderWithName
          noBorder={true}
          className="!p-0"
          name="Pickup Details"
          textClasses=" text-[18px] font-semibold "
        >
          <BoxProviderWithName
            noBorder={true}
            className=" !px-3.5 !py-3 bg-[#FFF5DF] w-full md:w-[550px] "
            textClasses=" text-[18px] font-semibold "
          >
            <IconAndTextTab2
              alignClass=" items-center !gap-3"
              textClasses=" text-black/80 text-[14px] font-medium "
              text="Note: Please add your pick-up location at least 24 hours before your activity so your activity provider can assist you."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.905 6.52 11.0007 6.28267 11 6C10.9993 5.71733 10.9033 5.48 10.712 5.288C10.5207 5.096 10.2833 5 10 5C9.71667 5 9.47933 5.096 9.288 5.288C9.09667 5.48 9.00067 5.71733 9 6C8.99933 6.28267 9.09533 6.52033 9.288 6.713C9.48067 6.90567 9.718 7.00133 10 7ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88334 18.6867 3.825 17.9743 2.925 17.075C2.025 16.1757 1.31267 15.1173 0.788001 13.9C0.263335 12.6827 0.000667933 11.3827 1.26582e-06 10C-0.000665401 8.61733 0.262001 7.31733 0.788001 6.1C1.314 4.88267 2.02633 3.82433 2.925 2.925C3.82367 2.02567 4.882 1.31333 6.1 0.788C7.318 0.262667 8.618 0 10 0C11.382 0 12.682 0.262667 13.9 0.788C15.118 1.31333 16.1763 2.02567 17.075 2.925C17.9737 3.82433 18.6863 4.88267 19.213 6.1C19.7397 7.31733 20.002 8.61733 20 10C19.998 11.3827 19.7353 12.6827 19.212 13.9C18.6887 15.1173 17.9763 16.1757 17.075 17.075C16.1737 17.9743 15.1153 18.687 13.9 19.213C12.6847 19.739 11.3847 20.0013 10 20Z"
                    fill="#D59E29"
                  />
                </svg>
              }
            />
          </BoxProviderWithName>
          <BoxProviderWithName noBorder={true} className="!p-0 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RadioInputComponent label="Where would you like to be picked up?" />
            </div>
          </BoxProviderWithName>
          <div className="w-full lg:w-1/2 mt-4">
            <AddressLocationSelector
              value={location1}
              onChange={(data) => {
                setLocation1(data);
              }}
              readOnly={false}
              label="Location"
              placeholder="Type address or click on map"
            />
          </div>
          <div className="w-full md:w-[235px] mt-4">
            <Button variant={"main_green_button"} className="w-full" asChild>
              <Link href={"/bookings/payment"}>Next</Link>
            </Button>
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
