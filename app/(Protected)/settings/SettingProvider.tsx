export const SettingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="col-span-3 md:col-span-2 ps-0 md:ps-6 flex justify-between items-start flex-col gap-[24px] h-fit">
      <div className="w-fit mb-0 spacey-[15px]">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Change Password
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
