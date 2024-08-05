import Navbar from "@/components/Header/navbar";
import Hero from "./_components/hero";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session?.user.username) redirect("/update-profile");
  return (
    <main className="h-screen">
      <Navbar />
      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: "/sign-in",
          });
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
      <Hero user={session?.user} />
    </main>
  );
}
