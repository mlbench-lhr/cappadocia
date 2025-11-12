import Image from "next/image";

export const ProfileBadge = ({
  image,
  title,
  subTitle,
}: {
  image?: string;
  title: string;
  subTitle: string;
}) => {
  return (
    <div className={`flex justify-start items-center gap-1.5`}>
      {image && (
        <Image
          src={image}
          className="rounded-full object-cover w-[30px] h-[30px]"
          alt=""
          width={30}
          height={30}
        />
      )}
      <div className={`flex flex-col justify-start leading-tight items-start`}>
        <h4 className="text-[10px] font-medium text-black">{title}</h4>
        <h5 className="text-[8px] font-normal text-[rgba(0,0,0,0.50)]">
          {subTitle}
        </h5>
      </div>
    </div>
  );
};
