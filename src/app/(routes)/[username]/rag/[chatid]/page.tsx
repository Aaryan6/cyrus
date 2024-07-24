import { getChats } from "@/actions/chats.server";
import RagChat from "./_components/chat";

export default async function Chat({
  params,
}: {
  params: { username: string; chatid: string };
}) {
  const chat = await getChats(params.chatid);
  return (
    <RagChat
      chatId={params.chatid}
      initialMessages={chat?.payload?.messages ?? []}
    />
  );
}
