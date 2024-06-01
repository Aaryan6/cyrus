"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function SearchBox() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Search</h3>
        <Button
          className="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
          size="icon"
          variant="ghost"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>
      </div>
      <Input
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 dark:border-gray-800"
        placeholder="Search conversations..."
        type="text"
      />
    </div>
  );
}
