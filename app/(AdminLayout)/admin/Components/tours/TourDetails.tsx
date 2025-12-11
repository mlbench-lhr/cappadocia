'use client'
import React from 'react';
import { Clock, MapPin, Globe, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface TourDetailsProps { }

const TourDetails: React.FC<TourDetailsProps> = () => {
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
            <div className="bg-white rounded-lg p-6">
                {/* Title and Category */}
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-semibold">Blue Tour – Hidden Cappadocia</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Category</span>
                        <span className="text-sm text-gray-600">Tour</span>
                    </div>
                </div>

                {/* Image Grid */}
                <div className="flex gap-3  mb-6">
                    <div className='w-1/3'>
                        <img
                            src="/admin-images/tours/image1.png"
                            alt="Cappadocia caves"
                            className="w-full h-64 object-cover rounded-lg row-span-2"
                        />
                    </div>
                    <div className='w-1/3'>
                        <img
                            src="/admin-images/tours/image2.png"
                            alt="Cappadocia landscape"
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    </div>
                    <div className="flex flex-col gap-3 w-1/3">
                        <img
                            src="/admin-images/tours/image3.png"
                            alt="Hot air balloons sunset"
                            className="w-full h-30.5 object-cover rounded-lg"
                        />
                        <img
                            src="/admin-images/tours/image4.png"
                            alt="Hot air balloons"
                            className="w-full h-30.5 object-cover rounded-lg"
                        />
                    </div>
                </div>

                {/* Tour Description */}
                <div className="mb-6 border border-gray-200 rounded-lg p-3">
                    <h3 className="font-semibold mb-2">Tour Description:</h3>
                    <p className="text-gray-600 text-sm">
                        Enjoy a breathtaking sunrise hot air balloon flight over Cappadocia's fairy chimneys, valleys, and rock formations. The tour includes hotel pick-up, a light breakfast, and a traditional champagne toast after landing.
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - About this tour */}
                    <div>
                        <h3 className="font-semibold mb-4">About this tour:</h3>

                        <div className="space-y-4 border border-gray-200 rounded-lg p-3">
                            {/* Cancellation Policy */}
                            <div className="flex gap-3 items-center">
                                <div className="">
                                    <Image src={"/admin-images/tours/cancellation.svg"} alt="cancel" width={26} height={26} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Cancellation Policy</h4>
                                    <p className="text-gray-600 text-sm">Cancel up to 24 hours before the tour date for a full refund.</p>
                                </div>
                            </div>

                            {/* Pick-up Service */}
                            <div className="flex gap-3 items-center">
                                <div className="">
                                    <Image src={"/admin-images/tours/pickup.svg"} alt="cancel" width={26} height={26} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Pick-up Service</h4>
                                    <p className="text-gray-600 text-sm">Pickup from you location</p>
                                </div>
                            </div>

                            {/* Tour Duration */}
                            <div className="flex gap-3 items-center">
                                <div className="">
                                    <Image src={"/admin-images/tours/duration.svg"} alt="cancel" width={26} height={26} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Tour Duration</h4>
                                    <p className="text-gray-600 text-sm">4 hours</p>
                                </div>
                            </div>

                            {/* Languages Offered */}
                            <div className="flex gap-3 items-center">
                                <div className="">
                                    <Image src={"/admin-images/tours/language.svg"} alt="cancel" width={26} height={26} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Languages Offered</h4>
                                    <p className="text-gray-600 text-sm">English, Turkish, Arabic</p>
                                </div>
                            </div>

                            {/* Payment Options */}
                            <div className="flex gap-3 items-center">
                                <div className="">
                                    <Image src={"/admin-images/tours/payment.svg"} alt="cancel" width={26} height={26} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Payment Options</h4>
                                    <p className="text-gray-600 text-sm">Book Now, Pay Later Available</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Date & Time */}
                    <div>
                        <h3 className="font-semibold mb-4">Date & Time</h3>

                        <div className="flex gap-2">
                            {/* Nov 2, 2025 */}
                            <div className="border border-gray-200 rounded-lg p-4 w-[190px]">
                                <h4 className="text-[#B32053] font-semibold text-sm mb-1">Nov 2, 2025</h4>
                                <p className="text-gray-600 text-xs mb-3">11:00 AM - 1:00 PM</p>
                                <p className="text-[#B32053] font-semibold text-lg">$50.00</p>
                            </div>

                            {/* Apr 2, 2025 */}
                            <div className="border border-gray-200 rounded-lg p-4 w-[190px]">
                                <h4 className="text-[#B32053] font-semibold text-sm mb-1">Apr 2, 2025</h4>
                                <p className="text-gray-600 text-xs mb-3">11:00 AM - 1:00 PM</p>
                                <p className="text-[#B32053] font-semibold text-lg">$200.00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What's Included & Not Included */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* What's Included */}
                    <div className='border border-gray-200 rounded-lg p-4'>
                        <h3 className="font-semibold mb-4">What's Included</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Image src={"/admin-images/tours/tick.svg"} alt="cancel" width={24} height={24} />
                                <span className="text-sm text-gray-700">Professional English-speaking guide</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src={"/admin-images/tours/tick.svg"} alt="cancel" width={24} height={24} />
                                <span className="text-sm text-gray-700">Hotel pick-up & drop-off (Cappadocia area)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src={"/admin-images/tours/tick.svg"} alt="cancel" width={24} height={24} />
                                <span className="text-sm text-gray-700">Air-conditioned transportation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src={"/admin-images/tours/tick.svg"} alt="cancel" width={24} height={24} />
                                <span className="text-sm text-gray-700">Lunch at a local restaurant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src={"/admin-images/tours/tick.svg"} alt="cancel" width={24} height={24} />
                                <span className="text-sm text-gray-700">Bottled water</span>
                            </div>
                        </div>
                    </div>

                    {/* Not Included */}
                    <div className='border border-gray-200 rounded-lg p-4'>
                        <h3 className="font-semibold mb-4">Not Included in the Package:</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Image src={"/admin-images/tours/cross.svg"} alt="cancel" width={24} height={24} />
                                <span className="text-sm text-gray-700">Personal expenses (souvenirs, snacks, etc.)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src={"/admin-images/tours/cross.svg"} alt="cancel" width={24} height={24} />
                                <span className="text-sm text-gray-700">Tips for guide and driver</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src={"/admin-images/tours/cross.svg"} alt="cancel" width={24} height={24} />
                                <span className="text-sm text-gray-700">Drinks at lunch (unless specified)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src={"/admin-images/tours/cross.svg"} alt="cancel" width={24} height={24} />
                                <span className="text-sm text-gray-700">Optional activities (hot air balloon flight if not in package)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src={"/admin-images/tours/cross.svg"} alt="cancel" width={24} height={24} />
                                <span className="text-sm text-gray-700">Bottled water</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Itinerary & Map */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Itinerary */}
                    <div className="flex flex-col">
                        <h3 className="font-semibold mb-4">Itinerary</h3>
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex gap-3 h-full">
                                <div className="flex flex-col items-center">
                                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" /> <div className="w-0.5 flex-1 border-l-2 border-dotted border-gray-300 my-2"></div>
                                </div>
                                <p className="text-sm text-gray-700">Pickup from hotel</p>
                            </div>
                            <div className="flex gap-3 h-full">
                                <div className="flex flex-col items-center">
                                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" /> <div className="w-0.5 flex-1 border-l-2 border-dotted border-gray-300 my-2"></div>
                                </div>
                                <p className="text-sm text-gray-700">Step into history at the Göreme Open-Air Museum, a UNESCO World Heritage site featuring ancient rock-cut churches and frescoes. Explore the heart of Cappadocia's monastic life carved into volcanic stone.</p>
                            </div>
                            <div className="flex gap-3 h-full">
                                <div className="flex flex-col items-center">
                                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" /> <div className="w-0.5 flex-1 border-l-2 border-dotted border-gray-300 my-2"></div>
                                </div>
                                <p className="text-sm text-gray-700">Pasabag (Monk's Valley)</p>
                            </div>
                            <div className="flex gap-3 h-full">
                                <div className="flex flex-col items-center">
                                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" /> <div className="w-0.5 flex-1 border-l-2 border-dotted border-gray-300 my-2"></div>
                                </div>
                                <p className="text-sm text-gray-700">Lunch at local restaurant</p>
                            </div>
                            <div className="flex gap-3 h-full">
                                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Return to hotel</p>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div>
                        <img
                            src="/admin-images/tours/map.png"
                            alt="Tour location map"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-10" />
            </div>

            
        </div>
    );
};

export default TourDetails;
