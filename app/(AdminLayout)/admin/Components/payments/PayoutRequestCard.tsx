import React from 'react';

export interface PayoutRequest {
  vendorName: string;
  tourName: string;
  tourDate: string;
  requestDate: string;
  totalAmount: number;
  commission: number;
  vendorNetPayable: number;
  status: string;
}

const PayoutRequestCard: React.FC<{ request: PayoutRequest }> = ({ request }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 py-4">
      <div className="grid grid-cols-4 gap-4 mb-5 border-b py-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Vendor Name
          </div>
          <div className="text-sm font-semibold text-black">
            {request.vendorName}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Tour Name
          </div>
          <div className="text-sm text-black">
            {request.tourName}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Tour Date
          </div>
          <div className="text-sm text-black">
            {request.tourDate}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Request Date
          </div>
          <div className="text-sm text-black">
            {request.requestDate}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-5 border-b py-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Total Amount
          </div>
          <div className="text-sm font-semibold text-black">
            €{request.totalAmount}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Commission (%)
          </div>
          <div className="text-sm font-semibold text-black">
            {request.commission}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Vendor Net Payable
          </div>
          <div className="text-sm font-semibold text-black">
            ₺{request.vendorNetPayable.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Request Date
          </div>
          <div className="text-sm text-black">
            {request.requestDate}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Status
          </div>
          <div className="text-sm font-semibold text-[#FF862F]">
            {request.status}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 bg-green-500 text-white border-none rounded-lg py-3 text-base font-semibold cursor-pointer">
          Accept
        </button>
        <button className="flex-1 bg-red-500 text-white border-none rounded-lg py-3 text-base font-semibold cursor-pointer">
          Reject
        </button>
      </div>
    </div>
  );
};

export default PayoutRequestCard;