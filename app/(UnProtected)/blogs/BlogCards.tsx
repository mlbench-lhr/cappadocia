import commasIcon from "@/public/Text.svg";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

const BlogCards = ({
  avatar,
  img,
  name,
  title,
  date,
  _id,
}: {
  avatar: string;
  img: string;
  name: string;
  title: string;
  date: string;
  _id: string;
}) => {
  return (
    <Link
      href={`/blogs/detail/${_id}`}
      className="col-span-1 relative bg-white p-4 rounded-[12px] flex flex-col justify-start items-start gap-5 border-2 border-[#E8E8EA]"
    >
      <Image
        width={100}
        height={100}
        src={img}
        alt=""
        className="w-full h-[240px] rounded-[16px] object-cover"
      />
      <h1 className="font-[600] text-[22px]">{title}</h1>
      <div className="w-full flex justify-between flex-wrap gap-[12px] items-center">
        {(avatar || name) && (
          <div className="w-fit rounded-[8px] flex justify-center items-center gap-3">
            {avatar && (
              <Image
                width={100}
                height={100}
                src={avatar}
                alt=""
                className="w-[36px] h-[36px] rounded-full"
              />
            )}
            {name && (
              <h2 className="font-[500] text-[16px] text-[#97989F]">{name}</h2>
            )}
          </div>
        )}
        <h2 className="font-[400] text-[16px] text-[#97989F]">
          Published on: {moment(date).format("MMM DD, YYYY")}
        </h2>
      </div>
    </Link>
  );
};

export default BlogCards;
