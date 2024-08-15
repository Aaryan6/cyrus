"use client";
import { AI } from "@/actions/chat.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { Plus } from "lucide-react";
import { useState } from "react";
import { UserMessage } from "./user-message";
import { usePathname } from "next/navigation";

type Props = {};

export function PromptOptions({}: Props) {
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { submit } = useActions();
  const pathname = usePathname();
  const chatId = pathname.split("/")[2];

  const sendMessage = async (text: string) => {
    setConversation((currentConversation) => [
      ...currentConversation,
      {
        id: generateId(),
        role: "user",
        display: <UserMessage message={text} />,
      },
    ]);
    const message = await submit(text, chatId);

    setConversation((currentConversation) => [...currentConversation, message]);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="px-0">
          <Plus size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="grid gap-4">
          {messages.map((message) => (
            <Button key={message} onClick={() => sendMessage(message)}>
              {message}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const messages = ["Schedule a meeting", "Check my events"];
