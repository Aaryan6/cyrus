"use client";
import { Message } from "ai";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { BotIcon } from "lucide-react";

type BotMessageProps = {
  message: StreamableValue;
};

export const BotMessage: React.FC<BotMessageProps> = ({ message }) => {
  const [data] = useStreamableValue(message);

  if (!data) return;
  return (
    <div className="flex-1 relative w-full">
      <div className="flex w-full justify-start gap-x-2 max-w-4xl mx-auto h-full">
        <div className="bg-foreground border border-primary w-10 h-10 rounded-full grid place-items-center">
          <BotIcon className="text-muted" />
        </div>
        <div
          className={
            "w-fit grid grid-cols-1 gap-2 border-2 font-medium text-sm leading-5 border-[#F0F6FA] text-[#5B8989] bg-[#F0F6FA] p-4 rounded-lg rounded-ss-none whitespace-pre-wrap"
          }
        >
          {data}
        </div>
      </div>
    </div>
  );
};

export const StaticBotMessage = ({ message }: { message: Message }) => {
  return (
    <div className="flex-1 relative w-full max-w-[80%]">
      <div className="flex w-full justify-start gap-x-2 max-w-4xl mx-auto h-full">
        <div className="bg-foreground border border-primary w-10 h-10 rounded-full grid place-items-center">
          <BotIcon className="text-muted" />
        </div>
        <div
          className={
            "w-fit grid grid-cols-1 gap-2 border-2 font-medium text-sm leading-5 border-[#F0F6FA] text-[#5B8989] bg-[#F0F6FA] p-4 rounded-lg rounded-ss-none whitespace-pre-wrap"
          }
        >
          {message.content.length > 0 ? (
            message.content
          ) : (
            <span className="italic font-light">
              {"calling tool: " + message?.toolInvocations?.[0].toolName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
