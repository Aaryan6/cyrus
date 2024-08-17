import { getChats } from "@/actions/chat/chats.server";
import { Chat } from "@/components/chat/chat";
import { currentUser } from "@/hooks/use-current-user";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params: { chatid, username },
}: {
  params: { username: string; chatid: string };
}) {
  const chats = await getChats(chatid);
  const user = await currentUser();
  if (user?.username !== username) redirect("/");
  return (
    <div className="flex-1 flex flex-col">
      <Chat
        chatId={chatid}
        username={user.username}
        initialMessages={chats?.messages || []}
      />
    </div>
  );
}
