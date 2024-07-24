import { cn } from "@/lib/utils";
import { UIState } from "@/actions/chat.actions";
import { useEffect, useRef } from "react";

export interface ChatMessageProps {
  messages: UIState;
  aiState: any;
  initialMessages: any[];
}

export function ChatMessage({
  messages,
  aiState,
  initialMessages,
}: ChatMessageProps) {
  const bottomScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiState?.messages, initialMessages]);

  return (
    <div
      className={cn(
        "mb-4 flex-1 h-[calc(100vh-10rem)] flex flex-col gap-4 max-w-4xl mx-auto pt-10 overflow-y-auto"
      )}
    >
      {messages.map((message, index: number) => {
        return (
          <div key={message.id ?? index}>
            <div className="">{message.display}</div>
          </div>
        );
      })}
      <div ref={bottomScrollRef} className="pb-12" />
    </div>
  );
}
