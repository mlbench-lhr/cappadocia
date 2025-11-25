"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import Link from "next/link";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import { StarIcon, VehicleIcon } from "@/public/allIcons/page";
import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import { useEffect, useState } from "react";
import axios from "axios";

export const ExploreCappadocia = () => {
  const [toursAndActivity, setToursAndActivity] =
    useState<ToursAndActivityWithVendor[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/toursAndActivity/getAll?limit=2`);
        console.log("response----", response);

        if (response.data?.data) {
          setToursAndActivity(response.data?.data);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, []);

  if (!toursAndActivity) {
    return null;
  }

  return (
    <BoxProviderWithName
      name="Explore Cappadocia"
      rightSideLink="/explore"
      rightSideLabel="See All"
    >
      <div className="w-full space-y-3">
        {toursAndActivity.map((item, index) => (
          <BoxProviderWithName
            key={index}
            noBorder={true}
            className="!border !px-3.5"
          >
            <div className="flex justify-start items-center gap-2 flex-col md:flex-row">
              <Image
                alt=""
                src={item.uploads?.[0]}
                width={120}
                height={120}
                className="w-full md:w-[120px] h-auto md:h-[120px] object-cover object-center rounded-xl"
              />
              <div className="space-y-1 w-full md:w-[calc(100%-128px)] text-[rgba(34,30,31,0.50)] text-xs font-normal leading-tight">
                <ProfileBadge
                  title={item?.vendor?.vendorDetails?.companyName}
                  subTitle={
                    "TÜRSAB Number: " +
                    item?.vendor?.vendorDetails?.tursabNumber
                  }
                  image={item?.vendor?.avatar || "/placeholderDp.png"}
                />
                <span className="text-base font-semibold text-black line-clamp-1">
                  {item.title}
                </span>
                <div className="flex justify-start items-center gap-1">
                  <span className="font-semibold">Group Size: </span>
                  <span className="">Up to 20 people</span>
                </div>
                <div className="flex justify-start items-center gap-1">
                  <VehicleIcon color="rgba(0, 0, 0, 0.7)" />
                  <span className="">
                    Pickup:
                    {item.pickupAvailable
                      ? " Available"
                      : " Not Available"}{" "}
                  </span>
                </div>

                <div className="w-full flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <span className="text-base font-medium text-black">
                        ${item?.slots?.[0]?.adultPrice}
                      </span>
                      <span className="">/Person</span>
                    </div>
                    <div className="flex justify-start items-center gap-1">
                      <StarIcon />
                      <span className="">4.6</span>
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
        ))}
      </div>
    </BoxProviderWithName>
  );
};
