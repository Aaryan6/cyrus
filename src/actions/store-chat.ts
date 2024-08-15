"use server";
import { AIMessage } from "@/actions/chat/chat.actions";
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

  const firstMessage = messages[0].content as string;
  const title = firstMessage.substring(0, 100);
  const id = chat_id ?? nanoid();
  const createdAt = Date.now();
  const stringDate = new Date(createdAt);
  const path = `/${session.user?.username}/${id}`;

  await db.chats.upsert({
    where: { id },
    create: {
      id,
      title,
      messages: messages as any,
      path,
      userId: session.user.id!,
      updatedAt: stringDate,
      createdAt: stringDate,
    },
    update: {
      messages: messages as any,
      updatedAt: stringDate,
    },
  });
};
