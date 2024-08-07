"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { generateId, Message } from "ai";
import { ChatMessage } from "./chat-messages";
import PromptBox from "./prompt-box";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { useActions, useAIState, useUIState } from "ai/rsc";
import { AI, AIMessage, AIState } from "@/actions/chat.actions";
import { UserMessage } from "./user-message";
import { StaticBotMessage } from "./bot-message";

type ChatProps = {
  chatId: string;
  initialMessages: Message[];
};

export const getUIStateFromAIState = (aiState: AIState) => {
  return aiState.messages
    ?.filter((message) => message.role.toLowerCase() !== "system")
    ?.map((message) => ({
      id: message.id,
      display:
        message.role.toLowerCase() === "user" ? (
          <UserMessage message={message.content} />
        ) : (
          <StaticBotMessage message={message.content} />
        ),
    }));
};

export function Chat({ chatId, initialMessages }: ChatProps) {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState<typeof AI>();
  const [aiState, setAIState] = useAIState<typeof AI>();
  const { submit } = useActions();
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const { messages, input, handleInputChange, handleSubmit } = useChat({
  //   maxToolRoundtrips: 2,
  //   initialMessages: initialMessages ?? [],
  //   body: {
  //     chatId: chatId,
  //   },
  // });

  const handleSubmit = async () => {
    setConversation((currentConversation) => [
      ...currentConversation,
      {
        id: generateId(),
        role: "user",
        display: <UserMessage message={input} />,
      },
    ]);
    const message = await submit(input, chatId);
    setInput("");

    setConversation((currentConversation) => [...currentConversation, message]);
  };

  useEffect(() => {
    if (chatId && aiState.messages.length === 0) {
      setAIState({
        chatId,
        messages: initialMessages || [],
      });
      setConversation(
        getUIStateFromAIState({ chatId, messages: initialMessages || [] })
      );
    }
  }, [chatId]);

  return (
    <ScrollArea className="h-full w-full flex flex-col">
      <ChatMessage messages={conversation} />
      <PromptBox
        input={input}
        handleInputChange={(e) => setInput(e.target.value)}
        handleSubmit={handleSubmit}
        files={files}
        setFiles={setFiles}
        fileInputRef={fileInputRef}
      />
    </ScrollArea>
  );
}
