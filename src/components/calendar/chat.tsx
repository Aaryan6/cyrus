"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/calendar/chat-messages";
import PromptBox from "@/components/calendar/prompt-box";
import { useUIState } from "ai/rsc";
import { AI } from "@/actions/chat/chat.actions";

type ChatProps = {
  chatId: string;
  username: string;
};

export function CalendarChat({ chatId, username }: ChatProps) {
  const [conversation] = useUIState<typeof AI>();

  return (
    <ScrollArea className="h-full w-full flex flex-col px-2">
      <ChatMessage messages={conversation} />
      <PromptBox chatId={chatId} />
    </ScrollArea>
  );
}
