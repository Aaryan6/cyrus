import Navbar from "@/components/Header/navbar";
import Hero from "./_components/hero";
import { getUserInfo } from "@/actions/user.server";

export default async function Home() {
  const user = await getUserInfo();
  return (
    <main className="h-screen">
      <Navbar />
      <Hero user={user} />
    </main>
  );
}
