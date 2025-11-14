import Image from "next/image";

const imageSizes: Record<string, string> = {
  small: "w-[30px] h-[30px]",
  large: "w-[60px] h-[60px]",
};

const headingTextSize: Record<string, string> = {
  small: "text-[10px]",
  large: "text-[18px]",
};

const descTextSize: Record<string, string> = {
  small: "text-[8px]",
  large: "text-[12px]",
};

export const ProfileBadge = ({
  image,
  title,
  subTitle,
  size = "small",
}: {
  image?: string;
  title: string;
  subTitle: string;
  size?: "small" | "large";
}) => {
  return (
    <div className={`flex justify-start items-center gap-1.5`}>
      {image && (
        <Image
          src={image}
          className={`rounded-full object-cover ${imageSizes[size]}`}
          alt=""
          width={30}
          height={30}
        />
      )}
      <div className={`flex flex-col justify-start leading-tight items-start`}>
        <h4 className={`${headingTextSize[size]} font-medium text-black`}>
          {title}
        </h4>
        <h5
          className={`${descTextSize[size]} font-normal text-[rgba(0,0,0,0.50)]`}
        >
          {subTitle}
        </h5>
      </div>
    </div>
  );
};
