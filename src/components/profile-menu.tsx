"use client";

import { useUser } from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const logOut = async () => {
    queryClient.invalidateQueries({
      queryKey: ["user"],
    });
    router.push("/sign-in");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-0">
        {/* <Avatar>
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>
            {user?.full_name
              ? user?.full_name?.charAt(0).toUpperCase()
              : user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => await logOut()}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
