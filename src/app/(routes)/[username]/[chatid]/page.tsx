import { getChats } from "@/actions/chats.server";
import { getUser } from "@/actions/user.server";
import { Chat } from "@/components/chat/chat";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params: { chatid },
}: {
  params: { username: string; chatid: string };
}) {
  const user = await getUser();
  if (!user) redirect("/sign-in");
  const chats = await getChats(chatid);
  return (
    <div className="flex-1 flex flex-col">
      <Chat chatId={chatid} initialMessages={chats?.payload.messages || []} />
    </div>
  );
}
