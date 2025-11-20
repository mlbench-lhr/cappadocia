import logOutIcon from "@/public/log-out.svg";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { signOut } from "@/lib/auth/auth-helpers";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";

export default function LogoutDialog({
  adminStyle = false,
}: {
  adminStyle?: boolean;
}) {
  const userRole = useAppSelector((s) => s.auth.user?.role);
  const router = useRouter();
  const handleConfirm = async () => {
    await signOut();
    router.refresh();
    if (userRole === "user") {
      router.push("/auth/login");
      window.location.href = "/auth/login";
    } else if (userRole === "vendor") {
      router.push("/vendor/auth/login");
      window.location.href = "/vendor/auth/login";
    } else {
      router.push("/admin/auth/login");
      window.location.href = "/admin/auth/login";
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {adminStyle ? (
            <div className="flex gap-1 items-center justify-start">
              <LogOut size={15} strokeWidth={2} />
              <button className="block px-2 py-2 text-sm">Logout</button>
            </div>
          ) : (
            <div className="flex gap-1">
              <Image src={logOutIcon.src} alt="" width={16} height={16} />
              <button className="block px-4 py-2 text-sm">Logout</button>
            </div>
          )}
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg rounded-[16px] flex flex-col justify-start items-center gap-[8px] p-[40px]">
          <DialogHeader>
            <DialogTitle className="text-center w-full heading-text-style-4">
              Logout
            </DialogTitle>
            <DialogDescription className="mt-2 plan-text-style-3">
              Are you sure you want to logout this account?
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex items-center justify-end w-full">
            <DialogFooter className="w-full">
              <div className="w-full grid grid-cols-2 gap-[20px]">
                <DialogClose asChild>
                  <Button
                    variant="secondary_button"
                    className="col-span-1 mr-2"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={handleConfirm}
                    variant={"main_green_button"}
                    className="col-span-1"
                  >
                    Logout
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
