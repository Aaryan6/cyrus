"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { PlusIcon, Link } from "lucide-react";
import { Button } from "../ui/button";

export default function ChatHistory() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Chat History</h3>
        <Button
          className="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
          size="icon"
          variant="ghost"
        >
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
