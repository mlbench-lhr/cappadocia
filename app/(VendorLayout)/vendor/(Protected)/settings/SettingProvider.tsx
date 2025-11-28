export const SettingProvider = ({
  label,
  children,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <div className="w-full col-span-3 lg:col-span-2 p-0 lg:ps-6 flex justify-between items-start flex-col gap-3 h-fit">
      <div className="w-fit">
        <h1 className="text-base md:text-2xl font-semibold text-gray-900">
          {label}
        </h1>
      </div>
      <div className="w-full h-full rounded-[15px] py-[16px] grid grid-cols-3">
        <div className="w-full h-full pb-[16px] grid col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
};
