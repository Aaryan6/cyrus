"use client";

import { PlusIcon, ArrowRightCircleIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Chats } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { cn, nanoid } from "@/lib/utils";

export default function ChatHistory({ history }: { history: Chats[] }) {
  const pathname = usePathname();
  const username = pathname.split("/")[1];
  const id = nanoid();
  return (
    <div className="space-y-4 flex flex-col w-full">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Chat History</h3>
        <Link
          href={`/${username}/${id}`}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        >
          <PlusIcon className="h-4 w-4" />
        </Link>
      </div>
      <ScrollArea className="h-[15rem]">
        {history.length !== 0 && (
          <div className="space-y-2 w-full">
            {history.map((chat: Chats, index: number) => {
              return (
                <Link
                  href={`/${pathname}/${chat.id}`}
                  key={chat.id ?? index}
                  className="group flex items-center space-x-2 transition-all duration-300 p-2 rounded-lg bg-muted"
                >
                  <ArrowRightCircleIcon className="h-4 w-4 hidden group-hover:inline-block transition duration-700" />
                  <p className="flex-1 text-wrap line-clamp-1 w-full">
                    {chat.payload?.title}
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
