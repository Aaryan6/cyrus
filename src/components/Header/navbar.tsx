import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { auth } from "@/auth";
import ProfileMenu from "../profile-menu";

export default async function Navbar() {
  const session = await auth();
  console.log(session);
  return (
    <header className="bg-background border-b text-foreground px-6 flex items-center justify-between h-[4rem]">
      <div className="flex items-center">
        <Link href={"/"}>
          <span className="text-lg font-bold">Jinn.</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {session ? (
          <ProfileMenu user={session.user} />
        ) : (
          <Link
            className={cn(buttonVariants({ variant: "outline" }))}
            href="/sign-in"
          >
            Sign In
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
