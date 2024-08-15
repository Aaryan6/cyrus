import ChatHistory from "./chat-history";
import SearchBox from "./search-box";
import Integrations from "./integrations";
import ProfileMenu from "./profile-menu";
import { getChatHistory } from "@/actions/chat/chats.server";
import { currentUser } from "@/hooks/use-current-user";

export default async function Sidebar() {
  const history = await getChatHistory();
  const user = await currentUser();
  return (
    <div className="bg-muted/60 flex flex-col flex-shrink-0 p-4 w-64 h-full border-r border-secondary">
      <div className="space-y-2">
        <SearchBox />
        <Integrations />
        <ChatHistory history={history!} user={user} />
      </div>
      <div className="space-y-2">
        <ProfileMenu user={user} />
      </div>
    </div>
  );
}
