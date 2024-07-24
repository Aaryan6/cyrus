"use client";

import { PlusIcon, SlackIcon, GithubIcon, TrelloIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Integrations() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Features</h3>
        <Button
          className="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
          size="icon"
          variant="ghost"
        >
          <PlusIcon size={20} />
        </Button>
      </div>
      <div className="space-y-2">
        <Link
          className="flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md p-2"
          href="#"
        >
          <SlackIcon size={20} />
          <span>Slack</span>
        </Link>
      </div>
    </div>
  );
}
