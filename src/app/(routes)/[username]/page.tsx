"use client";
import { Button } from "@/components/ui/button";
import { nanoid } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PersonalisePage({
  params: { username },
}: {
  params: { username: string };
}) {
  const router = useRouter();
  const createChat = () => {
    const id = nanoid();
    router.push(`/${username}/rag/${id}`);
  };
  return (
    <div className="p-4">
      <Button onClick={createChat}>New Chat</Button>
    </div>
  );
}
