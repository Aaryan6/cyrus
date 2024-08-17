import { currentUser } from "@/hooks/use-current-user";
import { nanoid } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const user = await currentUser();
  const id = nanoid();
  if (user?.username !== username) redirect("/");
  redirect(`/${username}/chat/${id}`);
}
