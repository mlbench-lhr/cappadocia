"use client";
import React from "react";
import {
  ChevronLeft,
  Clock,
  CreditCard,
  Timer,
  Users,
  MapPin,
  Navigation,
  Phone,
  Mail,
} from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Header Component
const Header: React.FC = () => {
  const router = useRouter();
  const [openRejectionModal, setOpenRejectionModal] = React.useState(false);
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="flex items-center justify-between bg-white">
      <div className="flex items-center pb-4">
        <button onClick={handleBack} className="text-gray-800 mr-3 text-xl">
          <FaArrowLeft className="w-4 h-4" /> {/* Arrow icon */}
        </button>
        <h2 className="text-2xl font-weight-600 text-gray-800 ">
          Booking Details
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Payment Status:</span>
        <span className="px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
          pending
        </span>
      </div>
    </div>
  );
};

// Booking Information Component
const BookingInformation: React.FC = () => {
  return (
    <div className="">
      <div className="mb-4">
        <h2 className="text-xl font-bold inline">Booking Information / </h2>
        <span className="text-xl font-bold text-pink-600">#1242</span>
      </div>
      <div className="mb-4">
        <span className="text-blue-500 font-medium">Tour Status: upcoming</span>
      </div>

      <div className="mb-6">
        <img
          src="/admin-images/reservation/baloon.png"
          alt="Cappadocia balloons"
          className="w-full max-w-lg rounded-3xl object-cover h-80"
        />
      </div>

      <h3 className="text-xl font-bold mb-4">
        Cappadocia balloons flying at sunrise
      </h3>

      <div className="space-y-3 text-gray-600">
        <div className="flex items-center gap-3">
          <Image
            src="/admin-images/reservation/clock.svg"
            alt="phone"
            width={20}
            height={20}
          />
          <span>Date & Time: Jun 20, 2024 | 03:00 PM</span>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/admin-images/reservation/booking.svg"
            alt="phone"
            width={20}
            height={20}
          />
          <span>Booking ID: #CT-2025-001242</span>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/admin-images/reservation/duration.svg"
            alt="phone"
            width={20}
            height={20}
          />
          <span>Duration: 60 Minutes</span>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/admin-images/reservation/price.svg"
            alt="phone"
            width={20}
            height={20}
          />
          <span>Price Per Person: €120</span>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/admin-images/reservation/payment.svg"
            alt="phone"
            width={20}
            height={20}
          />
          <span>Payment Method: Not completed</span>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/admin-images/reservation/people.svg"
            alt="phone"
            width={20}
            height={20}
          />
          <span>Participants: 2 Adults</span>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/admin-images/reservation/total.svg"
            alt="phone"
            width={20}
            height={20}
          />
          <span>Total Price: €350</span>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/admin-images/reservation/location.svg"
            alt="phone"
            width={20}
            height={20}
          />
          <span>Location: Cappadocia,Turkey</span>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/admin-images/reservation/meeting.svg"
            alt="phone"
            width={20}
            height={20}
          />
          <span>Meeting Point: Göreme Town Center</span>
        </div>
      </div>
    </div>
  );
};

// Vendor Information Component
const VendorInformation: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border mb-6">
      <h3 className="text-lg font-bold mb-4">Vendor / Operator Information</h3>
      <div className="border p-4 rounded-lg mb-2">
        <div className="flex items-center justify-between mb-4 ">
          <div className="flex items-start gap-3">
            <img
              src="/admin-images/reservation/baloon.png"
              alt="SkyView Balloon Tours"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="font-bold text-lg">SkyView Balloon Tours</h4>
              <p className="text-sm text-gray-500">TÜRSAB Number: 12345</p>
            </div>
            <div className="flex items-center gap-1 text-pink-600 bg-[#EB00891A] px-2 py-1 rounded-full">
              <Image
                src="/admin-images/reservation/map.svg"
                alt="phone"
                width={20}
                height={20}
              />
              <span className="text-sm">1.2 mi</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700">
          Chat
        </button>
      </div>
      <ContactInformation />
    </div>
  );
};

// Contact Information Component
const ContactInformation: React.FC = () => {
  return (
    <div className="">
      <h3 className="text-lg font-bold mb-4">Contact Information</h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-600">
          <Image
            src="/admin-images/reservation/phone.svg"
            alt="phone"
            width={20}
            height={20}
          />
          <span className="text-sm">+90 384 123 4567</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600 text-sm">
          <Image
            src="/admin-images/reservation/mail.svg"
            alt="phone"
            width={20}
            height={20}
          />
          <span>Info@Skyviewballoon.Com</span>
        </div>
      </div>
    </div>
  );
};

// Customer Information Component
const CustomerInformation: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border mb-6">
      <h3 className="text-lg font-bold mb-4">Customer Information</h3>

      <div className="flex items-center gap-3 mb-3">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
          alt="Amanda Chavez"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="text-sm font-bold">Amanda Chavez</h4>
          <p className="text-sm text-gray-500">annadachavez@gmail.com</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-600 ml-15">
        <Image
          src="/admin-images/reservation/phone.svg"
          alt="phone"
          width={20}
          height={20}
        />
        <span className="text-sm">+90 384 123 4567</span>
      </div>
    </div>
  );
};

// QR Code Component
const QRCode: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-bold mb-2">QR Code</h3>

      <div className="flex gap-4">
        <div className="w-32 h-32 ">
          <Image
            src="/admin-images/reservation/QR.png"
            alt="QR"
            width={20}
            height={20}
            className="w-full h-full"
          />
        </div>

        <div className="flex-1">
          <p className="text-gray-600 mb-2">
            Show this QR code at the tour start point for check-in.
          </p>
          <a href="#" className="text-pink-600 text-sm underline">
            12tsNYRjzZ3LcLyEvn4XJCB4FV12GbWU
          </a>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const ReservationDetails: React.FC = () => {
  return (
    <div className="">
      <Header />

      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <BookingInformation />
          </div>

          <div>
            <VendorInformation />

            <CustomerInformation />
            <QRCode />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
