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

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    console.log("Session not found");
    return null;
  }
  const expiresAt = session.expires_at;

  if (!expiresAt) {
    console.log("Session does not have an expiry date");
    return;
  }

  // Check if the token is expired or about to expire (within 5 minutes)
  const isExpired = Date.now() >= expiresAt * 1000;
  const isAboutToExpire = Date.now() >= expiresAt * 1000 - 5 * 60 * 1000;

  if (isExpired || isAboutToExpire) {
    console.log("Token is expired or about to expire. Refreshing...");
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession();
    if (error) {
      console.error("Error refreshing session", error);
      return null;
    }
    return session;
  }

  return session;
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
