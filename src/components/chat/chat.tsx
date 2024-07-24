"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { Message } from "ai";
import { useAIState, useUIState } from "ai/rsc";
import { AI, AIState } from "@/actions/chat.actions";
import { UserMessage } from "./user-message";
import { ChatMessage } from "./chat-messages";
import { StaticBotMessage } from "./bot-message";
import PromptBox from "./prompt-box";

type ChatProps = {
  id: string;
  initialMessages: Message[];
};

export const getUIStateFromAIState = (aiState: AIState) => {
  return aiState.messages
    ?.filter((message) => message.role.toLowerCase() !== "system")
    ?.map((message) => ({
      id: message.id,
      display:
        message.role.toLowerCase() === "user" ? (
          <UserMessage message={message.content} />
        ) : (
          <StaticBotMessage message={message.content} />
        ),
    }));
};

export function Chat({ id, initialMessages }: ChatProps) {
  const [aiState, setAIState] = useAIState<typeof AI>();
  const [messages, setMessages] = useUIState<typeof AI>();

  useEffect(() => {
    if (id && aiState.messages.length === 0) {
      setAIState({
        chatId: id,
        messages: initialMessages || [],
      });
      setMessages(
        getUIStateFromAIState({ chatId: id, messages: initialMessages || [] })
      );
    }
  }, [id]);

  return (
    <ScrollArea className="h-full w-full flex flex-col">
      <ChatMessage
        messages={messages}
        aiState={aiState}
        initialMessages={initialMessages}
      />
      <PromptBox />
    </ScrollArea>
  );
}
