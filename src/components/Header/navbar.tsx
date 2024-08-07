import { ThemeToggle } from "../theme-toggle";
import ProfileMenu from "../profile-menu";
import { getUser } from "@/actions/user.server";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export default async function Navbar() {
  const { user } = await getUser();
  return (
    <header className="bg-background border-b text-foreground px-6 flex items-center justify-between h-[4rem]">
      <div className="flex items-center">
        <Link href={"/"}>
          <span className="text-lg font-bold">Jinn.</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <ProfileMenu />
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
