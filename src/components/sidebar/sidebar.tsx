"use client";
import ChatHistory from "./chat-history";
import SearchBox from "./search-box";
import Integrations from "./integrations";
import ProfileMenu from "./profile-menu";

export default function Sidebar() {
  return (
    <div className="bg-muted p-6 w-64 border-r border-secondary grid place-content-between">
      <div className="space-y-6">
        <SearchBox />
        <ChatHistory />
      </div>
      <div className="space-y-6">
        <Integrations />
        <ProfileMenu />
      </div>
    </div>
  );
}
