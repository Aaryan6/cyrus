"use server";
import { AIMessage } from "@/actions/chat.actions";
import { getUserInfo } from "./user.server";
import { nanoid } from "@/lib/utils";
import db from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

type StoreChats = {
  messages: AIMessage[];
  chat_id: string;
};

export const storeChat = async ({ messages, chat_id }: StoreChats) => {
  const user = await getUserInfo();

  const title = messages[0].content.substring(0, 100);
  const id = chat_id ?? nanoid();
  const createdAt = Date.now();
  const stringDate = new Date(createdAt);
  const path = `/${user?.username}/${id}`;
  const payload = {
    id,
    title,
    user_id: user?.id,
    createdAt,
    path,
    messages,
  };

  await db
    .insert(chats)
    .values({
      id,
      payload: sql`${payload}::jsonb`,
      userId: user?.id,
      updatedAt: stringDate,
      createdAt: stringDate,
    })
    .onConflictDoUpdate({
      target: chats.id,
      set: {
        payload: sql`${payload}::jsonb`,
        updatedAt: stringDate,
      },
    });
};
