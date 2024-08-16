"use client";

import { CalendarRange, MessageCircleDashed } from "lucide-react";
import Link from "next/link";

export default function Integrations({ user }: { user: any }) {
  const apps = [
    {
      name: "Chat",
      icon: MessageCircleDashed,
      href: `/${user.username}/`,
    },
    {
      name: "Meeting Schedular",
      icon: CalendarRange,
      href: `/${user.username}/calendar`,
    },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Apps</h3>
      </div>
      <div className="space-y-2">
        {apps.map((app, i) => (
          <Link
            className="flex items-center gap-2 hover:bg-background rounded-md p-2"
            href={app.href}
            key={i}
          >
            <app.icon size={16} className="mb-0.5" />
            <span className="text-[0.9rem]">{app.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
