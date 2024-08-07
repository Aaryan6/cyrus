"use client";

import { BotIcon, SearchIcon, SettingsIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-background border-b text-foreground px-6 flex items-center justify-between h-[4rem]">
      <Link href={"/"} className="flex items-center">
        <BotIcon className="h-6 w-6 mr-2" />
        <span className="text-lg font-bold">Jinn.</span>
      </Link>
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
        {/* <ThemeToggle /> */}
      </div>
    </header>
  );
}
