"use client";

import { signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ProfileBox({ user }: { user: any }) {
  return (
    <div className="space-y-4 mt-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-0 flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user?.image!} />
            <AvatarFallback>
              {user?.name
                ? user?.name?.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="font-semibold">{user?.name}</h2>
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
    </div>
  );
}
