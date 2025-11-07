import Image from "next/image";

export function AuthProvider({
  children,
  showImage1 = true,
}: {
  children: React.ReactNode;
  showImage1?: boolean;
}) {
  return (
    <div className="h-full w-full flex justify-between">
      <div className="w-1/2 h-[100vh]">
        <Image
          src={showImage1 ? "/loginPageImage.png" : "/authPageImage2.png"}
          alt=""
          width={100}
          height={100}
          className="w-full h-full object-cover object-start"
        />
      </div>
      <div className="w-1/2 h-full">
        <div className="flex justify-center items-start lg:items-center w-full h-[100vh] bg-[#FBFDF9] min-h-fit max-h-full">
          <div className="flex-1 flex items-start lg:items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-fit max-h-full">
            <div className="w-full max-w-md space-y-8 min-h-fit max-h-full">
              <main className="">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
