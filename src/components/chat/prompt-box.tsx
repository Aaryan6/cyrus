import { Forward, Paperclip, Plus, SendIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, nanoid } from "@/lib/utils";
import { PromptOptions } from "./prompt-options";
import { AI } from "@/actions/chat.actions";
import { useActions, useUIState } from "ai/rsc";
import { generateId } from "ai";
import { UserMessage } from "./user-message";

export default function PromptBox({ chatId }: { chatId: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [_, setConversation] = useUIState<typeof AI>();
  const { submit } = useActions();
  const [input, setInput] = useState<string>("");

  const handleSubmit = async () => {
    let msg = input.trim();
    setInput("");
    setConversation((currentConversation) => [
      ...currentConversation,
      {
        id: generateId(),
        role: "user",
        display: <UserMessage message={msg} />,
      },
    ]);
    const message = await submit(msg, chatId);

    setConversation((currentConversation) => [...currentConversation, message]);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, []);
  return (
    <div className="px-10 py-4 absolute bottom-0 inset-x-0 w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative bg-muted rounded-xl">
        <Textarea
          className="w-full resize-none max-h-44 rounded-xl focus:outline-none focus:ring-2 focus:ring-muted dark:focus:ring-muted px-4 bg-transparent focus-visible:ring-offset-0"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            adjustHeight();
          }}
          spellCheck={true}
          onKeyDown={handleKeyDown}
          ref={textareaRef}
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />
        <div className="absolute bottom-0 rounded-lg -left-10 grid gap-1">
          {/* <Link
            href={`/${pathname.split("/")[1]}/${newId}}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "cursor-pointer w-8 h-8"
            )}
          >
            <Plus size={18} />
          </Link> */}
          <PromptOptions />
          <Label
            htmlFor="file"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "cursor-pointer w-8 h-8"
            )}
          >
            <Paperclip size={16} />
          </Label>
        </div>
        <Button
          className="absolute -bottom-2 right-2 px-2 h-8 -translate-y-1/2 bg-foreground hover:text-background hover:bg-foreground/80 text-background focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
          size="sm"
          type="submit"
          variant="ghost"
        >
          <Forward className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
