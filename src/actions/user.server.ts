"use server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { UserInfo } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function getUser() {
  return null;
}

export async function getSession() {
  return null;
}

export async function updateUserUsername({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  const res = await db
    .update(users)
    .set({ username: username })
    .where(eq(users.id, userId))
    .returning();
  return res;
}
