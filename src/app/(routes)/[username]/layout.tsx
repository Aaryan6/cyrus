import { AI } from "@/actions/chat.actions";
import { getSession, getUser } from "@/actions/user.server";
import { nanoid } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();
  const session = await getSession();
  // console.log(session);
  // console.log(user);
  if (!user) redirect("/sign-in");
  return (
    <AI initialAIState={{ chatId: nanoid(), messages: [] }} initialUIState={[]}>
      {children}
    </AI>
  );
}
