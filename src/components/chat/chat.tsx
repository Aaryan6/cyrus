"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { generateId, Message } from "ai";
import { ChatMessage } from "./chat-messages";
import PromptBox from "./prompt-box";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { useActions, useAIState, useUIState } from "ai/rsc";
import {
  AI,
  AIMessage,
  AIState,
  getUIStateFromAIState,
} from "@/actions/chat.actions";
import { UserMessage } from "./user-message";
import { StaticBotMessage } from "./bot-message";
import { GetUser } from "@/hooks/use-user";
import { usePathname } from "next/navigation";

type ChatProps = {
  chatId: string;
  initialMessages: AIMessage[];
  username: string;
};

export function Chat({ chatId, initialMessages, username }: ChatProps) {
  const [conversation] = useUIState<typeof AI>();
  const path = usePathname();

  useEffect(() => {
    if (username) {
      if (path.includes("chat") && conversation.length === 1) {
        window.history.replaceState({}, "", `/${username}/chat/${chatId}`);
      }
    }
  }, [chatId, path, username, conversation]);

  return (
    <ScrollArea className="h-full w-full flex flex-col">
      <ChatMessage messages={conversation} />
      <PromptBox chatId={chatId} />
    </ScrollArea>
  );
}
