import { AI } from "@/actions/chat.actions";
import { Chat } from "@/components/chat/chat";
import { currentUser } from "@/hooks/use-current-user";
import { generateId } from "ai";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const user = await currentUser();
  const id = generateId();
  if (user?.username !== username) redirect("/");
  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <div className="flex-1 flex flex-col">
        <Chat chatId={id} initialMessages={[]} username={user.username} />
      </div>
    </AI>
  );
}
