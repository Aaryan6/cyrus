import ChatHistory from "./chat-history";
import SearchBox from "./search-box";
import Integrations from "./integrations";
import ProfileMenu from "./profile-menu";
import { getChatHistory } from "@/actions/chats.server";

export default async function Sidebar() {
  const history = await getChatHistory();
  return (
    <div className="bg-muted/60 flex flex-col flex-shrink-0 p-4 w-64 h-full border-r border-secondary">
      <div className="space-y-2">
        <SearchBox />
        <Integrations />
        <ChatHistory history={history} />
      </div>
      <div className="space-y-2">
        <ProfileMenu />
      </div>
    </div>
  );
}
