"use client";
import AddressLocationSelector, { LocationData } from "@/components/map";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import RejectVendorDialog from "@/components/RejectVendorDialog";
import VendorDetailsSkeleton from "@/components/Skeletons/VendorDetailsSkeleton";
import { VendorDetails } from "@/lib/mongodb/models/User";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";

interface BusinessDetailsProps {}

const VendorDetailsComp: React.FC<BusinessDetailsProps> = () => {
  const [data, setData] = useState<VendorDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [commission, setCommission] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isRejected, setIsRejected] = useState<boolean>(false);

  const router = useRouter();
  const { id }: { id: string } = useParams();
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(
          `/api/admin/vendor-applications/detail/${id}`
        );
        if (response.data?.user) {
          setData(response.data?.user);
          const existing = (response.data?.user as VendorDetails)?.commission;
          setCommission(
            typeof existing === "number" && !isNaN(existing)
              ? String(existing)
              : ""
          );
          setIsVerified(!!response.data?.isRoleVerified);
          setIsRejected(!!response.data?.isRejected);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, []);
  const accept = async () => {
    try {
      const pct = Number(commission);
      if (!commission || isNaN(pct) || pct < 0 || pct > 100) {
        Swal.fire({
          icon: "error",
          title: "Commission required",
          text: "Please set a valid commission percentage between 0 and 100.",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }
      setActionLoading(true);
      await axios.put(`/api/admin/vendor-applications/update/${id}`, {
        isRoleVerified: true,
        "vendorDetails.commission": pct,
      });
      setActionLoading(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Vendor approved Successfully`,
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/admin/vendor-applications");
    } catch (error) {
      console.log("err---", error);
    }
  };

  if (!data || loading) {
    return <VendorDetailsSkeleton />;
  }

  return (
    <BasicStructureWithName name="Vendor Details" showBackOption>
      {/* Main Card */}
      <div className="bg-white rounded-lg p-2 md:p-6 border border-gray-200">
        {/* Business Name */}
        <h2 className="text-sm md:text-lg md:text-2xl font-semibold mb-6">
          {data?.companyName}
        </h2>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 mb-3 md:mb-6">
          {/* Contact Person Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Contact Person Name
            </label>
            <p className="text-gray-600">{data?.contactPersonName}</p>
          </div>

          {/* Business Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Business Email
            </label>
            <p className="text-gray-600">{data?.businessEmail}</p>
          </div>

          {/* IBAN Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              IBAN Number
            </label>
            <p className="text-gray-600">{data?.paymentInfo?.ibanNumber}</p>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 mb-3 md:mb-6">
          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-1">Phone</label>
            <p className="text-gray-600">{data?.contactPhoneNumber}</p>
          </div>

          {/* TÜRSAB Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              TÜRSAB Number
            </label>
            <p className="text-gray-600">{data?.tursabNumber}</p>
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Bank Name
            </label>
            <p className="text-gray-600">{data?.paymentInfo?.bankName}</p>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 mb-3 md:mb-6">
          {/* Registered Business Address */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Registered Business Address
            </label>
            <p className="text-gray-600">{data?.address?.address}</p>
          </div>

          {/* Languages Supported */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Languages Supported
            </label>
            <p className="text-gray-600">{data?.languages?.join(", ")}</p>
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Account Holder Name
            </label>
            <p className="text-gray-600">
              {data?.paymentInfo?.accountHolderName}
            </p>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-semibold mb-1">Currency</label>
            <p className="text-gray-600">{data?.paymentInfo?.currency}</p>
          </div>
        </div>

        {/* Map */}
        {data?.address && (
          <div className="mb-6 w-full md:w-[400px]">
            <AddressLocationSelector
              value={data?.address as LocationData}
              readOnly={true}
              label="Enter Your Business Address"
              className=" w-full h-[188px] rounded-xl "
              placeholder="Type address or click on map"
            />{" "}
          </div>
        )}

        {/* About Us Section */}
        <div className="border rounded-lg p-2 md:p-6 mb-3 md:mb-6 w-full md:w-[622px]">
          <h3 className="text-sm md:text-lg font-semibold mb-3">About Us</h3>
          <p className="text-gray-500 leading-relaxed">{data?.aboutUs}</p>
        </div>

        {/* Commission Field */}
        <div className="border rounded-lg p-2 md:p-6 mb-3 md:mb-6 w-full md:w-[622px]">
          <label className="block text-sm font-semibold mb-2">
            Commission (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            className="border rounded-md px-3 py-2 w-full text-sm"
            placeholder="Enter commission percentage"
          />
          <p className="text-xs text-gray-500 mt-2">
            Required to accept vendor account request.
          </p>
        </div>

        {/* Documents Uploaded */}
        <div className="mb-6 w-full">
          <h3 className="text-sm font-semibold mb-3">Documents Uploaded</h3>
          <div className="mb-6 w-full grid grid-cols-4 md:grid-cols-12 gap-4">
            {data?.documents?.map((item, index) => (
              <div
                key={index}
                className="col-span-4 flex flex-col items-center gap-2 border pb-4 rounded-lg w-full"
              >
                {item?.includes("raw") ? (
                  <>
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                        item
                      )}&embedded=true`}
                      width="100%"
                      height="300px"
                    />
                    <a
                      href={item}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate flex-1"
                    >
                      Document {index + 1}
                    </a>
                  </>
                ) : (
                  <>
                    <Image
                      src={item}
                      alt=""
                      height={300}
                      width={300}
                      className="w-[100%] object-cover h-[300px]"
                    />
                    <span className="text-sm"> Document {index + 1}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {!isVerified && (
          <div className="flex gap-3">
            <button
              onClick={accept}
              disabled={actionLoading}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-1 rounded-lg font-semibold"
            >
              {actionLoading ? "Accepting..." : "Accept"}
            </button>
            <RejectVendorDialog id={id} />
          </div>
        )}
      </div>
    </BasicStructureWithName>
  );
};

export default VendorDetailsComp;
