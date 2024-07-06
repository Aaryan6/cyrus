"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn, getURL } from "@/lib/utils";

import { Icons } from "@/components/icons";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import BG from "@/public/jinn.jpeg";
import { useUser } from "@/hooks/use-user";

export default function SignInPage() {
  const supabase = createClient();
  const { data: user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [linkMessage, setLinkMessage] = useState<boolean>(false);

  const handleLoginWithOAuth = (provider: "google") => {
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getURL() + `auth/callback`,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      if (error.status == 429) {
        return toast.error("Something went wrong!", {
          position: "top-center",
          style: {
            background: "orange",
            color: "black",
          },
        });
      }
      return toast.error(error.message, {
        position: "top-center",
        style: {
          background: "orange",
          color: "black",
        },
      });
    }
    setLinkMessage(true);
    setLoading(false);
    router.push("/");
  };

  if (user) return router.push("/");

  return (
    <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r ">
        <div className="bg-gradient-to-t from-black via-transparent to-transparent absolute top-0 left-0 w-full h-full z-20"></div>
        <div className="absolute inset-0 bg-zinc-900" />
        <Link
          href={"/"}
          className="relative z-20 flex items-center text-xl font-bold"
        >
          Jinn.
        </Link>
        <Image src={BG} alt="Jinn" fill className="object-cover" />
        <div className="relative z-20 mt-auto">
          <p className="text-md">
            Discover the art of transforming your innovative AI ideas into
            reality with our pocket-friendly workshops and courses. No
            experience required!
          </p>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full max-w-lg flex-col justify-center space-y-6">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create a new account</CardTitle>
                <CardDescription>
                  Enter your email and Password below to proceed
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 gap-6">
                  <Button
                    onClick={() => handleLoginWithOAuth("google")}
                    variant="outline"
                  >
                    <Icons.google className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="me@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="******"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button disabled={loading} className="w-full">
                  Sign Up
                </Button>
                <div className="flex items-center justify-between w-full">
                  <p className="text-muted-foreground text-sm">
                    Already have an account?
                  </p>
                  <Link
                    href="/sign-in"
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "text-xs",
                      })
                    )}
                  >
                    Sign In
                  </Link>
                </div>
              </CardFooter>
              {linkMessage && (
                <p className="text-center text-teal-500 text-sm">
                  A confirmation link has been sent to your email.
                </p>
              )}
            </Card>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
