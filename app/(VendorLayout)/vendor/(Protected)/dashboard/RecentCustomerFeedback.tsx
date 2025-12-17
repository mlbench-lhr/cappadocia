"use client";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import { StarIcon } from "@/public/allIcons/page";
import { ReviewWithPopulatedData } from "@/lib/types/review";
import CustomerFeedbackSkeleton from "@/components/Skeletons/CustomerFeedbackSkeleton";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";

export const RecentCustomerFeedback = () => {
  const [data, setData] = useState<ReviewWithPopulatedData[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/reviews/getAll?limit=5`);
        console.log("response----", response);
        if (response.data?.data) {
          setData(response.data?.data);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, []);

  if (loading) {
    return <CustomerFeedbackSkeleton />;
  }

  return (
    <div className="col-span-16 xl:col-span-7 space-y-2">
      <BoxProviderWithName
        name="Recent Customer Feedback"
        className="!px-0 !pb-0"
        noBorder={true}
      >
        <div className="w-full space-y-3">
          {data && data?.length > 0 ? (
            data.map((item, index) => (
              <BoxProviderWithName
                leftSideComponent={
                  <ProfileBadge
                    title={item.user.fullName}
                    subTitle={item.user.email}
                    image={item.user.avatar || "/placeholderDp.png"}
                    size="medium"
                  />
                }
                rightSideComponent={
                  <div className="w-fit flex justify-start items-center gap-1">
                    <StarIcon />
                    <span className="text-[12px] font-medium text-black/60">
                      {item.rating}
                    </span>
                  </div>
                }
                key={index}
                noBorder={true}
                className="!border !px-3.5"
              >
                <Link
                  href={`/admin/tours-and-activities/detail/${"69204f6ba4bb81f02d007a64"}`}
                  className="text-xs font-semibold -mt-2 text-black hover:underline"
                >
                  {item.activity.title}
                </Link>
                <div className="text-xs font-normal leading-tight text-black/70">
                  {item.review?.[0]?.text}
                </div>
              </BoxProviderWithName>
            ))
          ) : (
            <NoDataComponent text="No feedback yet" />
          )}
        </div>
      </BoxProviderWithName>
    </div>
  );
};
