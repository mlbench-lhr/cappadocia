import Image from "next/image";
import { BoxProviderWithName } from "./providers/BoxProviderWithName";
import {
  ClockIcon,
  HeartIcon,
  PeopleIcon,
  StarIcon,
  VehicleIcon,
} from "@/public/sidebarIcons/page";
import { ProfileBadge } from "./SmallComponents/ProfileBadge";
import Link from "next/link";
import { Button } from "./ui/button";
import { exploreProps } from "@/app/(Protected)/favorites/page";

export const TourAndActivityCard = ({ item }: { item: exploreProps }) => {
  return (
    <div className="space-y-3 col-span-12 md:col-span-6 lg:col-span-3">
      <BoxProviderWithName
        key={item._id}
        noBorder={true}
        className="border md:border !px-3.5"
      >
        <div className="flex justify-start items-start flex-col rounded-t-xl overflow-hidden relative">
          <Image
            alt=""
            src={item.image}
            width={120}
            height={120}
            className="w-full h-[120px] object-cover object-center"
          />
          <div className="bg-white h-[26px] w-[26px] rounded-[6px] absolute top-3 right-3 flex justify-center items-center">
            <HeartIcon color="#B32053" />
          </div>
          <div className="w-full h-[25px] flex text-white bg-primary justify-between items-center mb-2 px-1.5">
            <div className="flex justify-start items-center gap-1">
              <ClockIcon color="white" />
              <span className="text-[10px] font-[400]">5 Days</span>
            </div>
            <div className="flex justify-start items-center gap-1">
              <PeopleIcon color="white" />
              <span className="text-[10px] font-[400]">
                {item.groupSize} People
              </span>
            </div>
          </div>
          <div className="space-y-1 w-full text-[rgba(34,30,31,0.50)] text-xs font-normal leading-tight">
            <ProfileBadge
              title="SkyView Balloon Tours"
              subTitle={"TÜRSAB Number: " + item.vendorDetails.tursabNumber}
              image="/userDashboard/img2.png"
            />
            <Link
              href={`/explore/detail/${item._id}`}
              className="text-base font-semibold text-black line-clamp-1 hover:underline"
            >
              {item.title}
            </Link>
            <div className="flex justify-start items-center gap-1">
              <span className="font-semibold">Group Size: </span>
              <span className="">Up to {item.groupSize} people</span>
            </div>
            <div className="flex justify-start items-center gap-1">
              <VehicleIcon color="rgba(0, 0, 0, 0.7)" />
              <span className="">
                Pickup:
                {item.pickupAvailable ? " Available" : " Not Available"}{" "}
              </span>
            </div>
            <div className="flex justify-start items-center gap-1">
              <span className="text-base font-medium text-black">
                ${item.price}
              </span>
              <span className="">/Person</span>
            </div>

            <div className="w-full flex justify-between items-center -mt-1">
              <div className="flex justify-start items-center gap-2">
                <div className="flex justify-start items-center gap-1">
                  <StarIcon />
                  <span className="">{item.rating}</span>
                </div>
              </div>
              <Button
                variant={"green_secondary_button"}
                className="w-[92px] flex font-[500]"
                style={{ height: "26px", fontSize: "10px" }}
              >
                <Link href={"/bookings/book"}>Book now</Link>
              </Button>
            </div>
          </div>
        </div>
      </BoxProviderWithName>
    </div>
  );
};
