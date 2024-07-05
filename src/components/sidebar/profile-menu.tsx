"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { FlipVerticalIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function ProfileMenu() {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Profile</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              size="icon"
              variant="ghost"
            >
              <FlipVerticalIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarImage alt="User" src="/placeholder-user.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">John Doe</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            john@example.com
          </p>
        </div>
      </div>
    </div>
  );
}
