"use client";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";
import { Input } from "@/components/ui/input";
import { SendIcon } from "@/public/allIcons/page";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { useAppSelector } from "@/lib/store/hooks";
import { pusherClient } from "@/lib/pusher/client";

const Messages = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const sender = useSearchParams().get("sender");
  const isMobile = useMediaQuery({ maxWidth: 950 });
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const convChannelName = useRef<string | null>(null);
  const msgChannelName = useRef<string | null>(null);
  const selectedConversation = useMemo(
    () => conversations.find((c) => c._id === selectedConversationId),
    [conversations, selectedConversationId]
  );
  const selectedOther = useMemo(() => {
    const p = selectedConversation?.participants || [];
    return p.find((u: any) => u._id !== currentUserId);
  }, [selectedConversation, currentUserId]);

  useEffect(() => {
    const run = async () => {
      if (!currentUserId) return;
      const res = await axios.get("/api/messages/conversations");
      const items = res.data?.conversations || [];
      setConversations(items);
      if (sender) {
        try {
          const r = await axios.post("/api/messages/conversations", {
            otherUserId: sender,
          });
          const convo = r.data?.conversation;
          setSelectedConversationId(convo?._id || null);
          setConversations((prev) => {
            if (!convo?._id) return prev;
            const exists = prev.some((c) => c._id === convo._id);
            return exists ? prev : [convo, ...prev];
          });
        } catch {}
      } else if (items[0]?._id) {
        setSelectedConversationId(items[0]._id);
      }
    };
    run();
  }, [currentUserId, sender]);

  useEffect(() => {
    if (!currentUserId) return;
    if (convChannelName.current) {
      try {
        pusherClient.unsubscribe(convChannelName.current);
      } catch {}
    }
    convChannelName.current = `user-${currentUserId}`;
    const convChannel = pusherClient.subscribe(convChannelName.current);
    convChannel.bind("conversation-updated", (data: any) => {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c._id === data.conversationId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            latestMessageAt: data.latestMessageAt,
            lastMessage: data.lastMessage || next[idx].lastMessage,
          };
          next.sort(
            (a, b) =>
              new Date(b.latestMessageAt).getTime() -
              new Date(a.latestMessageAt).getTime()
          );
          return next;
        }
        return prev;
      });
    });
    return () => {
      if (convChannelName.current) {
        try {
          pusherClient.unsubscribe(convChannelName.current);
        } catch {}
      }
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!selectedConversationId) return;
    const load = async () => {
      const res = await axios.get(
        `/api/messages/conversations/${selectedConversationId}/messages`
      );
      setMessages(res.data?.messages || []);
    };
    load();
    if (msgChannelName.current) {
      try {
        pusherClient.unsubscribe(msgChannelName.current);
      } catch {}
    }
    msgChannelName.current = `conversation-${selectedConversationId}`;
    const msgChannel = pusherClient.subscribe(msgChannelName.current);
    msgChannel.bind("message-new", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c._id === msg.conversation);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            latestMessageAt: msg.createdAt,
            lastMessage: {
              text: msg.text,
              sender: msg.sender,
              createdAt: msg.createdAt,
            },
          };
          next.sort(
            (a, b) =>
              new Date(b.latestMessageAt).getTime() -
              new Date(a.latestMessageAt).getTime()
          );
          return next;
        }
        return prev;
      });
    });
    return () => {
      if (msgChannelName.current) {
        try {
          pusherClient.unsubscribe(msgChannelName.current);
        } catch {}
      }
    };
  }, [selectedConversationId]);

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      const p = c.participants || [];
      const other = p.find((u: any) => u._id !== currentUserId);
      const name = other?.fullName || "";
      return name.toLowerCase().includes(q);
    });
  }, [search, conversations, currentUserId]);

  const send = async () => {
    if (!selectedConversationId) return;
    const text = inputText.trim();
    if (!text) return;
    await axios.post(
      `/api/messages/conversations/${selectedConversationId}/messages`,
      { text }
    );
    setInputText("");
  };

  const messagesArray = [
    {
      sentBy: "user",
      message:
        "Hello, I’m interested in the Cappadocia Red Tour. Can you confirm if pickup from my hotel in Ürgüp is included?",
      date: "04:45 PM",
    },
    {
      sentBy: "vendor",
      message:
        "Hi Ali 👋 Yes, pickup from Ürgüp is available. There’s a €10 fee for that location.",
      date: "04:45 PM",
    },
    {
      sentBy: "user",
      message: "Okay, noted. What’s the group size limit for this tour?",
      date: "04:45 PM",
    },
  ];

  return (
    <BasicStructureWithName
      name="Messages"
      showBackOption={isMobile && sender ? true : false}
    >
      <div className="w-full h-[calc(100vh-150px)] md:h-[calc(100vh-200px)] grid grid-cols-12">
        <div
          className={`${
            sender ? "hidden" : "block"
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
              {filteredConversations.map((c: any) => {
                const other = (c.participants || []).find(
                  (u: any) => u._id !== currentUserId
                );
                return (
                  <button
                    key={c._id}
                    onClick={() => {
                      setSelectedConversationId(c._id);
                      router.push(`messages?sender=${c._id}`);
                    }}
                    className={`w-full text-left flex justify-between items-start gap-[15px] px-2 lg:px-4 xl:px-6 py-4 border-b ${
                      selectedConversationId === c._id
                        ? "bg-[#F1F4FF]"
                        : "bg-white"
                    }`}
                  >
                    <Image
                      alt=""
                      src={other?.avatar || "/placeholderDp.png"}
                      width={35}
                      height={35}
                      className="rounded-[8px]"
                    />
                    <div className="w-[calc(100%-50px)] flex flex-col justify-between items-start">
                      <div className="w-full flex justify-between items-center">
                        <h1 className="text-base font-semibold">
                          {other?.fullName || "User"}
                        </h1>
                        <span className="text-sm font-normal text-black/70">
                          {new Date(c.latestMessageAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <span className="text-[12px] font-normal text-black/70">
                        {c.lastMessage?.text || ""}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className={`${
            sender ? "block" : "hidden"
          } [@media(min-width:950px)]:block h-full col-span-12 [@media(min-width:950px)]:col-span-8 overflow-auto `}
        >
          <div className="w-full h-[100px] flex flex-col justify-start items-start ">
            <div className="w-full border-b px-2 lg:px-4 xl:px-6 py-4 text-sm font-semibold flex justify-start items-center gap-2">
              <Image
                alt=""
                src={selectedOther?.avatar || "/placeholderDp.png"}
                width={35}
                height={35}
                className="rounded-[8px]"
              />
              <span className="text-sm font-semibold">
                {selectedOther?.fullName || "Messages"}
              </span>
            </div>
          </div>
          <div className="h-[calc(100%-180px)] w-full overflow-auto">
            <div className="min-h-full max-h-fit w-full flex justify-end items-start flex-col gap-3 md:gap-6 px-0 md:px-10">
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
            </div>
          </div>
          <div className="w-full h-[75px] pt-3 flex flex-col justify-start items-start px-0 md:px-10">
            <div className="w-full h-full text-sm font-semibold flex justify-start items-center gap-2">
              <div className="w-[calc(100%-68px)] h-[60px] flex justify-center items-center rounded-[10px]">
                <Input
                  placeholder="Say Something...."
                  className="h-full"
                  value={inputText}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      send();
                    }
                  }}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              <div className="w-[60px] h-[60px] flex justify-center items-center border-2 rounded-[10px]">
                <button onClick={send}>
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasicStructureWithName>
  );
};

export default Messages;
