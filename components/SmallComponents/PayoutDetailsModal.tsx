// components/FavoriteButton.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import RejectVendorDialog from "../RejectVendorDialog";
import { useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";

interface ReviewButtonProps {
  data: {
    _id: string;
    activity: {
      title: string;
    };
    booking: {
      paymentDetails: {
        totalAmount: number;
        vendorPayable: number;
        commission: number;
      };
    };
  };
  triggerComponent?: React.ReactNode | React.ComponentType<any>;
  onSuccess?: () => void;
  stripeAccountId: string;
}

export const PayoutDetailsModal = ({
  stripeAccountId,
  data,
  triggerComponent,
  onSuccess,
}: ReviewButtonProps) => {
  console.log("userData=======", stripeAccountId);
  const [open, setOpen] = useState(false);
  const TriggerComponent = triggerComponent || (
    <div className="w-fit text-primary underline hover:no-underline text-xs font-normal cursor-pointer">
      View Details
    </div>
  );

  async function sendPayout() {
    try {
      const res = await fetch("/api/payments/sendVendorCommission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripeAccountId,
          amount: 10,
          currency: "eur",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send payout");

      console.log(data);
    } catch (err: any) {
      console.log("Error sending payout: " + err.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        {TriggerComponent &&
          (typeof TriggerComponent === "function" ? (
            <TriggerComponent />
          ) : (
            TriggerComponent
          ))}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center w-full ">Details</DialogTitle>
        <DialogDescription className="mt-2 space-y-4">
          <div className="w-full flex justify-between items-center flex-wrap gap-y-4">
            <div className="flex flex-col gap-1 justify-start items-start w-full">
              <h4 className="text-sm font-semibold text-black">Tour Name</h4>
              <h4 className="text-sm font-medium text-black/70">
                {data.activity.title}
              </h4>
            </div>
            <div className="flex flex-col gap-1 justify-start items-start w-1/2">
              <h4 className="text-sm font-semibold text-black">Total Amount</h4>
              <h4 className="text-sm font-medium text-black/70">
                {data.booking.paymentDetails.totalAmount}
              </h4>
            </div>
            <div className="flex flex-col gap-1 justify-start items-start w-1/2">
              <h4 className="text-sm font-semibold text-black">
                Vendor Net Payable
              </h4>
              <h4 className="text-sm font-medium text-black/70">
                {data.booking.paymentDetails.vendorPayable.toFixed(2)}
              </h4>
            </div>
            <div className="flex flex-col gap-1 justify-start items-start w-1/2">
              <h4 className="text-sm font-semibold text-black">
                Commission (%)
              </h4>
              <h4 className="text-sm font-medium text-black/70">
                {data.booking.paymentDetails.commission}%
              </h4>
            </div>
            <div className="w-full grid grid-cols-2 gap-4">
              <Button
                variant={"main_green_button"}
                className="!bg-[#51C058]"
                onClick={sendPayout}
              >
                Accept
              </Button>
              <RejectVendorDialog
                type={"payment"}
                id={data._id}
                onSuccess={() => {
                  setOpen(false);
                  onSuccess && onSuccess();
                }}
              />
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
