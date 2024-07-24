"use client";

import { Input } from "../ui/input";

export default function SearchBox() {
  return (
    <div className="space-y-2">
      <Input
        className="w-full rounded-md border px-3 py-2 focus-visible:ring-transparent"
        placeholder="Search conversations..."
        type="text"
      />
    </div>
  );
}
