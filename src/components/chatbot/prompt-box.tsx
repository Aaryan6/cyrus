"use client";

import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function PromptBox() {
  return (
    <div className="px-10 py-4">
      <div className="relative bg-muted rounded-md overflow-hidden">
        <Textarea
          className="w-full rounded-md py-3 focus:outline-none focus:ring-2 focus:ring-muted dark:focus:ring-muted px-4 bg-transparent"
          placeholder="Type your message..."
        />
        <Button
          className="absolute top-1/2 right-3 -translate-y-1/2 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
          size="icon"
          type="submit"
          variant="ghost"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
