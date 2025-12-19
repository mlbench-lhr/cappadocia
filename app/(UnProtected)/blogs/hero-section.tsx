import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative mt-[40px] w-full">
      <Image
        width={100}
        height={100}
        src={"/hero img.png"}
        alt=""
        className="w-full h-[170px] md:h-[600px] rounded-[12px] object-cover object-center"
      />
      <div className="flex justify-between flex-col gap-2 md:gap-[24px] translate-y-[-50%] translate-x-[12px] md:translate-x-[70px] items-start w-[calc(100%-24px)] md:w-[600px] rounded-[12px] p-4 md:p-[40px] bg-white border-[1px] border-[#E8E8EA] shadow-[0_12px_24px_-6px_rgba(24,26,42,0.12)]">
        <h1 className="text-[16px] md:text-[28px] font-[600] leading-[20px] md:leading-[40px]">
          Discover the Best Tours & Activities in Cappadocia
        </h1>
      </div>
    </section>
  );
}
