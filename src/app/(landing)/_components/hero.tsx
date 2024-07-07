"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <div className="grid place-content-center">
      <div className="px-10 py-44 text-center">
        <h1 className="text-6xl font-bold">Your Personalised Assistant</h1>
        <h1 className="text-6xl font-bold">Jinn.</h1>
        <Button className="mt-4" onClick={() => router.push("/aaryan")}>
          Get Started
        </Button>
      </div>
    </div>
  );
}
