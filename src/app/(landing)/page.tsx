import Navbar from "@/components/Header/navbar";
import { createClient } from "@/lib/supabase/server";
import Hero from "./_components/hero";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log(user);
  return (
    <main className="h-screen">
      <Navbar />
      <Hero />
    </main>
  );
}
