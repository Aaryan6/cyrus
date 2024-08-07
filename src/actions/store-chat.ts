"use server";
import { AIMessage } from "@/actions/chat.actions";
import { nanoid } from "@/lib/utils";
import { db } from "@/lib/db";
import { auth } from "@/auth";

type StoreChats = {
  messages: AIMessage[];
  chat_id: string;
};

export const storeChat = async ({ messages, chat_id }: StoreChats) => {
  const session = await auth();
  if (session === null || !session.user) return;

  const title = messages[0].content.substring(0, 100);
  const id = chat_id ?? nanoid();
  const createdAt = Date.now();
  const stringDate = new Date(createdAt);
  const path = `/${session.user?.username}/${id}`;
  const payload = {
    id,
    title,
    user_id: session.user?.id,
    createdAt,
    path,
    messages,
  };

  const res = await db.chats.upsert({
    where: { id },
    create: {
      id,
      payload,
      userId: session.user.id!,
      updatedAt: stringDate,
      createdAt: stringDate,
    },
    update: {
      payload,
      updatedAt: stringDate,
    },
  });
  console.log(res);
};
