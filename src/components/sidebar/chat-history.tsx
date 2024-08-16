"use client";

import { PlusIcon, ArrowRightCircleIcon } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { Chats } from "@/lib/types";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

export default function ChatHistory({
  history,
  user,
}: {
  history: Chats[];
  user: any;
}) {
  return (
    <div className="space-y-4 flex flex-col w-full flex-1">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Chat History</h3>
        <Link
          href={`/${user.username}/`}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        >
          <PlusIcon className="h-4 w-4" />
        </Link>
      </div>
      <ScrollArea className="flex-1 pb-2">
        {history?.length !== 0 && (
          <div className="space-y-2 w-full">
            {history?.map((chat: Chats, index: number) => {
              return (
                <Link
                  href={`/${user.username}/chat/${chat.id}`}
                  key={chat.id ?? index}
                  className="group flex items-center space-x-2 transition-all duration-300 p-2 rounded-lg bg-muted"
                >
                  <ArrowRightCircleIcon className="h-4 w-4 hidden group-hover:inline-block transition duration-700" />
                  <p className="flex-1 text-wrap line-clamp-1 w-full text-sm">
                    {chat?.title}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
