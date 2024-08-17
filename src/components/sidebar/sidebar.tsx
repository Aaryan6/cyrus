import { cache } from "react";
import ChatHistory from "./chat-history";
import Integrations from "./integrations";
import ProfileMenu from "./profile-menu";
import { getChatHistory } from "@/actions/chat/chats.server";
import { currentUser } from "@/hooks/use-current-user";

const loadChats = cache(async () => {
  const history = await getChatHistory();
  return history;
});

export default async function Sidebar() {
  const history = await loadChats();
  const user = await currentUser();
  return (
    <div className="bg-muted flex flex-col p-4 w-64 h-[calc(100vh-4rem)] relative border-r">
      <div className="space-y-2 flex-1 flex flex-col overflow-y-auto">
        <Integrations user={user} />
        <ChatHistory history={history!} user={user} />
      </div>
      <ProfileMenu user={user} />
    </div>
  );
}
