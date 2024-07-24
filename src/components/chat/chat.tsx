"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "ai";
import { ChatMessage } from "./chat-messages";
import PromptBox from "./prompt-box";
import { useChat } from "ai/react";

type ChatProps = {
  chatId: string;
  initialMessages: Message[];
};

export function Chat({ chatId, initialMessages }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxToolRoundtrips: 2,
    initialMessages: initialMessages ?? [],
    body: {
      chatId: chatId,
    },
  });
  return (
    <ScrollArea className="h-full w-full flex flex-col">
      <ChatMessage messages={messages} />
      <PromptBox
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </ScrollArea>
  );
}
