import { redirect } from "next/navigation";

export default function PersonalisePage({
  params: { username },
}: {
  params: { username: string };
}) {
  redirect(`/${username}/chat`);
}
