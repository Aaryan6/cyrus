"use client";

import { PlusIcon, ArrowRightCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Chats } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

export default function ChatHistory({ history }: { history: Chats[] }) {
  const pathname = usePathname();
  console.log(history);
  return (
    <div className="space-y-4 flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Chat History</h3>
        <Button className="" size="sm" variant="ghost">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[20rem]">
        {history.length !== 0 && (
          <div className="space-y-2">
            {history.map((chat: Chats, index: number) => {
              return (
                <Link
                  href={`/${pathname}/rag/${chat.id}`}
                  key={chat.id ?? index}
                  className="group flex items-center space-x-2 transition-all duration-300 p-2 rounded-lg bg-muted"
                >
                  <ArrowRightCircleIcon className="h-4 w-4 hidden group-hover:inline-block transition duration-700" />
                  <div className="flex-1 truncate">{chat.payload?.title}</div>
                </Link>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
