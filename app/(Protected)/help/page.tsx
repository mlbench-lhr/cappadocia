"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useMemo, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { useForm } from "react-hook-form";
import {
  FormTextInput,
  FormTextAreaInput,
} from "@/components/SmallComponents/InputComponents";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";

type FormData = {
  bookingId?: string;
  subject: string;
  description: string;
};

export default function HelpPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const userData = useAppSelector((s) => s.auth.user);
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { bookingId: "", subject: "", description: "" },
  });
  const [openTicket, setOpenTicket] = useState<any | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  useEffect(() => {
    async function checkExisting() {
      try {
        const res = await axios.get("/api/support/tickets?status=open");
        const t = res.data?.tickets?.[0] || null;
        setOpenTicket(t);
        if (t?.conversation) {
          const convs = await axios.get("/api/messages/conversations");
          const convo = (convs.data?.conversations || []).find(
            (c: any) => c._id === t.conversation
          );
          const admin = (convo?.participants || []).find(
            (p: any) => p.role === "admin"
          );
          setAdminId(admin?._id || null);
        }
      } catch {}
    }
    checkExisting();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post("/api/support/tickets", data);
      if (res.data?.ticket) {
        setOpenTicket(res.data.ticket);
        const convo = res.data?.conversation;
        const admin = (convo?.participants || []).find(
          (p: any) => p.role === "admin"
        );
        setAdminId(admin?._id || null);
        Swal.fire({ title: "Support request created", icon: "success" });
        reset();
      }
    } catch (e: any) {
      const t = e?.response?.data?.ticket;
      if (t) {
        setOpenTicket(t);
        try {
          const convs = await axios.get("/api/messages/conversations");
          const convo = (convs.data?.conversations || []).find(
            (c: any) => c._id === t.conversation
          );
          const admin = (convo?.participants || []).find(
            (p: any) => p.role === "admin"
          );
          setAdminId(admin?._id || null);
        } catch {}
        Swal.fire({ title: "An open ticket already exists", icon: "info" });
      } else {
        Swal.fire({
          title: "Error",
          text: e?.response?.data?.error || "Failed to submit",
          icon: "error",
        });
      }
    }
  };

  return (
    <BasicStructureWithName name="Help & Support" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        <BoxProviderWithName noBorder={true} className="">
          {openTicket ? (
            <div className="grid grid-cols-12 gap-3 w-full">
              <div className="col-span-12 md:col-span-8">
                <div className="p-4 rounded-md border bg-secondary">
                  <div className="font-semibold text-sm mb-1">
                    Support request submitted
                  </div>
                  <div className="text-sm">Subject: {openTicket.subject}</div>
                  <div className="text-xs text-black/60">
                    Ticket ID: {openTicket._id}
                  </div>
                  {adminId ? (
                    <div className="mt-3">
                      <Link
                        href={`/messages?sender=${adminId}`}
                        className="text-primary text-sm"
                      >
                        Open chat with Cappadocia
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <div className="text-xs text-black/60">
                  You can submit a new request once the current ticket is marked
                  resolved.
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-12 gap-3 w-full"
            >
              <div className="col-span-12 md:col-span-6">
                <FormTextInput<FormData>
                  label="Booking ID"
                  placeholder="Enter your booking id (optional)"
                  control={control}
                  name={"bookingId"}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormTextInput<FormData>
                  label="Subject"
                  placeholder="Brief subject"
                  required={true}
                  control={control}
                  name={"subject"}
                />
              </div>
              <div className="col-span-12">
                <FormTextAreaInput<FormData>
                  label="Description"
                  placeholder="Describe your issue"
                  required={true}
                  control={control}
                  name={"description"}
                />
              </div>
              <div className="col-span-12 md:col-span-3">
                <Button
                  variant={"main_green_button"}
                  className="w-full"
                  type="submit"
                >
                  Create Ticket
                </Button>
              </div>
            </form>
          )}
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
