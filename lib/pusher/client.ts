import Pusher from "pusher-js";

const key = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;

export const pusherClient = new Pusher(key, { cluster });

