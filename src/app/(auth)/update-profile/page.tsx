"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/use-user";
import { useQueryClient } from "@tanstack/react-query";
import { updateUserUsername } from "@/actions/user.server";
import { nanoid } from "@/lib/utils";

export default function SignInPage() {
  const { data: user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = nanoid();

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

      const data = await updateUserUsername({ userId: user?.id, username });
      if (data.length === 0) {
        return toast.error("Failed to update your username", {
          position: "top-center",
        });
      }
      queryClient.refetchQueries({
        queryKey: ["user"],
      });
      router.push(`/${data[0].username}/${id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
