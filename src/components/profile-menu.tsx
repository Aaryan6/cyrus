"use client";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ExtendedUser } from "../../next-auth";

export default function ProfileMenu({ user }: { user: ExtendedUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-0">
        <Avatar>
          <AvatarImage src={user?.image!} />
          <AvatarFallback>
            {user?.name
              ? user?.name?.charAt(0).toUpperCase()
              : user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            await signOut();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
