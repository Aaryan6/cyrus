import Navbar from "@/components/Header/navbar";
import Hero from "./_components/hero";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/sign-in");
  if (!session?.user.username) redirect("/update-profile");
  return (
    <main className="h-screen">
      <Navbar />
      <Hero user={session?.user} />
    </main>
  );
}
