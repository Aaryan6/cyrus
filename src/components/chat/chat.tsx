"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "ai";
import { ChatMessage } from "./chat-messages";
import PromptBox from "./prompt-box";
import { useChat } from "ai/react";
import { useRef, useState } from "react";

type ChatProps = {
  chatId: string;
  initialMessages: Message[];
};

export function Chat({ chatId, initialMessages }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat({
    maxToolRoundtrips: 2,
    initialMessages: initialMessages ?? [],
    body: {
      chatId: chatId,
    },
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <ScrollArea className="h-full w-full flex flex-col">
      <ChatMessage messages={messages} data={data} />
      <PromptBox
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        files={files}
        setFiles={setFiles}
        fileInputRef={fileInputRef}
      />
    </ScrollArea>
  );
}
