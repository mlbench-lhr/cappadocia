import Pusher from "pusher";

const appId = process.env.PUSHER_APP_ID as string;
const key = process.env.PUSHER_KEY as string;
const secret = process.env.PUSHER_SECRET as string;
const cluster = process.env.PUSHER_CLUSTER as string;

if (!appId || !key || !secret || !cluster) {
  throw new Error("Missing Pusher environment variables");
}

export const pusherServer = new Pusher({
  appId,
  key,
  secret,
  cluster,
  useTLS: true,
});

