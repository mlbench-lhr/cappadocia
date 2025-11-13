const variants: any = {
  Paid: { bg: "#E7FAE3", text: "#4A9E35" },
  Pending: { bg: "#F8E6D4", text: "#FF862F" },
  Cancelled: { bg: "#FAE3E3", text: "#DE191D" },
  Refunded: { bg: "#E3F7FA", text: "#2B8B94" },
};
export const StatusBadge = ({ status }: { status: string }) => {
  return (
    <div
      className={`px-2.5 py-1 leading-tight flex justify-center items-center text-xs font-medium rounded-xl`}
      style={{
        color: variants[status]?.text,
        backgroundColor: variants[status]?.bg,
      }}
    >
      {status}
    </div>
  );
};
