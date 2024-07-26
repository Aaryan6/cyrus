import Navbar from "@/components/Header/navbar";
import Hero from "./_components/hero";
import { getUserInfo } from "@/actions/user.server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUserInfo();
  // console.log(user);
  if (user && !user.username) redirect("/update-profile");
  return (
    <main className="h-screen">
      <Navbar />
      <Hero user={user} />
    </main>
  );
}
