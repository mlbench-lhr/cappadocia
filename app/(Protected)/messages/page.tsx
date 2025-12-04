"use client";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";
import { Input } from "@/components/ui/input";
import { SendIcon } from "@/public/allIcons/page";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";

const Messages = () => {
  const [search, setSearch] = useState("");
  const sender = useSearchParams().get("sender");
  const isMobile = useMediaQuery({ maxWidth: 950 });

  console.log("sender-------", sender);

  const messagesArray = [
    {
      sentBy: "user",
      message:
        "Hello, I’m interested in the Cappadocia Red Tour. Can you confirm if pickup from my hotel in Ürgüp is included?",
      date: "04:45 PM",
    },
    {
      sentBy: "vendor",
      message:
        "Hi Ali 👋 Yes, pickup from Ürgüp is available. There’s a €10 fee for that location.",
      date: "04:45 PM",
    },
    {
      sentBy: "user",
      message: "Okay, noted. What’s the group size limit for this tour?",
      date: "04:45 PM",
    },
  ];

  return (
    <BasicStructureWithName
      name="Messages"
      showBackOption={isMobile && sender ? true : false}
    >
      <div className="w-full h-[calc(100vh-150px)] md:h-[calc(100vh-200px)] grid grid-cols-12">
        <div
          className={`${
            sender ? "hidden" : "block"
          } [@media(min-width:950px)]:block h-full col-span-12 [@media(min-width:950px)]:col-span-4 overflow-auto`}
        >
          <div className="w-full h-[150px] flex flex-col justify-start items-start">
            <div className="w-full border-b px-2 lg:px-4 xl:px-6 py-4 text-sm font-semibold">
              All Messages
            </div>
            <div className="w-full border-b px-2 lg:px-4 xl:px-6 py-4">
              <SearchComponent
                width="w-full"
                searchQuery={search}
                onChangeFunc={setSearch}
              />
            </div>
          </div>
          <div className="h-[calc(100%-150px)]  w-full overflow-auto">
            <div className="h-fit w-full">
              {[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
              ].map((item, index) => (
                <Link
                  href={`/messages?sender=${item}`}
                  key={index}
                  className={`w-full flex justify-between items-start gap-[15px] px-2 lg:px-4 xl:px-6 py-4 border-b ${
                    false ? "bg-[#F1F4FF]" : "bg-white"
                  }`}
                >
                  <Image
                    alt=""
                    src={"/placeholderDp.png"}
                    width={35}
                    height={35}
                    className="rounded-[8px]"
                  />
                  <div className="w-[calc(100%-50px)] flex flex-col justify-between items-start">
                    <div className="w-full flex justify-between items-center">
                      <h1 className="text-base font-semibold">
                        Jennifer Markus
                      </h1>
                      <span className="text-sm font-normal text-black/70">
                        05:45 PM
                      </span>
                    </div>
                    <span className="text-[12px] font-normal text-black/70">
                      Hello, I’m interested in the Cappadocia Red Tour. Can you
                      confirm if pickup from my hotel in Ürgüp is included?
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div
          className={`${
            sender ? "block" : "hidden"
          } [@media(min-width:950px)]:block h-full col-span-12 [@media(min-width:950px)]:col-span-8 overflow-auto `}
        >
          <div className="w-full h-[100px] flex flex-col justify-start items-start ">
            <div className="w-full border-b px-2 lg:px-4 xl:px-6 py-4 text-sm font-semibold flex justify-start items-center gap-2">
              <Image
                alt=""
                src={"/placeholderDp.png"}
                width={35}
                height={35}
                className="rounded-[8px]"
              />
              <span className="text-sm font-semibold">Jennifer Markus</span>
            </div>
          </div>
          <div className="h-[calc(100%-180px)] w-full overflow-auto">
            <div className="min-h-full max-h-fit w-full flex justify-end items-start flex-col gap-3 md:gap-6 px-0 md:px-10">
              {messagesArray.map((item, index) => (
                <div
                  key={index}
                  className={`w-full flex justify-between flex-col gap-1`}
                >
                  <div
                    className={`w-fit h-fit text-[12px] font-normal px-2 md:px-6 py-4 leading-normal rounded-t-2xl md:rounded-t-[32px] ${
                      item.sentBy === "user"
                        ? "bg-primary text-white self-end rounded-bl-2xl md:rounded-bl-[32px]"
                        : "bg-secondary rounded-br-2xl md:rounded-br-[32px]"
                    }`}
                  >
                    {item.message}
                  </div>
                  <span
                    className={`text-[12px] font-normal text-black/70 ${
                      item.sentBy === "user" && "self-end"
                    }`}
                  >
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full h-[75px] pt-3 flex flex-col justify-start items-start px-0 md:px-10">
            <div className="w-full h-full text-sm font-semibold flex justify-start items-center gap-2">
              <div className="w-[calc(100%-68px)] h-[60px] flex justify-center items-center rounded-[10px]">
                <Input placeholder="Say Something...." className="h-full" />
              </div>
              <div className="w-[60px] h-[60px] flex justify-center items-center border-2 rounded-[10px]">
                <SendIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasicStructureWithName>
  );
};

export default Messages;
