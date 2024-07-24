import { createClient } from "@/lib/supabase/server";
import { UserInfo } from "@/lib/types";

export async function getUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
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
