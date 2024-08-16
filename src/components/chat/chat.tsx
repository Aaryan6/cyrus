"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "ai/react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Forward } from "lucide-react";
import { StaticBotMessage } from "./bot-message";
import { UserMessage } from "./user-message";
import { cn } from "@/lib/utils";

type ChatProps = {
  chatId: string;
  username: string;
  initialMessages?: any[];
};

export function Chat({ chatId, username, initialMessages }: ChatProps) {
  const path = usePathname();
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const { handleSubmit, handleInputChange, messages, input } = useChat({
    body: {
      chatId,
    },
    initialMessages: initialMessages || [],
    maxToolRoundtrips: 2,
  });

  useEffect(() => {
    if (username) {
      if (!path.includes("chat") && messages.length === 1) {
        window.history.replaceState({}, "", `/${username}/chat/${chatId}`);
      }
    }
  }, [chatId, path, username, messages]);

  useEffect(() => {
    bottomScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-full w-full flex flex-col px-2">
      <div
        className={cn(
          "mb-4 flex-1 flex flex-col gap-4 max-w-4xl mx-auto pt-10 pb-20"
        )}
      >
        {messages.map((message, index: number) => {
          return (
            <div key={message?.id ?? index}>
              {message.role === "assistant"
                ? message.content.length > 0 && (
                    <StaticBotMessage message={message.content} />
                  )
                : message.role === "user" && (
                    <UserMessage message={message.content} />
                  )}
            </div>
          );
        })}
        <div ref={bottomScrollRef} className="pb-12" />
      </div>
      <div className="px-10 py-4 absolute bottom-0 inset-x-0 w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative bg-muted rounded-xl">
          <Textarea
            className="w-full resize-none max-h-44 rounded-xl focus:outline-none focus:ring-2 focus:ring-muted dark:focus:ring-muted px-4 bg-transparent focus-visible:ring-offset-0"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            spellCheck={true}
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />
          <div className="absolute bottom-0 rounded-lg -left-10 grid gap-1">
            {/* <Link
            href={`/${pathname.split("/")[1]}/${newId}}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "cursor-pointer w-8 h-8"
            )}
          >
            <Plus size={18} />
          </Link> */}
            {/* <PromptOptions /> */}
            {/* <Label
            htmlFor="file"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "cursor-pointer w-8 h-8"
            )}
          >
            <Paperclip size={16} />
          </Label> */}
          </div>
          <Button
            className="absolute -bottom-2 right-2 px-2 h-8 -translate-y-1/2 bg-foreground hover:text-background hover:bg-foreground/80 text-background focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
            size="sm"
            type="submit"
            variant="ghost"
          >
            <Forward className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </ScrollArea>
  );
}
