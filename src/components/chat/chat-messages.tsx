import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { UIState } from "@/actions/chat/chat.actions";

export interface ChatMessageProps {
  messages: UIState;
}

export function ChatMessage({ messages }: ChatMessageProps) {
  const bottomScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={cn(
        "mb-4 flex-1 flex flex-col gap-4 max-w-4xl mx-auto pt-10 pb-20"
      )}
    >
      {messages.map((message, index: number) => {
        return (
          <div key={message?.id ?? index}>
            <div className="">{message?.display}</div>
          </div>
        );
      })}
      <div ref={bottomScrollRef} className="pb-12" />
    </div>
  );
}
