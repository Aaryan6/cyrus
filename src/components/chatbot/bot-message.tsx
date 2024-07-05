"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { BotIcon } from "../icons";

export default function BotMessage() {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-8 h-8 bg-foreground rounded-md overflow-hidden grid place-items-center">
        <BotIcon className="stroke-background w-5 h-5" />
      </div>
      <div className="bg-muted rounded-lg p-4 max-w-[80%]">
        <p>Hello, how can I help you today?</p>
      </div>
    </div>
  );
}
