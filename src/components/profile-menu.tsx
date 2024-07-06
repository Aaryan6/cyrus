"use client";

import { useUser } from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function ProfileMenu() {
  const { data: user } = useUser();
  return (
    <Avatar>
      <AvatarImage src={user?.avatar_url} />
      <AvatarFallback>
        {user?.full_name
          ? user?.full_name?.charAt(0).toUpperCase()
          : user?.email?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
