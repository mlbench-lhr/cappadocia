const variants: any = {
  paid: { bg: "#E7FAE3", text: "#4A9E35" },
  active: { bg: "#E7FAE3", text: "#4A9E35" },
  pending: { bg: "#F8E6D4", text: "#FF862F" },
  "pending Admin Approval": { bg: "#F8E6D4", text: "#FF862F" },
  cancelled: { bg: "#FAE3E3", text: "#DE191D" },
  refunded: { bg: "#E3F7FA", text: "#2B8B94" },
};
export const StatusBadge = ({
  status,
  textClasses = "text-xs font-medium",
  widthClasses = "w-fit",
}: {
  status: string;
  textClasses?: string;
  widthClasses?: string;
}) => {
  return (
    <div
      className={`px-2.5 py-1 leading-tight flex justify-center items-center ${textClasses} ${widthClasses} rounded-xl`}
      style={{
        color: variants[status]?.text,
        backgroundColor: variants[status]?.bg,
      }}
    >
      {status}
    </div>
  );
};
