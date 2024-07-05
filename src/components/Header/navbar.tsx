"use client";

import { BotIcon, SearchIcon, SettingsIcon } from "@/components/icons";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";

export default function Navbar() {
  return (
    <header className="bg-background border-b text-foreground px-6 flex items-center justify-between h-[4rem]">
      <div className="flex items-center">
        <BotIcon className="h-6 w-6 mr-2" />
        <span className="text-lg font-bold">Chatbot</span>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          className="hover:bg-muted focus:outline-none focus:ring-2 focus:ring-muted"
          size="icon"
          variant="ghost"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>
        <Button
          className="hover:bg-muted focus:outline-none focus:ring-2 focus:ring-muted"
          size="icon"
          variant="ghost"
        >
          <SettingsIcon className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
