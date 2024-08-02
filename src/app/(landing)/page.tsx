import Navbar from "@/components/Header/navbar";
import Hero from "./_components/hero";
import { redirect } from "next/navigation";

export default async function Home() {
  return (
    <main className="h-screen">
      <Navbar />
      <Hero user={null} />
    </main>
  );
}
