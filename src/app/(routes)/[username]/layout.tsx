import { AI } from "@/actions/chat.actions";
import { nanoid } from "@/lib/utils";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AI initialAIState={{ chatId: nanoid(), messages: [] }} initialUIState={[]}>
      {children}
    </AI>
  );
}
