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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, getURL } from "@/lib/utils";

import { Icons } from "@/components/icons";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import BG from "@/public/jinn.jpeg";
import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { register } from "@/actions/auth.actions";
import { signIn } from "next-auth/react";
import { DEFAULT_REDIRECT_URL } from "../../../../routes";

export default function SignInPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [linkMessage, setLinkMessage] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleLoginWithOAuth = async (provider: "google") => {
    await signIn(provider, {
      callbackUrl: DEFAULT_REDIRECT_URL,
    });
  };

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    console.log(values);
    const res = await register(values);
    console.log(res);
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
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
                    Create a new account
                  </CardTitle>
                  <CardDescription>
                    Enter your email and Password below to proceed
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-1 gap-6">
                    <Button
                      onClick={async () => await handleLoginWithOAuth("google")}
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
