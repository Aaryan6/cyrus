import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useActions, useUIState } from "ai/rsc";
import { AI } from "@/actions/chat.actions";
import { FormEvent, useState } from "react";
import { nanoid } from "@/lib/utils";
import { UserMessage } from "./user-message";
import { useParams } from "next/navigation";
import { toast } from "sonner";

type Props = {};

export default function PromptBox({}: Props) {
  const { submit } = useActions();
  const [_, setMessages] = useUIState<typeof AI>();
  const [inputValue, setInputValue] = useState("");
  const params = useParams();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("value", inputValue);
    if (!inputValue) {
      toast.error("Please enter a message");
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage message={inputValue} />,
      },
    ]);

    const res = await submit(inputValue, params.id);

    setMessages((currentMessages) => [...currentMessages, res as any]);

    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <div className="px-10 py-4 absolute bottom-0 left-0 w-full">
      <form
        onSubmit={onSubmit}
        className="relative bg-muted rounded-md overflow-hidden h-20"
      >
        <Textarea
          className="w-full resize-none rounded-md h-full focus:outline-none focus:ring-2 focus:ring-muted dark:focus:ring-muted px-4 bg-transparent"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          spellCheck={true}
          onKeyDown={handleKeyDown}
        />
        <Button
          className="absolute top-1/2 right-3 -translate-y-1/2 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
          size="icon"
          type="submit"
          variant="ghost"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
