"use client";

import { PlusIcon, ArrowRightCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { Chats } from "@/lib/types";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ChatHistory() {
  const pathname = usePathname();
  const { data, error, isFetching } = useQuery({
    queryKey: ["chat-history"],
    queryFn: async () => {
      const result = await axios.get("/api/chat/history");
      return result.data?.chats;
    },
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Chat History</h3>
        <Button className="" size="sm" variant="ghost">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="">
        {isFetching && <div>Loading...</div>}
        {error && <div>Error</div>}
        {data && (
          <div className="space-y-2">
            {data.map((chat: Chats, index: number) => {
              return (
                <Link
                  href={`/${pathname}/${chat.id}`}
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
      </div>
    </div>
  );
}
