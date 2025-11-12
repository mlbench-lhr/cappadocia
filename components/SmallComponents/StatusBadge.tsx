const variants: any = {
  Paid: { bg: "#E7FAE3", text: "#4A9E35" },
  Pending: { bg: "#F8E6D4", text: "#FF862F" },
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
