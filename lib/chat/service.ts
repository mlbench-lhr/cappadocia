import { db } from "@/lib/firebase/client";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  serverTimestamp,
  setDoc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";

export type Conversation = {
  id: string;
  participants: string[];
  updatedAt?: Timestamp;
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt?: Timestamp;
  };
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt?: Timestamp;
};

export const getChatId = (a: string, b: string) => [a, b].sort().join("_");

export async function ensureChat(currentUserId: string, otherUserId: string) {
  const chatId = getChatId(currentUserId, otherUserId);
  const chatRef = doc(db, "chats", chatId);
  const snap = await getDoc(chatRef);
  if (!snap.exists()) {
    await setDoc(chatRef, {
      participants: [currentUserId, otherUserId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
    });
  }
  return chatId;
}

export function subscribeConversations(
  currentUserId: string,
  handler: (items: Conversation[]) => void
) {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", currentUserId),
    orderBy("updatedAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const items: Conversation[] = [];
    snap.forEach((d) => {
      const data = d.data() as any;
      items.push({ id: d.id, ...data });
    });
    handler(items);
  });
}

export function subscribeMessages(
  chatId: string,
  handler: (items: Message[]) => void
) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    const items: Message[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    handler(items);
  });
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string
) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const messagesRef = collection(db, "chats", chatId, "messages");
  const createdAt = serverTimestamp();
  await addDoc(messagesRef, { senderId, text: trimmed, createdAt });
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    updatedAt: serverTimestamp(),
    lastMessage: { text: trimmed, senderId, createdAt },
  });
}
