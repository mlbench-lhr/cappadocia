'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface BusinessDetailsProps { }

const VendorDetails: React.FC<BusinessDetailsProps> = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };
    return (
            <div className="">
                {/* Header */}
                <div className="flex items-center pb-4">
                    <button
                        onClick={handleBack}
                        className="text-gray-800 mr-3 text-xl"
                    >
                        <FaArrowLeft className="w-4 h-4" /> {/* Arrow icon */}
                    </button>
                    <h2 className="text-2xl font-weight-600 text-gray-800 ">
                        Details
                    </h2>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    {/* Business Name */}
                    <h2 className="text-2xl font-semibold mb-6">Aegean Coast Adventures</h2>

                    {/* Contact Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Contact Person Name */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Contact Person Name</label>
                            <p className="text-gray-600">Elena Papadopoulos</p>
                        </div>

                        {/* Business Email */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Business Email</label>
                            <p className="text-gray-600">elena@aegeanadventures.com</p>
                        </div>

                        {/* IBAN Number */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">IBAN Number</label>
                            <p className="text-gray-600">124353654778888</p>
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Phone</label>
                            <p className="text-gray-600">+90 533 987 6543</p>
                        </div>

                        {/* TÜRSAB Number */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">TÜRSAB Number</label>
                            <p className="text-gray-600">12344</p>
                        </div>

                        {/* Bank Name */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Bank Name</label>
                            <p className="text-gray-600">ABC</p>
                        </div>
                    </div>

                    {/* Third Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Registered Business Address */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Registered Business Address</label>
                            <p className="text-gray-600">Capadocia</p>
                        </div>

                        {/* Languages Supported */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Languages Supported</label>
                            <p className="text-gray-600">English</p>
                        </div>

                        {/* Account Holder Name */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Account Holder Name</label>
                            <p className="text-gray-600">Elena Papadopoulos</p>
                        </div>

                        {/* Currency */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Currency</label>
                            <p className="text-gray-600">Euro</p>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="mb-6 w-[400px]">
                        <Image
                            src="/admin-images/vendors/map.png"
                            alt="Map of Capadocia"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover rounded"
                        />
                    </div>

                    {/* About Us Section */}
                    <div className="border rounded-lg p-6 mb-6 w-[622px]">
                        <h3 className="text-lg font-semibold mb-3">About Us</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Our mission is to provide safe, enjoyable, and memorable travel experiences.
                            With over 15 years of experience, we have served more than 10,000 happy
                            travelers. We are a licensed and registered business with years of experience
                            in the travel and tourism industry. Our services are designed for travelers
                            who value professionalism, transparency, and reliability. We focus on
                            delivering the best customer satisfaction. From the moment you book with
                            us until the end of your journey, we ensure a smooth and enjoyable
                            experience.
                        </p>
                    </div>

                    {/* Documents Uploaded */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold mb-3">Documents Uploaded</h3>
                        <div className="flex items-center gap-2 border py-2 pl-2 pr-14 rounded-lg w-fit">
                            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">PDF</div>
                            <span className="text-sm">Tax ID</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-1 rounded-lg font-semibold">
                            Accept
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-8 rounded-lg font-semibold">
                            Reject
                        </button>
                    </div>
                </div>
            </div>
    );
};

export default VendorDetails;