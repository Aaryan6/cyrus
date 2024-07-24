import { getChats } from "@/actions/chats.server";
import { Chat } from "@/components/chat/chat";

export default async function ChatPage({
  params: { chatid },
}: {
  params: { username: string; chatid: string };
}) {
  const chats = await getChats(chatid);
  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto">
      <Chat chatId={chatid} initialMessages={chats?.payload.messages || []} />
    </div>
  );
}
