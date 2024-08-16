"use client";

import { FileTextIcon, CalendarRange } from "lucide-react";
import Link from "next/link";

export default function Integrations({ user }: { user: any }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Apps</h3>
      </div>
      <div className="space-y-2">
        <Link
          className="flex items-center space-x-2 hover:bg-background rounded-md p-2"
          href={`/${user.username}/calendar`}
        >
          <CalendarRange size={20} />
          <span>Meeting Schedular</span>
        </Link>
        <Link
          className="flex items-center space-x-2 hover:bg-background rounded-md p-2"
          href="#"
        >
          <FileTextIcon size={20} />
          <span>Chat with PDF</span>
        </Link>
      </div>
    </div>
  );
}
