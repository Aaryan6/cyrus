"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  user: any;
};
export default function Hero({ user }: Props) {
  const router = useRouter();

  return (
    <div className="grid place-content-center">
      <div className="px-10 py-44 text-center">
        <h1 className="text-6xl font-bold">Your Personalised Assistant</h1>
        <h1 className="text-6xl font-bold">Jinn.</h1>
        {user ? (
          <Button
            className="mt-4"
            onClick={() => router.push(`/${user.username}/chat`)}
          >
            Get Started
          </Button>
        ) : (
          <Button className="mt-4" onClick={() => router.push("/sign-in")}>
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}
