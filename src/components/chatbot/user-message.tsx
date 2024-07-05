"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

export default function UserMessage() {
  return (
    <div className="flex items-start space-x-4 justify-end">
      <div className="bg-muted-foreground text-background rounded-lg p-4 max-w-[80%]">
        <p>I have a question about the product features.</p>
      </div>
      <Avatar className="w-8 h-8 rounded-md overflow-hidden">
        <AvatarImage alt="User" src="/placeholder-user.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  );
}
