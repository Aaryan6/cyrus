"use client";

import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function PromptBox() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="relative">
        <Textarea
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 pr-12 dark:border-gray-800"
          placeholder="Type your message..."
          rows={1}
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
