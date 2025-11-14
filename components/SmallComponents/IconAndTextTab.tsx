export const IconAndTextTab = ({ text, icon }: { text: string; icon: any }) => {
  return (
    <div className="w-full col-span-1 flex justify-start items-start gap-1 leading-tight">
      {icon}
      <span className="w-[calc(100%-20px)]">{text}</span>
    </div>
  );
};

export const IconAndTextTab2 = ({
  text,
  icon,
  textClasses = "text-[12px] font-medium text-primary leading-[10px]",
}: {
  text: string;
  icon: any;
  textClasses?: string;
}) => {
  return (
    <div
      className={`w-fit flex justify-start items-center gap-1 ${textClasses}`}
    >
      {icon}
      <span className="w-[calc(100%-20px)]">{text}</span>
    </div>
  );
};
