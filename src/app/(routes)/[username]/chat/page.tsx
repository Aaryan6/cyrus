import { currentUser } from "@/hooks/use-current-user";
import { nanoid } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const user = await currentUser();
  if (user?.username !== username) redirect("/");
  redirect(`/${username}/chat/${nanoid()}`);
}
