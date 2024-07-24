import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Message } from "ai";
import { UserMessage } from "./user-message";
import { StaticBotMessage } from "./bot-message";

export interface ChatMessageProps {
  messages: Message[];
}

export function ChatMessage({ messages }: ChatMessageProps) {
  const bottomScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={cn(
        "mb-4 flex-1 h-[calc(100vh-10rem)] flex flex-col gap-4 max-w-4xl mx-auto pt-10 overflow-y-auto"
      )}
    >
      {messages?.map((message, index: number) => {
        return (
          <div key={message.id ?? index}>
            {message.role === "assistant" ? (
              <StaticBotMessage message={message} />
            ) : (
              message.role === "user" && (
                <UserMessage message={message.content} />
              )
            )}
          </div>
        );
      })}
      <div ref={bottomScrollRef} className="pb-12" />
    </div>
  );
}
