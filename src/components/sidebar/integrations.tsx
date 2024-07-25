"use client";

import {
  PlusIcon,
  SlackIcon,
  GithubIcon,
  TrelloIcon,
  YoutubeIcon,
  FileTextIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Integrations() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Features</h3>
      </div>
      <div className="space-y-2">
        <Link
          className="flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md p-2"
          href="#"
        >
          <YoutubeIcon size={20} />
          <span>YouTube Summarizer</span>
        </Link>
        <Link
          className="flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md p-2"
          href="#"
        >
          <FileTextIcon size={20} />
          <span>Chat with PDF</span>
        </Link>
      </div>
    </div>
  );
}
