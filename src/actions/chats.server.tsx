"use server";
import db from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserInfo } from "./user.server";
import { Chats } from "@/lib/types";

export async function getChats(chatId: string) {
  const data = await db.select().from(chats).where(eq(chats.id, chatId));
  return data[0] as Chats;
}

export async function getChatHistory() {
  const user = await getUserInfo();
  const data = await db.select().from(chats).where(eq(chats.userId, user?.id));
  return data as Chats[];
}
