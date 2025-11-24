import Image from "next/image";
import { BoxProviderWithName } from "./providers/BoxProviderWithName";
import {
  ClockIcon,
  PeopleIcon,
  StarIcon,
  VehicleIcon,
} from "@/public/allIcons/page";
import { ProfileBadge } from "./SmallComponents/ProfileBadge";
import Link from "next/link";
import { Button } from "./ui/button";
import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import moment from "moment";
import { FavoriteButton } from "./SmallComponents/FavoriteButton";
export const TourAndActivityCard = ({
  item,
}: {
  item: ToursAndActivityWithVendor;
}) => {
  return (
    <div className="space-y-3 col-span-12 md:col-span-6 lg:col-span-3">
      <BoxProviderWithName noBorder={true} className="border md:border !px-3.5">
        <div className="flex justify-start items-start flex-col rounded-t-xl overflow-hidden relative">
          <Image
            alt=""
            src={item?.uploads?.[0]}
            width={120}
            height={120}
            className="w-full h-[120px] object-cover object-center"
          />
          <div className=" absolute top-3 right-3 ">
            <FavoriteButton _id={item._id} />
          </div>
          <div className="w-full h-[25px] flex text-white bg-primary justify-between items-center mb-2 px-1.5">
            <div className="flex justify-start items-center gap-1">
              <ClockIcon color="white" />
              <span className="text-[10px] font-[400]">
                {moment(item.slots?.[0]?.startDate).diff(moment(), "days")} Days
              </span>
            </div>
            <div className="flex justify-start items-center gap-1">
              <PeopleIcon color="white" />
              <span className="text-[10px] font-[400]">20 People</span>
            </div>
          </div>
          <div className="space-y-1 w-full text-[rgba(34,30,31,0.50)] text-xs font-normal leading-tight">
            <ProfileBadge
              title={item?.vendor?.vendorDetails?.companyName}
              subTitle={
                "TÜRSAB Number: " + item?.vendor?.vendorDetails?.tursabNumber
              }
              image={item?.vendor?.avatar || "/userDashboard/img2.png"}
            />
            <Link
              href={`/explore/detail/${item._id}`}
              className="text-base font-semibold text-black line-clamp-1 hover:underline"
            >
              {item.title}
            </Link>
            <div className="flex justify-start items-center gap-1">
              <span className="font-semibold">Group Size: </span>
              <span className="">Up to 20 people</span>
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
                ${item.slots?.[0]?.adultPrice}
              </span>
              <span className="">/Person</span>
            </div>

            <div className="w-full flex justify-between items-center -mt-1">
              <div className="flex justify-start items-center gap-2">
                <div className="flex justify-start items-center gap-1">
                  <StarIcon />
                  <span className="">4.7</span>
                </div>
              </div>
              <Button
                variant={"green_secondary_button"}
                className="w-[92px] flex font-[500]"
                style={{ height: "26px", fontSize: "10px" }}
              >
                <Link href={`/explore/detail/${item._id}`}>Book now</Link>
              </Button>
            </div>
          </div>
        </div>
      </BoxProviderWithName>
    </div>
  );
};
