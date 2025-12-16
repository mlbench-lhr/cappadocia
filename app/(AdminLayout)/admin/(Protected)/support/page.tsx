"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useMemo, useRef, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { pusherClient } from "@/lib/pusher/client";
import Image from "next/image";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";
import { Input } from "@/components/ui/input";
import { SendIcon } from "@/public/allIcons/page";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type Ticket = {
  _id: string;
  user:
    | { _id: string; fullName?: string; email?: string; avatar?: string }
    | string;
  bookingId?: string;
  subject: string;
  description: string;
  status: "open" | "resolved";
  latestMessageAt?: string;
  conversation?: string;
  lastMessage?: { text?: string; sender?: string; createdAt?: string };
  createdAt: string;
};

type Message = {
  _id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: string;
};

export default function AdminSupportPage() {
  const router = useRouter();
  const ticketParam = useSearchParams().get("ticket");
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const msgChannelName = useRef<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [loadingTickets, setLoadingTickets] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  useEffect(() => {
    async function loadTickets() {
      setLoadingTickets(true);
      const res = await axios.get("/api/support/tickets");
      setTickets(res.data?.tickets || []);
      if (!selectedTicketId && res.data?.tickets?.length > 0) {
        setSelectedTicketId(res.data.tickets[0]._id);
      }
      setLoadingTickets(false);
    }
    loadTickets();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedTicketId) return;
      const ticket = tickets.find((t) => t._id === selectedTicketId);
      if (!ticket?.conversation) return;
      setLoadingMessages(true);
      const res = await axios.get(
        `/api/messages/conversations/${ticket.conversation}/messages`
      );
      setMessages(res.data?.messages || []);
      setLoadingMessages(false);
      // subscribe to realtime
      msgChannelName.current &&
        pusherClient.unsubscribe(msgChannelName.current);
      msgChannelName.current = `conversation-${ticket.conversation}`;
      const channel = pusherClient.subscribe(msgChannelName.current);
      const handler = (data: any) => {
        setMessages((prev) => [...prev, data]);
        setTickets((prev) => {
          const idx = prev.findIndex((t) => t._id === selectedTicketId);
          if (idx === -1) return prev;
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            latestMessageAt: data.createdAt,
          } as Ticket;
          return [
            updated[idx],
            ...updated.filter((t) => t._id !== selectedTicketId),
          ];
        });
      };
      channel.bind("message-new", handler);
      return () => {
        channel.unbind("message-new", handler);
      };
    }
    loadMessages();
  }, [selectedTicketId, tickets]);

  const sendMessage = async () => {
    if (!selectedTicketId || !inputText.trim()) return;
    const ticket = tickets.find((t) => t._id === selectedTicketId);
    if (!ticket?.conversation) return;
    await axios.post(
      `/api/messages/conversations/${ticket.conversation}/messages`,
      { text: inputText.trim() }
    );
    setInputText("");
  };

  const markResolved = async (id: string) => {
    await axios.put(`/api/support/tickets/${id}/resolve`);
    setTickets((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: "resolved" } : t))
    );
  };

  const selectedTicket = useMemo(
    () => tickets.find((t) => t._id === selectedTicketId),
    [tickets, selectedTicketId]
  );

  return (
    <BasicStructureWithName
      name="Support Requests"
      showBackOption={isMobile && !!ticketParam}
    >
      <div className="flex flex-col justify-start items-start w-full gap-0 md:gap-3 h-fit">
        <div className="w-full h-[calc(100vh-150px)] md:h-[calc(100vh-200px)] grid grid-cols-12">
          <div
            className={`${
              ticketParam ? "hidden" : "block"
            } [@media(min-width:950px)]:block h-full col-span-12 [@media(min-width:950px)]:col-span-4 overflow-auto`}
          >
            <div className="w-full h-[150px] flex flex-col justify-start items-start">
              <div className="w-full border-b px-2 lg:px-4 xl:px-6 py-4 text-sm font-semibold">
                All Messages
              </div>
              <div className="w-full border-b px-2 lg:px-4 xl:px-6 py-4">
                <SearchComponent
                  width="w-full"
                  searchQuery={search}
                  onChangeFunc={setSearch}
                />
              </div>
            </div>
            <div className="h-[calc(100%-150px)]  w-full overflow-auto">
              <div className="h-fit w-full">
                {loadingTickets
                  ? Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-full text-left flex justify-between items-start gap-[15px] px-2 lg:px-4 xl:px-6 py-4 border-b"
                      >
                        <Skeleton className="w-[35px] h-[35px] rounded-[8px]" />
                        <div className="w-[calc(100%-50px)] flex flex-col justify-between items-start">
                          <div className="w-full flex justify-between items-center">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-12" />
                          </div>
                          <Skeleton className="h-3 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <div className="w-full flex justify-between items-center">
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-6 w-24 rounded-md" />
                          </div>
                        </div>
                      </div>
                    ))
                  : tickets
                      .filter((t) => {
                        const name =
                          typeof t.user !== "string"
                            ? t.user?.fullName || ""
                            : "";
                        const subj = t.subject || "";
                        const q = search.trim().toLowerCase();
                        if (!q) return true;
                        return (
                          name.toLowerCase().includes(q) ||
                          subj.toLowerCase().includes(q)
                        );
                      })
                      .map((t) => (
                        <div
                          key={t._id}
                          onClick={() => {
                            setSelectedTicketId(t._id);
                            router.push(`/admin/support?ticket=${t._id}`);
                          }}
                          className={`w-full text-left flex justify-between items-start gap-[15px] px-2 lg:px-4 xl:px-6 py-4 border-b ${
                            selectedTicketId === t._id
                              ? "bg-[#F1F4FF]"
                              : "bg-white"
                          }`}
                        >
                          <Image
                            alt=""
                            src={
                              typeof t.user !== "string" && t.user?.avatar
                                ? (t.user?.avatar as string)
                                : "/placeholderDp.png"
                            }
                            width={35}
                            height={35}
                            className="rounded-[8px]"
                          />
                          <div className="w-[calc(100%-50px)] flex flex-col justify-between items-start">
                            <div className="w-full flex justify-between items-center">
                              <h1 className="text-base font-semibold">
                                {typeof t.user !== "string"
                                  ? t.user?.fullName || "User"
                                  : "User"}
                              </h1>
                              <span className="text-sm font-normal text-black/70">
                                {t.latestMessageAt
                                  ? new Date(
                                      t.latestMessageAt
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </span>
                            </div>
                            <span className="text-[12px] font-medium text-black/80">
                              Subject: {t.subject}
                            </span>
                            <span className="text-[12px] font-normal text-black/70">
                              {t.lastMessage?.text || ""}
                            </span>
                            <div className="w-full flex justify-between items-center">
                              <span className="text-[12px] font-normal text-black/70">
                                {t.bookingId
                                  ? `Booking: ${t.bookingId}`
                                  : "No Booking ID"}
                              </span>
                              {t.status === "resolved" ? (
                                <span className="text-[12px] font-semibold text-green-600">
                                  Resolved
                                </span>
                              ) : (
                                <Button
                                  variant="green_secondary_button"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markResolved(t._id);
                                  }}
                                >
                                  Mark as resolved
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
              </div>
            </div>
          </div>
          <div
            className={`${
              ticketParam ? "block" : "hidden"
            } [@media(min-width:950px)]:block h-full col-span-12 [@media(min-width:950px)]:col-span-8 overflow-auto `}
          >
            <div className="w-full h-[100px] flex flex-col justify-start items-start ">
              <div className="w-full border-b px-2 lg:px-4 xl:px-6 py-4 text-sm font-semibold flex justify-start items-center gap-2">
                {loadingMessages || !selectedTicket ? (
                  <>
                    <Skeleton className="w-[35px] h-[35px] rounded-[8px]" />
                    <Skeleton className="h-4 w-40" />
                  </>
                ) : (
                  <>
                    <Image
                      alt=""
                      src={
                        selectedTicket &&
                        typeof selectedTicket.user !== "string" &&
                        selectedTicket.user?.avatar
                          ? (selectedTicket.user?.avatar as string)
                          : "/placeholderDp.png"
                      }
                      width={35}
                      height={35}
                      className="rounded-[8px]"
                    />
                    <span className="text-sm font-semibold">
                      {selectedTicket && typeof selectedTicket.user !== "string"
                        ? selectedTicket.user?.fullName || "Messages"
                        : "Messages"}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="h-[calc(100%-180px)] w-full overflow-auto scrollbar-hide">
              <div className="min-h-full max-h-fit w-full flex justify-end items-start flex-col gap-3 md:gap-6 px-0 md:px-10">
                {loadingMessages ? (
                  <>
                    <div className="w-full flex justify-between flex-col gap-1">
                      <div className="px-2 md:px-10">
                        <Skeleton className="w-48 h-4" />
                      </div>
                    </div>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="w-full flex flex-col gap-1">
                        <div
                          className={`${
                            i % 2 === 0 ? "self-start" : "self-end"
                          }`}
                        >
                          <Skeleton
                            className={`${
                              i % 2 === 0 ? "w-2/3" : "w-1/2"
                            } h-10 rounded-2xl`}
                          />
                        </div>
                        <div
                          className={`${
                            i % 2 === 0 ? "self-start" : "self-end"
                          }`}
                        >
                          <Skeleton className="w-12 h-3" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {selectedTicket ? (
                      <div className="w-full flex justify-between flex-col gap-1">
                        <div className="text-[12px] text-black/70 px-2 md:px-10">
                          Subject: {selectedTicket.subject}
                        </div>
                      </div>
                    ) : null}
                    {messages.map((item: any, index: number) => (
                      <div
                        key={index}
                        className={`w-full flex justify-between flex-col gap-1`}
                      >
                        <div
                          className={`w-fit h-fit text-[12px] font-normal px-2 md:px-6 py-4 leading-normal rounded-t-2xl md:rounded-t-[32px] ${
                            item.sender === currentUserId
                              ? "bg-primary text-white self-end rounded-bl-2xl md:rounded-bl-[32px]"
                              : "bg-secondary rounded-br-2xl md:rounded-br-[32px]"
                          }`}
                        >
                          {item.text}
                        </div>
                        <span
                          className={`text-[12px] font-normal text-black/70 ${
                            item.sender === currentUserId && "self-end"
                          }`}
                        >
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className="w-full h-[75px] pt-3 flex flex-col justify-start items-start px-0 md:px-10">
              <div className="w-full h-full text-sm font-semibold flex justify-start items-center gap-2">
                <div className="w-[calc(100%-68px)] h-[60px] flex justify-center items-center rounded-[10px]">
                  {loadingMessages ? (
                    <Skeleton className="w-full h-full rounded-[10px]" />
                  ) : (
                    <Input
                      placeholder="Say Something...."
                      className="h-full"
                      value={inputText}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          sendMessage();
                        }
                      }}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                  )}
                </div>
                <div className="w-[60px] h-[60px] flex justify-center items-center border-2 rounded-[10px]">
                  {loadingMessages ? (
                    <Skeleton className="w-6 h-6 rounded-md" />
                  ) : (
                    <button onClick={sendMessage}>
                      <SendIcon />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasicStructureWithName>
  );
}
