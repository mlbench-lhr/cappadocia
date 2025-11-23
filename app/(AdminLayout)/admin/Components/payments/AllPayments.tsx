import PayoutRequestCard, { PayoutRequest } from "./PayoutRequestCard";
import StatCard from "./StatCards";

const PaymentsDashboard: React.FC = () => {
  const payoutRequests: PayoutRequest[] = [
    {
      vendorName: "Istanbul Explorer",
      tourName: "Bosphorus Cruise",
      tourDate: "Oct 1, 2025",
      requestDate: "Oct 1, 2025",
      totalAmount: 600,
      commission: 15,
      vendorNetPayable: 2040,
      status: "pending",
    },
    {
      vendorName: "Athens Adventure",
      tourName: "Acropolis Tour",
      tourDate: "Nov 15, 2025",
      requestDate: "Nov 1, 2025",
      totalAmount: 450,
      commission: 10,
      vendorNetPayable: 1700,
      status: "pending",
    },
    {
      vendorName: "Rome Highlights",
      tourName: "Vatican City Tour",
      tourDate: "Dec 5, 2025",
      requestDate: "Nov 20, 2025",
      totalAmount: 700,
      commission: 12,
      vendorNetPayable: 2580,
      status: "pending",
    },
  ];

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-black mb-6">Payments</h1>

      <div className="flex gap-6 mb-10">
        <StatCard
          title="Total Revenue"
          amount="€485,200"
          percentageChange="18% from last month"
        />
        <StatCard
          title="Platform Commission"
          amount="€48,520"
          percentageChange="18% from last month"
        />
        <StatCard
          title="Vendor Net Earnings"
          amount="€485,200"
          percentageChange="18% from last month"
        />
      </div>

      <h2 className="text-lg font-bold text-black mb-4">Payout Requests</h2>

      {payoutRequests.map((request, index) => (
        <PayoutRequestCard key={index} request={request} />
      ))}
    </div>
  );
};

export default PaymentsDashboard;
