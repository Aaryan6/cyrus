"use client";

import { UserMessage } from "@/components/chat/user-message";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { BotIcon, SendIcon } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
  chatId: string;
  initialMessages: any;
};
export default function RagChat({ chatId, initialMessages }: Props) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxToolRoundtrips: 2,
    initialMessages: initialMessages ?? [],
    body: {
      chatId: chatId,
    },
  });
  const bottomScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-full w-full flex flex-col">
      <div
        className={cn(
          "mb-4 flex-1 h-[calc(100vh-10rem)] flex flex-col gap-4 max-w-4xl mx-auto pt-10 overflow-y-auto"
        )}
      >
        {messages?.map((message, index: number) => {
          return (
            <div key={message.id ?? index}>
              {message.role === "assistant" ? (
                <div className="flex-1 relative w-full">
                  <div className="flex w-full justify-start gap-x-2 max-w-4xl mx-auto h-full">
                    <div className="bg-foreground border border-primary w-10 h-10 rounded-full grid place-items-center">
                      <BotIcon className="text-muted" />
                    </div>
                    <div
                      className={
                        "w-fit grid grid-cols-1 gap-2 border-2 font-medium text-sm leading-5 border-[#F0F6FA] text-[#5B8989] bg-[#F0F6FA] p-4 rounded-lg rounded-ss-none whitespace-pre-wrap"
                      }
                    >
                      {message.content.length > 0 ? (
                        message.content
                      ) : (
                        <span className="italic font-light">
                          {"calling tool: " +
                            message?.toolInvocations?.[0].toolName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
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
      <div className="px-10 py-4 absolute bottom-0 left-0 w-full">
        <form
          onSubmit={handleSubmit}
          className="relative bg-muted rounded-md overflow-hidden h-20 max-w-3xl mx-auto"
        >
          <Textarea
            className="w-full resize-none rounded-md h-full focus:outline-none focus:ring-2 focus:ring-muted dark:focus:ring-muted px-4 bg-transparent"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            spellCheck={true}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            className="absolute top-1/2 right-3 -translate-y-1/2 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
            size="icon"
            type="submit"
            variant="ghost"
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </ScrollArea>
  );
}
