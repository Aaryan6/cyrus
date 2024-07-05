"use client";

import UserMessage from "./user-message";
import BotMessage from "./bot-message";

export default function ChatMessages() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-4">
        <BotMessage />
        <UserMessage />
      </div>
    </div>
  );
}
