"use client";
import { Message } from "ai";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { BotIcon } from "lucide-react";
import { MemoizedReactMarkdown } from "../markdown";
import { signIn } from "next-auth/react";
import { DEFAULT_REDIRECT_URL } from "../../../routes";
import { GetUser } from "@/hooks/use-user";
import { Button } from "../ui/button";
import { spinner } from "../spinner";

type BotMessageProps = {
  message: StreamableValue;
};

export const BotMessage: React.FC<BotMessageProps> = ({ message }) => {
  const [data] = useStreamableValue(message);

  if (!data) return;
  return (
    <div
      className={
        "w-fit grid grid-cols-1 gap-2 border-2 font-medium text-sm leading-5 border-[#F0F6FA] text-[#5B8989] bg-[#F0F6FA] py-2.5 px-4 rounded-xl rounded-ss-none whitespace-pre-wrap"
      }
    >
      <MemoizedReactMarkdown
        className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
        components={{
          li: ({ children }) => <li className="list-disc ml-4">{children}</li>,
          h1: ({ children }) => (
            <h1 className="text-xl font-bold">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold">{children}</h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="italic bg-white px-4 rounded-md">
              {children}
            </blockquote>
          ),
        }}
      >
        {data}
      </MemoizedReactMarkdown>
    </div>
  );
};

export const StaticBotMessage = ({ message }: { message: string }) => {
  return (
    <div
      className={
        "w-fit grid grid-cols-1 gap-2 border-2 font-medium text-sm leading-5 border-[#F0F6FA] text-[#5B8989] bg-[#F0F6FA] py-2.5 px-4 rounded-xl rounded-ss-none"
      }
    >
      <MemoizedReactMarkdown
        className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
        components={{
          li: ({ children }) => (
            <li className="list-decimal ml-4">{children}</li>
          ),
          ol: ({ children }) => <ol className="list-disc ">{children}</ol>,
          h1: ({ children }) => (
            <h1 className="text-xl font-bold ">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold ">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold ">{children}</h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="italic bg-white px-4 rounded-md ">
              {children}
            </blockquote>
          ),
          b: ({ children }) => <b className="font-bold">{children}</b>,
          a: ({ children }) => {
            return (
              <a
                className="text-background underline cursor-pointer"
                target="_blank"
              >
                {children}
              </a>
            );
          },
          p: ({ children }) => <p className="my-2">{children}</p>,
        }}
      >
        {message}
      </MemoizedReactMarkdown>
    </div>
  );
};

export const BotCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 relative w-full max-w-[80%]">
      <div className="flex w-full justify-start gap-x-2 max-w-4xl mx-auto h-full">
        <div className="bg-foreground border border-primary w-8 h-8 rounded-full grid place-items-center">
          <BotIcon size={18} className="text-muted" />
        </div>
        {children}
      </div>
    </div>
  );
};

export const TokenErrorMessage = ({ message }: { message: string }) => {
  const user = GetUser();
  const handleLoginWithOAuth = async (provider: "google") => {
    await signIn(provider, {
      callbackUrl: DEFAULT_REDIRECT_URL + user?.username + "/chat",
    });
  };
  return (
    <div
      className={
        "w-fit grid grid-cols-1 gap-2 border-2 font-medium text-sm leading-5 border-[#F0F6FA] text-[#5B8989] bg-[#F0F6FA] py-2.5 px-4 rounded-xl rounded-ss-none whitespace-pre-wrap"
      }
    >
      {message}
      <div className="">
        <Button onClick={() => handleLoginWithOAuth("google")}>Login</Button>
      </div>
    </div>
  );
};

export function SpinnerMessage() {
  return (
    <div className="flex-1 relative w-full max-w-[80%]">
      <div className="flex w-full justify-start gap-x-2 max-w-4xl mx-auto h-full">
        <div className="bg-foreground border border-primary w-8 h-8 rounded-full grid place-items-center">
          <BotIcon size={18} className="text-muted" />
        </div>
        {spinner}
      </div>
    </div>
  );
}
