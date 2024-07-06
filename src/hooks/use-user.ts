"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        const userInfo = {
          id: data.user.id,
          email: data.user.email,
          avatar_url: data.user.user_metadata?.avatar_url,
          full_name: data.user.user_metadata?.full_name,
        };
        return userInfo;
      }
      return null;
    },
  });
}
