import ChatHistory from "./chat-history";
import SearchBox from "./search-box";
import Integrations from "./integrations";
import ProfileMenu from "./profile-menu";
import { getChatHistory } from "@/actions/chats.server";

export default async function Sidebar() {
  const history = await getChatHistory();
  return (
    <div className="bg-muted/60 p-4 w-64 h-full border-r border-secondary grid place-content-between">
      <div className="space-y-2 h-full">
        <SearchBox />
        <ChatHistory history={history} />
      </div>
      <div className="space-y-2">
        <Integrations />
        <ProfileMenu />
      </div>
    </div>
  );
}
