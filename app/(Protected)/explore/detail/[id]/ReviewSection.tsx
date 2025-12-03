"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios from "axios";
import ReviewSkeleton from "@/components/Skeletons/ReviewSkeleton";
import Rating from "@/components/SmallComponents/RatingField";
import { ReviewWithPopulatedData } from "@/lib/types/review";
import Image from "next/image";

export interface ReviewsApiResponse {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<number, number>;
}

export default function ReviewSection({
  type,
  idFromProp,
}: {
  idFromProp?: string;
  type: "vendor" | "activity";
}) {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const [data, setData] = useState<ReviewsApiResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewWithPopulatedData[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [limit, setLimit] = useState<number>(2);

  const { id }: { id: string } = useParams();
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(
          `/api/reviews/${
            type === "activity" ? "getActivityReviews" : "getVendorReviews"
          }/${idFromProp || id}?limit=${limit}`
        );
        console.log("response-------", response);

        if (response.data?.data?.ratingBreakdown) {
          setData({
            averageRating: response.data?.data?.averageRating,
            totalReviews: response.data?.data?.totalReviews,
            ratingBreakdown: response.data?.data?.ratingBreakdown,
          });
        }
        if (response.data?.data?.reviews) {
          setReviews(response.data?.data?.reviews);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, [limit]);
  console.log(data, loading);

  if (!data || loading) {
    return <ReviewSkeleton />;
  }
  return (
    <div className="flex flex-col justify-start items-start w-full gap-3 h-fit pb-8">
      <BoxProviderWithName name="Reviews" noBorder={true} className="!p-0 mt-4">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="col-span-1 rounded-2xl px-2 md:px-3.5 py-3 bg-secondary border flex flex-col justify-between items-start">
            <div className="flex justify-start items-center w-full gap-3">
              <span className="text-[14px] font-medium text-primary">5</span>
              <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                <div
                  className="relative rounded-full overflow-hidden h-[8px] bg-primary"
                  style={{ width: data.ratingBreakdown[1] + "%" }}
                ></div>{" "}
              </div>
            </div>
            <div className="flex justify-start items-center w-full gap-3">
              <span className="text-[14px] font-medium text-primary">4</span>
              <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                <div
                  className="relative rounded-full overflow-hidden h-[8px] bg-primary"
                  style={{ width: data.ratingBreakdown[2] + "%" }}
                ></div>{" "}
              </div>
            </div>
            <div className="flex justify-start items-center w-full gap-3">
              <span className="text-[14px] font-medium text-primary">3</span>
              <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                <div
                  className="relative rounded-full overflow-hidden h-[8px] bg-primary"
                  style={{ width: data.ratingBreakdown[3] + "%" }}
                ></div>
              </div>
            </div>
            <div className="flex justify-start items-center w-full gap-3">
              <span className="text-[14px] font-medium text-primary">2</span>
              <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                <div
                  className="relative rounded-full overflow-hidden h-[8px] bg-primary"
                  style={{ width: data.ratingBreakdown[4] + "%" }}
                ></div>
              </div>
            </div>
            <div className="flex justify-start items-center w-full gap-3">
              <span className="text-[14px] font-medium text-primary">1</span>
              <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                <div
                  className="relative rounded-full overflow-hidden h-[8px] bg-primary"
                  style={{ width: data.ratingBreakdown[5] + "%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="col-span-1 rounded-2xl px-2 md:px-3.5 py-3 bg-secondary border flex flex-col justify-center items-center gap-2">
            <h1 className="text-4xl md:text-[56px] font-semibold text-primary">
              {Math.floor(data.averageRating)}
            </h1>
            <div className="w-fit flex justify-start items-center gap-1">
              <Rating value={data.averageRating} />
            </div>
            <span className="text-[14px] font-normal text-black/70">
              {data.totalReviews} reviews
            </span>
          </div>
        </div>
      </BoxProviderWithName>
      <BoxProviderWithName
        name="All Reviews"
        noBorder={true}
        className="!p-0 mt-4"
      >
        <div className="w-full flex-col flex justify-start items-center gap-3.5">
          {reviews?.map((item, index) => (
            <div
              key={index}
              className="w-full rounded-2xl px-2 md:px-3.5 py-3 border flex flex-col justify-center items-start gap-2"
            >
              <div className="w-full flex justify-between items-center">
                <ProfileBadge
                  size="medium"
                  title={item.user.fullName}
                  subTitle={item.user.email}
                  image={item.user.avatar}
                />
                <div className="w-fit flex justify-start items-center gap-1">
                  <Rating value={item.rating} iconsSize="18" />
                  <span className="text-[12px] font-medium text-black/60">
                    {item.rating}
                  </span>
                </div>
              </div>
              {item.review.map((item2, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col justify-start items-start"
                >
                  {item2.addedBy === "vendor" && (
                    <div className="w-full mb-2">
                      <ProfileBadge
                        size="medium"
                        title={item.vendor.vendorDetails.companyName}
                        subTitle={
                          "TÜRSAB Number: " +
                          item.vendor.vendorDetails.tursabNumber
                        }
                        image={item.vendor.avatar || "/placeholderDp.png"}
                      />
                    </div>
                  )}
                  <span className="text-[14px] font-normal text-black/70 leading-[18px]">
                    {item2.text}
                  </span>
                  {item2.uploads && (
                    <div className="w-full grid-cols-3 gap-2">
                      {item2.uploads.map((image, index2) => (
                        <Image
                          src={image}
                          key={index2}
                          height={100}
                          width={100}
                          className="col-span-1 object-cover object-center h-[100px] "
                          alt=""
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          {data.totalReviews > 2 && (
            <Button
              variant={"outline"}
              className="text-primary"
              onClick={() => {
                setLimit(limit + 3);
              }}
            >
              See More Reviews
            </Button>
          )}
        </div>
      </BoxProviderWithName>
    </div>
  );
}
