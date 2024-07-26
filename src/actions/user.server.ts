"use server";
import db from "@/lib/supabase/db";
import { users } from "@/lib/supabase/schema";
import { createClient } from "@/lib/supabase/server";
import { UserInfo } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function getUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data;
}

export async function getSession() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data;
}

export async function getUserInfo() {
  const supabase = createClient();
  const { user } = await getUser();
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();
  return data as UserInfo;
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
