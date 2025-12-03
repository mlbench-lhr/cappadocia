"use client";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { useEffect, useState } from "react";
import axios from "axios";
import { ReviewsApiResponse } from "@/app/(Protected)/explore/detail/[id]/ReviewSection";
import { useAppSelector } from "@/lib/store/hooks";

export const RatingBreakdown = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ReviewsApiResponse>({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    ratingCounts: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  });
  console.log("data------", data);

  const userData = useAppSelector((s) => s.auth.user);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(
          `/api/reviews/${"getVendorReviews"}/${userData?.id}`
        );
        console.log("response-------", response);

        if (response.data?.data?.ratingBreakdown) {
          setData({
            averageRating: response.data?.data?.averageRating,
            totalReviews: response.data?.data?.totalReviews,
            ratingBreakdown: response.data?.data?.ratingBreakdown,
            ratingCounts: response.data?.data?.ratingCounts,
          });
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };

    if (userData?.id) {
      getData();
    }
  }, [userData?.id]);

  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="col-span-16 xl:col-span-7 h-full bg-red-30">
      <BoxProviderWithName
        name="Rating Breakdown"
        className="h-full bg-blue-30"
      >
        <div className="col-span-1 flex flex-col justify-between bg-green-30 items-start gap-4 h-full">
          {ratings.map((r, i) => (
            <div
              key={r}
              className="flex justify-start items-start w-full gap-2 flex-col"
            >
              <div className="w-full flex justify-between items-center">
                <span className="text-[12px] font-semibold ">{r} Stars</span>
                <span className="text-[12px] font-medium text-black/70 ">
                  {data.ratingCounts[i + 1]} Reviews
                </span>
              </div>
              <div className="w-full relative rounded-full overflow-hidden h-[10px] bg-[#E8D3D3]">
                <div
                  className="relative rounded-full overflow-hidden h-[10px] bg-primary"
                  style={{ width: data.ratingBreakdown[i + 1] + "%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </BoxProviderWithName>
    </div>
  );
};
