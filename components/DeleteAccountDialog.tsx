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
import { Button } from "./ui/button";
import { signOut } from "@/lib/auth/auth-helpers";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import axios from "axios";
import { useAppSelector } from "@/lib/store/hooks";
import { useState } from "react";

export default function DeleteAccountDialog() {
  const router = useRouter();
  const userData = useAppSelector((s) => s.auth.user);
  const [deleting, setDeleting] = useState(false);
  const handleConfirm = async () => {
    if (!userData?.id) {
      return;
    }
    try {
      setDeleting(true);
      await axios.delete(`/api/admin/users/deleteUser/${userData?.id}`);
    } catch (error) {
      console.log("error------", error);
    } finally {
      setDeleting(false);
    }
    await signOut();
    router.refresh();
    router.push("/");
    window.location.href = "/";
  };
  
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex gap-3 items-center text-red-500">
            <Trash size={15} strokeWidth={2} />
            <button className="block px-2 py-2 text-sm">Delete Account</button>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg rounded-[16px] flex flex-col justify-start items-center gap-[8px] p-[40px]">
          <DialogHeader>
            <DialogTitle className="text-center w-full heading-text-style-4">
              Delete Account
            </DialogTitle>
            <DialogDescription className="mt-2 plan-text-style-3">
              Are you sure you want to delete this account?
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
                    Delete
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
