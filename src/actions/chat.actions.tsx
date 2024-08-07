"use server";
import {
  convertToCoreMessages,
  CoreMessage,
  Message,
  streamText,
  tool,
} from "ai";
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
  StreamableValue,
} from "ai/rsc";
import { Answer } from "@/actions/chat.answer";
import { UserMessage } from "@/components/chat/user-message";
import { BotMessage } from "@/components/chat/bot-message";
import { storeChat } from "@/actions/store-chat";
import { revalidatePath } from "next/cache";
import { nanoid } from "@/lib/utils";
import { currentUser } from "@/hooks/use-current-user";

async function submit(input: string, id: string) {
  "use server";

  const history = getMutableAIState();
  const stream = createStreamableValue("");
  const uiStream = createStreamableUI();
  const user = await currentUser();

  const messages: CoreMessage[] = [
    ...history.get().messages,
    { role: "user", content: input },
  ];

  if (input) {
    history.update({
      chatId: id ?? history.get().chatId,
      messages: [
        ...history.get().messages,
        {
          id: nanoid(),
          role: "user",
          content: input,
        },
      ],
    });
    messages.push({
      role: "user",
      content: input,
    });
  }

  const processEvents = async () => {
    const answer = await Answer({ uiStream, messages });

    history.done({
      ...history.get(),
      messages: [
        ...history.get().messages,
        {
          id: nanoid(),
          role: "assistant",
          content: answer,
        },
      ],
    });
    uiStream.done();
  };

  processEvents();
  return {
    id: nanoid(),
    display: uiStream.value,
  };
}

export type AIMessage = {
  role: "function" | "user" | "assistant" | "system" | "tool" | "data";
  content: string;
  id: string;
};

export type AIState = {
  messages: AIMessage[];
  chatId: string;
};

export type UIState = {
  id: string;
  display: React.ReactNode;
  isGenerating?: StreamableValue<boolean>;
  suggestions?: React.ReactNode;
}[];

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  messages: AIMessage[];
}

export const AI = createAI<AIState, UIState>({
  actions: {
    submit,
  },
  initialUIState: [],
  initialAIState: {
    chatId: nanoid(),
    messages: [],
  } as AIState,
  onGetUIState: async () => {
    "use server";

    const aiState = getAIState();
    if (aiState) {
      const uiState = getUIStateFromAIState(aiState);
      return uiState;
    } else {
      return;
    }
  },
  onSetAIState: async ({ state, done }: { state: AIState; done: boolean }) => {
    "use server";
    if (done) {
      await storeChat({ messages: state.messages, chat_id: state.chatId });
    }
  },
});

export const getUIStateFromAIState = (aiState: Readonly<Chat>) => {
  return aiState.messages?.map((message) => {
    const { id, role, content } = message;
    switch (role) {
      case "user":
        return {
          id,
          display: <UserMessage message={content} />,
        };
      case "assistant":
        const answer = createStreamableValue();
        return {
          id,
          display: <BotMessage message={answer.value} />,
        };
      default:
        return {
          id,
          display: <div />,
        };
    }
  });
};
