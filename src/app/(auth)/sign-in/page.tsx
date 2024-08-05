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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import Image from "next/image";
import { useState, useTransition } from "react";

import BG from "@/public/jinn.jpeg";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { login } from "@/actions/auth.actions";
import { signIn } from "next-auth/react";
import { DEFAULT_REDIRECT_URL } from "../../../../routes";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const providerError = searchParams.get("error") === "OAuthAccountNotLinked";
  const [error, setError] = useState<string | undefined>(
    providerError ? "Email already in use with different provider!" : ""
  );

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginWithOAuth = async (provider: "google") => {
    await signIn(provider, {
      callbackUrl: DEFAULT_REDIRECT_URL,
    });
  };

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError("");
    startTransition(async () => {
      login(values).then((data) => {
        if (data) {
          setError(data.error);
        }
      });
    });
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">
                    Sign in to your existing account
                  </CardTitle>
                  <CardDescription>
                    Enter your email and Password below to proceed
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-1 gap-6">
                    <Button
                      onClick={() => handleLoginWithOAuth("google")}
                      variant="outline"
                      type="button"
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
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="me@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                {error && (
                  <CardFooter className="flex items-center justify-between">
                    <p className="text-red-500">{error}</p>
                  </CardFooter>
                )}
                <CardFooter className="flex flex-col space-y-4">
                  <Button disabled={isPending} type="submit" className="w-full">
                    Sign In
                  </Button>
                  <div className="flex items-center justify-between w-full">
                    <p className="text-muted-foreground text-sm">
                      Don&apos;t have an account?
                    </p>
                    <Link
                      href="/sign-up"
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "text-xs",
                        })
                      )}
                    >
                      Sign Up
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </Form>
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
