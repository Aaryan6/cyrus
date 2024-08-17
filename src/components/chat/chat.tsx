"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { Textarea } from "../ui/textarea";
import { Button, buttonVariants } from "../ui/button";
import { FileSpreadsheet, Forward, Paperclip, Plus } from "lucide-react";
import { BotLoading, StaticBotMessage } from "./bot-message";
import { UserMessage } from "./user-message";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import Link from "next/link";
import Image from "next/image";
import { Input } from "../ui/input";

type ChatProps = {
  chatId: string;
  username: string;
  initialMessages?: any[];
};

export function Chat({ chatId, username, initialMessages }: ChatProps) {
  const path = usePathname();
  const router = useRouter();
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    handleInputChange,
    messages,
    input,
    isLoading: isThinking,
  } = useChat({
    body: {
      chatId,
    },
    initialMessages: initialMessages || [],
    maxToolRoundtrips: 2,
    onResponse(response) {
      if (response?.status == 200) {
        setIsLoading(false);
      }
    },
  });
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log({ chatId });

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

  useEffect(() => {
    if (messages.length === 2) {
      router.refresh();
    }
  }, [messages, router]);

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e, {
        experimental_attachments: files,
      });
      setFiles(undefined);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => {
        setIsLoading(true);
      }, 1000);
    }
  };

  return (
    <ScrollArea className="h-full w-full flex flex-col px-2 bg-background">
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
              <div className="flex justify-end gap-2 mt-2 pr-10">
                {message?.experimental_attachments?.map((attachment, index) => {
                  if (attachment?.contentType?.startsWith("image/")) {
                    return (
                      <Image
                        key={`${message.id}-${index}`}
                        src={attachment.url}
                        width={200}
                        height={200}
                        alt={"attachment"}
                        className="rounded-md"
                      />
                    );
                  } else {
                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="flex bg-muted px-4 py-2 rounded-lg items-center gap-2 max-w-sm"
                      >
                        <FileSpreadsheet size={16} className="shrink-0" />
                        <p className="text-sm truncate">{attachment.name}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
        {/* {isThinking && me && <BotLoading />} */}
        <div ref={bottomScrollRef} className="pb-12" />
      </div>
      <div className="px-10 py-4 absolute bottom-0 inset-x-0 w-full max-w-4xl mx-auto">
        <form
          onSubmit={(event) => {
            handleSubmit(event, {
              experimental_attachments: files,
            });

            setFiles(undefined);

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            setTimeout(() => {
              setIsLoading(true);
            }, 1000);
          }}
          className="relative rounded-xl"
        >
          <Textarea
            className={cn(
              "w-full resize-none max-h-44 pl-10 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-muted dark:focus:ring-muted bg-muted focus-visible:ring-offset-0",
              files && files?.item.length > 0 && ""
            )}
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            spellCheck={true}
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />
          <div className="absolute bottom-1 rounded-lg left-1 grid gap-1 pointer-events-none">
            <Link
              href={`/${username}/chat`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "cursor-pointer w-8 h-8 pointer-events-auto"
              )}
            >
              <Plus size={18} />
            </Link>
            <div className="flex items-center pointer-events-auto">
              <Label
                htmlFor="file"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "cursor-pointer w-8 h-8"
                )}
              >
                <Paperclip size={16} />
              </Label>
              {files && (
                <p className="text-sm bg-background px-2 py-0.5 rounded-lg text-muted-foreground">
                  {Array.from(files)
                    .map(
                      (file) =>
                        file.name.substring(0, 12) +
                        "..." +
                        file.name.substring(file.name.length - 6)
                    )
                    .join(",")}
                </p>
              )}
            </div>
            <Input
              type="file"
              className="absolute top-5 left-5 w-fit hidden"
              onChange={(event) => {
                if (event.target.files) {
                  setFiles(event.target.files);
                }
              }}
              id="file"
              multiple
              ref={fileInputRef}
            />
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
