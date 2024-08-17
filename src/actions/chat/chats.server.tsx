"use server";
import { db } from "@/lib/db";
import { Chats } from "@/lib/types";
import { auth } from "@/auth";

export async function getChats(chatId: string) {
  const data = await db.chats.findUnique({ where: { id: chatId } });
  return data as Chats;
}

export async function getChatHistory() {
  const session = await auth();
  if (session === null || !session.user) return;
  const data = await db.chats.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: "desc" },
  });
  return data as Chats[];
}
