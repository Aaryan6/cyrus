"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-messages";
import PromptBox from "./prompt-box";
import { useEffect } from "react";
import { useUIState } from "ai/rsc";
import { AI, AIMessage } from "@/actions/chat/chat.actions";
import { usePathname } from "next/navigation";

type ChatProps = {
  chatId: string;
  username: string;
};

export function Chat({ chatId, username }: ChatProps) {
  const [conversation] = useUIState<typeof AI>();
  const path = usePathname();

  useEffect(() => {
    if (username) {
      if (!path.includes("chat") && conversation.length === 1) {
        window.history.replaceState({}, "", `/${username}/chat/${chatId}`);
      }
    }
  }, [chatId, path, username, conversation]);

  return (
    <ScrollArea className="h-full w-full flex flex-col px-2">
      <ChatMessage messages={conversation} />
      <PromptBox chatId={chatId} />
    </ScrollArea>
  );
}
