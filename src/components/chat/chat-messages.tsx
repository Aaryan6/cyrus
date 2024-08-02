import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Message } from "ai";
import { UserMessage } from "./user-message";
import { StaticBotMessage } from "./bot-message";
import Image from "next/image";

export interface ChatMessageProps {
  messages: Message[];
  data: any;
}

export function ChatMessage({ messages, data }: ChatMessageProps) {
  const bottomScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log(data?.[0]);
  return (
    <div
      className={cn(
        "mb-4 flex-1 flex flex-col gap-4 max-w-4xl mx-auto pt-10 pb-20"
      )}
    >
      {JSON.stringify(data?.[0], null, 4)}
      {messages?.map((message, index: number) => {
        return (
          <div key={message.id ?? index} className="flex flex-col">
            {message.role === "assistant" ? (
              <>
                <StaticBotMessage message={message} />
                {data?.[0]?.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-sm text-gray-500">
                      Here are some suggestions:
                    </p>
                    {data[0].map((suggestion: any, index: number) => (
                      <button
                        key={index}
                        className="text-blue-500 underline"
                        onClick={() => {
                          console.log(suggestion.question);
                        }}
                      >
                        {suggestion.question}
                      </button>
                    ))}
                  </div>
                )}
              </>
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
