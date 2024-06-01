"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

export default function BotMessage() {
  return (
    <div className="flex items-start space-x-4">
      <Avatar className="w-8 h-8">
        <AvatarImage alt="User" src="/placeholder-user.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-lg p-4 max-w-[80%]">
        <p>Hello, how can I help you today?</p>
      </div>
    </div>
  );
}
