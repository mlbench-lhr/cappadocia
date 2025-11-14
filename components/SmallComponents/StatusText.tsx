const variants: any = {
  Upcoming: { text: "#008EFF" },
  Completed: { text: "#4A9E35" },
  Cancelled: { text: "rgba(255, 0, 0, 0.60)" },
};
export const StatusText = ({ status }: { status: string }) => {
  return (
    <div
      className={`leading-tight text-base font-normal`}
      style={{
        color: variants[status]?.text,
      }}
    >
      {status}
    </div>
  );
};
