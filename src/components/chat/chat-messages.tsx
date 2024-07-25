import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Message } from "ai";
import { UserMessage } from "./user-message";
import { StaticBotMessage } from "./bot-message";
import Image from "next/image";

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
        "mb-4 flex-1 flex flex-col gap-4 max-w-4xl mx-auto pt-10 pb-20"
      )}
    >
      {messages?.map((message, index: number) => {
        return (
          <div key={message.id ?? index} className="flex flex-col">
            {message.role === "assistant" ? (
              <StaticBotMessage message={message} />
            ) : (
              message.role === "user" && (
                <UserMessage message={message.content} />
              )
            )}
            <div className="flex justify-end gap-2 mt-2 pr-12">
              {message?.experimental_attachments
                ?.filter((attachment) =>
                  attachment?.contentType?.startsWith("image/")
                )
                .map((attachment, index) => (
                  <Image
                    key={`${message.id}-${index}`}
                    src={attachment.url}
                    width={200}
                    height={200}
                    alt={"attachment"}
                    className="rounded-md"
                  />
                ))}
            </div>
          </div>
        );
      })}
      <div ref={bottomScrollRef} className="pb-12" />
    </div>
  );
}
