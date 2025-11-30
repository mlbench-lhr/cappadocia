const variants: any = {
  upcoming: { text: "#008EFF" },
  completed: { text: "#4A9E35" },
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
