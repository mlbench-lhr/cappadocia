"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import { Button } from "@/components/ui/button";
import {
  CancellationPolicyIcon,
  ClockIcon,
  CheckIcon,
  Vehicle2Icon,
  WorldIcon,
  CrossIcon,
  LocationIcon,
  StarIcon,
  PaymentIcon,
} from "@/public/allIcons/page";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Link from "next/link";
import AddressLocationSelector, { LocationData } from "@/components/map";
import ParticipantsSelector from "@/components/SmallComponents/ParticipantsSelector";
import ImageGallery from "./ImageGallery";
import { useParams } from "next/navigation";
import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import axios from "axios";
import { AlternativeOptions } from "./AlternativeOptions";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);
  const LocationIconWithPadding = () => {
    return (
      <div className="py-2 bg-white">
        <LocationIcon color="rgba(0, 0, 0, 0.50)" />
      </div>
    );
  };
  const [location1, setLocation1] = useState<LocationData>({
    address: "1600 Amphitheatre Parkway, Mountain View, CA",
    coordinates: { lat: 37.4224764, lng: -122.0842499 },
  });
  const [data, setData] = useState<ToursAndActivityWithVendor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  console.log("data?.vendor?.vendorDetails?.address-----", data);

  const { id }: { id: string } = useParams();
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/toursAndActivity/detail/${id}`);
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
  if (!data) {
    return null;
  }
  return (
    <BasicStructureWithName name="Details" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit pb-8">
        <BoxProviderWithName noBorder={true}>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <ProfileBadge
              size="medium"
              title="SkyView Balloon Tours"
              subTitle={"TÜRSAB Number: " + 324234}
              image="/userDashboard/img2.png"
            />
            <h1 className="text-[20px] md:text-[26px] font-semibold mt-2">
              Blue Tour – Hidden Cappadocia
            </h1>
            <ImageGallery imagesParam={data?.uploads} />
            <BoxProviderWithName
              name="Trip Description:"
              className="text-base mt-2"
            >
              <span className="text-[14px] fot-normal leading-[14px]">
                {data?.description}
              </span>
            </BoxProviderWithName>
            <BoxProviderWithName
              name="About this tour:"
              className="text-base !p-0 mt-2"
              noBorder={true}
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <BoxProviderWithName className="text-base">
                  <div className="w-full flex-col flex justify-start items-start gap-5">
                    <ProfileBadge
                      size="custom"
                      title="SkyView Balloon Tours"
                      subTitle={
                        "TÜRSAB Number: " +
                        data?.vendor?.vendorDetails?.tursabNumber
                      }
                      icon={<CancellationPolicyIcon />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Pick-up Service"
                      subTitle={
                        data?.pickupAvailable
                          ? "Pickup from your location"
                          : "Pickup service not available"
                      }
                      icon={<Vehicle2Icon />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Tour Duration"
                      subTitle={data?.duration + " hours"}
                      icon={<ClockIcon color="#D8018D" size={20} />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Languages Offered"
                      subTitle={data?.languages?.join(", ") || ""}
                      icon={<WorldIcon />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Payment Options"
                      subTitle={"Book Now, Pay Later Available"}
                      icon={<PaymentIcon />}
                    />
                  </div>
                </BoxProviderWithName>
                <BoxProviderWithName className="text-base !p-0" noBorder={true}>
                  <div className="w-full bg-secondary rounded-2xl border px-2 md:px-3.5 py-3 flex flex-col justify-start items-start gap-0 h-fit">
                    <span className="text-[12px] font-normal text-[#6E7070]">
                      From
                    </span>
                    <span className="text-[20px] md:text-[26px] font-semibold text-primary">
                      $569.00
                    </span>
                    <span className="text-[12px] font-normal text-[#6E7070]">
                      /Person
                    </span>
                    <Button variant={"main_green_button"} className="mt-4">
                      Check availability
                    </Button>
                  </div>
                </BoxProviderWithName>
              </div>
            </BoxProviderWithName>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
              <BoxProviderWithName name="What’s Included" className="text-base">
                <div className="w-full flex-col flex justify-start items-start gap-5">
                  {data?.included?.map((item, index) => (
                    <IconAndTextTab2
                      key={index}
                      icon={<CheckIcon />}
                      text={item}
                      textClasses="text-black text-[14px] font-normal"
                    />
                  ))}
                </div>
              </BoxProviderWithName>
              <BoxProviderWithName
                name="Not Included in the Package:"
                className="text-base"
              >
                <div className="w-full flex-col flex justify-start items-start gap-5">
                  {data?.notIncluded?.map((item, index) => (
                    <IconAndTextTab2
                      key={index}
                      icon={<CrossIcon />}
                      text={item}
                      textClasses="text-black text-[14px] font-normal"
                    />
                  ))}
                </div>
              </BoxProviderWithName>
            </div>
            <BoxProviderWithName
              name="Itinerary"
              noBorder={true}
              className="!p-0 mt-4"
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="relative w-full h-[490px] bg-red-00 flex flex-col justify-between items-start">
                  <div className="absolute left-2.5 border-[1px] top-3 h-[90%] border-black/70 border-dashed"></div>
                  <div className="relative w-full h-full bg-red-00 flex flex-col justify-between items-start">
                    {data?.itinerary.map((item, index) => (
                      <IconAndTextTab2
                        key={index}
                        icon={<LocationIconWithPadding />}
                        text={item}
                        textClasses="text-black text-[14px] font-normal pt-2"
                        alignClass=" items-start "
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full col-span-1">
                  <AddressLocationSelector
                    value={data?.vendor?.vendorDetails?.address}
                    onChange={(data) => {
                      setLocation1(data);
                    }}
                    readOnly={true}
                    label="Enter Your Business Address"
                    placeholder="Type address or click on map"
                  />
                </div>
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName
              name="Select your travel date and number of guests to see if this tour is available."
              className="mt-4"
            >
              <div className="w-full grid grid-cols-3 md:grid-cols-9 gap-3">
                <div className="space-y-1 col-span-3">
                  <Label className="text-[14px] font-semibold">
                    Select Date
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      Nov 2, 2025
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="Nov 2,2025">Nov 2,2025</SelectItem>
                      <SelectItem value="Apr 2, 2025">Apr 2, 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 col-span-3">
                  <Label className="text-[14px] font-semibold">Language</Label>
                  <Select>
                    <SelectTrigger className="w-full">English</SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Turkish">Turkish</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 col-span-3">
                  <ParticipantsSelector />{" "}
                </div>
              </div>
              <div className="flex justify-start items-start md:items-center flex-col md:flex-row gap-2 md:gap-5 mt-4">
                <span className="text-primary text-[18px] font-semibold">
                  Available — €120 per person
                </span>
                <Button variant={"main_green_button"} size={"sm"}>
                  <Link href={`/bookings/book`}>Book now</Link>
                </Button>
              </div>
            </BoxProviderWithName>
            <AlternativeOptions />
            <BoxProviderWithName
              name="Reviews"
              noBorder={true}
              className="!p-0 mt-4"
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="col-span-1 rounded-2xl px-2 md:px-3.5 py-3 bg-secondary border">
                  <div className="flex justify-start items-center w-full gap-3">
                    <span className="text-[14px] font-medium text-primary">
                      5
                    </span>
                    <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                      <div className="w-[70%] relative rounded-full overflow-hidden h-[8px] bg-primary"></div>
                    </div>
                  </div>
                  <div className="flex justify-start items-center w-full gap-3">
                    <span className="text-[14px] font-medium text-primary">
                      4
                    </span>
                    <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                      <div className="w-[50%] relative rounded-full overflow-hidden h-[8px] bg-primary"></div>
                    </div>
                  </div>
                  <div className="flex justify-start items-center w-full gap-3">
                    <span className="text-[14px] font-medium text-primary">
                      3
                    </span>
                    <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                      <div className="w-[60%] relative rounded-full overflow-hidden h-[8px] bg-primary"></div>
                    </div>
                  </div>
                  <div className="flex justify-start items-center w-full gap-3">
                    <span className="text-[14px] font-medium text-primary">
                      2
                    </span>
                    <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                      <div className="w-[30%] relative rounded-full overflow-hidden h-[8px] bg-primary"></div>
                    </div>
                  </div>
                  <div className="flex justify-start items-center w-full gap-3">
                    <span className="text-[14px] font-medium text-primary">
                      1
                    </span>
                    <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                      <div className="w-[20%] relative rounded-full overflow-hidden h-[8px] bg-primary"></div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 rounded-2xl px-2 md:px-3.5 py-3 bg-secondary border flex flex-col justify-center items-center gap-2">
                  <h1 className="text-4xl md:text-[56px] font-semibold text-primary">
                    4.0
                  </h1>
                  <div className="w-fit flex justify-start items-center gap-1">
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </div>
                  <span className="text-[14px] font-normal text-black/70">
                    9,676 reviews
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
                <div className="rounded-2xl px-2 md:px-3.5 py-3 border flex flex-col justify-center items-start gap-2">
                  <div className="w-full flex justify-between items-center">
                    <ProfileBadge
                      size="medium"
                      title="John D."
                      subTitle={"Apr 10, 2024"}
                      image="/userDashboard/img2.png"
                    />
                    <div className="w-fit flex justify-start items-center gap-1">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <span className="text-[12px] font-medium text-black/60">
                        5
                      </span>
                    </div>
                  </div>
                  <span className="text-[14px] font-normal text-black/70 leading-[18px]">
                    The The sunrise hot air balloon ride was the absolute
                    highlight of our trip to Cappadocia. The pickup from our
                    hotel was smooth, the driver was punctual, and the staff at
                    the launch site were super professional. Our pilot explained
                    everything clearly, and once we were in the air, it was pure
                    magic — floating over the fairy chimneys with the sun rising
                    behind the valleys. The ride lasted about an hour, which was
                    perfect. After landing, they even served us a small
                    celebratory drink. Highly recommend booking in advance as
                    spots sell out quickly air balloon ride was absolutely
                    magical! Everything was well organized, and the view of
                    Cappadocia at sunrise is something I’ll never forget.
                  </span>
                </div>
                <div className="rounded-2xl px-2 md:px-3.5 py-3 border flex flex-col justify-center items-start gap-2">
                  <div className="w-full flex justify-between items-center">
                    <ProfileBadge
                      size="medium"
                      title="John D."
                      subTitle={"Apr 10, 2024"}
                      image="/userDashboard/img2.png"
                    />
                    <div className="w-fit flex justify-start items-center gap-1">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <span className="text-[12px] font-medium text-black/60">
                        5
                      </span>
                    </div>
                  </div>
                  <span className="text-[14px] font-normal text-black/70 leading-[18px]">
                    The The sunrise hot air balloon ride was the absolute
                    highlight of our trip to Cappadocia. The pickup from our
                    hotel was smooth, the driver was punctual, and the staff at
                    the launch site were super professional. Our pilot explained
                    everything clearly, and once we were in the air, it was pure
                    magic — floating over the fairy chimneys with the sun rising
                    behind the valleys. The ride lasted about an hour, which was
                    perfect. After landing, they even served us a small
                    celebratory drink. Highly recommend booking in advance as
                    spots sell out quickly air balloon ride was absolutely
                    magical! Everything was well organized, and the view of
                    Cappadocia at sunrise is something I’ll never forget.
                  </span>
                </div>
                <Button variant={"outline"} className="text-primary">
                  See more Reviews
                </Button>
              </div>
            </BoxProviderWithName>
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
