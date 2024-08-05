"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { updateUserUsername } from "@/actions/user.server";
import { nanoid } from "@/lib/utils";
import { GetUser } from "@/hooks/use-user";

export default function UpdateProfile() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const id = nanoid();
  const user = GetUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const username = formData.get("username") as string;

      if (!username) {
        return toast.error("Please enter your username", {
          position: "top-center",
        });
      }
      if (username.length < 3) {
        return toast.error("username must be at least 3 letters", {
          position: "top-center",
        });
      }

      if (!user) {
        return;
      }

      const data = await updateUserUsername({ userId: user.id!, username });
      if (!data) {
        return toast.error("Failed to update your username", {
          position: "top-center",
        });
      }
      router.push(`/${data.username}/${id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.username !== "") {
    router.push(`/${user?.username}/${id}`);
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-t from-black via-transparent to-transparent">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Enter your username
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="username (max 3 characters)"
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button disabled={loading} className="w-full">
              Continue
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
