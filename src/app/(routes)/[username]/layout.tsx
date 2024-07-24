import { AI } from "@/actions/chat.actions";
import { getUser } from "@/actions/user.server";
import { nanoid } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();
  if (!user) redirect("/sign-in");
  return (
    <AI initialAIState={{ chatId: nanoid(), messages: [] }} initialUIState={[]}>
      {children}
    </AI>
  );
}
