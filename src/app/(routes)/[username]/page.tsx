import { nanoid } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function PersonalisePage({
  params: { username },
}: {
  params: { username: string };
}) {
  const id = nanoid();
  redirect(`/${username}/${id}`);
}
