import commasIcon from "@/public/Text.svg";

const TestimonialCard = ({
  avatar,
  name,
  text,
  width,
  height,
}: {
  avatar: any;
  name: string;
  text: string;
  width?: string;
  height?: string;
}) => {
  return (
    <div
      className="w-[100%] h-[296px] md:h-[365px] lg:h-[365px] relative"
      style={{ zIndex: 0 }}
      key={name}
    >
      <div className="h-full w-full flex flex-col justify-between gap-[20px] items-start bg-[#F5FBF5] rounded-[16px] pt-[24px] md:pt-[40px] overflow-hidden">
        <img
          src={commasIcon.src}
          alt=""
          className="mx-[24px] md:mx-[40px] w-[32px] h-[32px] md:w-auto md:h-auto"
        />
        <span
          className="plan-text-style-2 px-[24px] md:px-[40px]"
          style={{ textAlign: "start" }}
        >
          {text}
        </span>
        <div className="w-full flex justify-start gap-[12px] items-center py-[16px] md:py-[26px] bg-[#E9EFEA] px-[24px] md:px-[40px]">
          <div className="bg-[#D8E6DD] w-fit rounded-[8px] flex justify-center items-center">
            <img
              src={avatar.src}
              alt=""
              className="w-[60px] h-[60px] md:w-auto md:h-auto"
            />
          </div>
          <h2 className="plan-text-style-2">{name}</h2>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
