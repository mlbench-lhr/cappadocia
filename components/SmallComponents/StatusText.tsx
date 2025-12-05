const variants: any = {
  upcoming: { text: "#008EFF" },
  completed: { text: "#4A9E35" },
  Eligible: { text: "#4A9E35" },
  "Not Eligible (Activity Tomorrow)": { text: "#F5A903" },
  "Not Eligible (Completed less than 1 day ago)": { text: "#F5A903" },
  "Not Eligible (Activity not completed yet)": { text: "#F5A903" },
  pending: { text: "#FF862F" },
  cancelled: { text: "rgba(255, 0, 0, 0.60)" },
};
export const StatusText = ({ status }: { status: string }) => {
  return (
    <div
      className={`leading-tight text-base font-normal capitalize`}
      style={{
        color: variants[status]?.text,
      }}
    >
      {status}
    </div>
  );
};
