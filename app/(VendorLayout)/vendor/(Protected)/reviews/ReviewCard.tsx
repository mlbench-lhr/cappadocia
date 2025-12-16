"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ReviewWithPopulatedData } from "@/lib/types/review";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import Rating from "@/components/SmallComponents/RatingField";
import Image from "next/image";
import { TextAreaInputComponent } from "@/components/SmallComponents/InputComponents";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function ReviewCard({
  item,
  onSuccess,
}: {
  item: ReviewWithPopulatedData;
  onSuccess?: () => void;
}) {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);
  console.log("ReviewCard item---", item);
  console.log("ReviewCard reply---", reply);
  const handleReviewsUpdate = async () => {
    try {
      setLoading(true);
      const payload = {
        review: [
          ...item.review,
          {
            addedBy: "vendor",
            text: reply,
          },
        ],
      };
      console.log("payload----", payload);
      const response = await axios.put(
        "/api/reviews/update/" + item._id,
        payload
      );
      console.log("response----", response.data);
      setLoading(false);
      onSuccess && onSuccess();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <BoxProviderWithName
      name=""
      leftSideComponent={
        <ProfileBadge
          size="medium"
          title={item.user.fullName}
          subTitle={item.user.email}
          image={item.user.avatar || "/placeholderDp.png"}
        />
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-2 h-fit">
        <h3 className="text-sm md:text-base font-semibold">
          {item.activity.title}
        </h3>
        <div className="flex justify-between items-center w-full gap-3 h-fit">
          <h4 className="text-sm md:text-base font-normal text-black/60 ">
            Comment
          </h4>
          <div className="flex justify-start items-center gap-1 h-fit">
            <Rating value={item.rating} iconsSize="16" />
            <span className="text-sm font-normal text-black/60">
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
              <h4 className="text-sm md:text-base font-normal text-black/60 ">
                Your Reply
              </h4>
            )}
            <span className="text-sm md:text-base font-normal">
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
        {!item.review.find((item2) => item2.addedBy === "vendor") && (
          <>
            <div className="w-full">
              <TextAreaInputComponent
                label="Reply"
                value={reply}
                placeholder="Write your reply..."
                onChange={(e) => setReply(e)}
              />
            </div>
            <Button
              variant={"main_green_button"}
              disabled={!reply.trim()}
              className={`${!reply.trim() && "!bg-[#C0BFC0]"}`}
              loading={loading}
              onClick={handleReviewsUpdate}
            >
              Post Reply
            </Button>
          </>
        )}
      </div>
    </BoxProviderWithName>
  );
}
