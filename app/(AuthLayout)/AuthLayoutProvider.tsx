import { SwitchRoles } from "@/components/SmallComponents/SwitchRoles";

export function AuthLayoutProvider({
  children,
  showImage1 = true,
  isVendor = false,
}: {
  children: React.ReactNode;
  showImage1?: boolean;
  isVendor?: boolean;
}) {
  return (
    <div className="h-full w-full flex justify-between">
      <div
        className={`${
          isVendor
            ? "auth-bg-image-3"
            : showImage1
            ? "auth-bg-image-1"
            : "auth-bg-image-2"
        } hidden lg:flex w-[50%] min-h-screen max-h-full`}
      ></div>
      <div
        className={`bgWhiteImp w-full lg:w-1/2 ${
          isVendor
            ? "auth-bg-image-3m"
            : showImage1
            ? "auth-bg-image-1m"
            : "auth-bg-image-2m"
        } `}
      >
        {showImage1 && <SwitchRoles />}
        <div
          className={`flex justify-center items-start lg:items-center w-full h-[100vh] min-h-fit max-h-full `}
        >
          <div className="flex-1 flex items-start lg:items-center justify-center py-6 lg:py-2 px-4 sm:px-6 lg:px-8 min-h-fit max-h-full">
            <div className="w-full max-w-md space-y-8 min-h-fit max-h-full">
              <main className="">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
