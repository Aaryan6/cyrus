"use server";
import { CoreMessage } from "ai";
import { createAI, getAIState, getMutableAIState } from "ai/rsc";
import { Answer } from "@/actions/chat/chat.answer";
import { UserMessage } from "@/components/chat/user-message";
import { BotCard, StaticBotMessage } from "@/components/chat/bot-message";
import { storeChat } from "@/actions/store-chat";
import { nanoid } from "@/lib/utils";
import { CreatedEvent, ShowEvent } from "@/components/chat/ui/calendar-event";

async function submit(input: string, id: string) {
  "use server";

  const aiState = getMutableAIState();

  const messages: CoreMessage[] = [
    ...aiState.get().messages,
    { role: "user", content: input },
  ];

  if (input) {
    aiState.update({
      chatId: id ?? aiState.get().chatId,
      messages: [
        ...aiState.get().messages,
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

  const { display, spinner } = await Answer({ messages, aiState });

  return {
    id: nanoid(),
    display,
    spinner,
  };
}

export type AIMessage = CoreMessage & {
  id: string;
  display?: {
    name: string;
    props: Record<string, any>;
  };
};

export type AIState = {
  messages: AIMessage[];
  chatId: string;
  interactions?: string[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
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
    interactions: [],
  } as AIState,
  onGetUIState: async (): Promise<UIState | undefined> => {
    "use server";

    const aiState = getAIState() as Chat;
    if (aiState) {
      const uiState = getUIStateFromAIState(aiState);
      return uiState;
    } else {
      return;
    }
  },
  onSetAIState: async ({ state, done }: { state: AIState; done: boolean }) => {
    "use server";
    console.log({ state });
    if (done) {
      await storeChat({ messages: state.messages, chat_id: state.chatId });
    }
  },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    ?.filter((msg) => msg.role !== "system")
    .map((msg, index) => ({
      id: `${aiState.id}-${index}`,
      display:
        msg.role === "assistant" ? (
          msg.display?.name === "scheduleMeeting" ? (
            <BotCard>
              <CreatedEvent data={msg.display.props} />
            </BotCard>
          ) : msg.display?.name === "getEventsFromCalendar" ? (
            <BotCard>
              <ShowEvent data={msg.display?.props!} />
            </BotCard>
          ) : (
            <StaticBotMessage message={msg.content as string} />
          )
        ) : msg.role === "user" ? (
          <UserMessage message={msg.content as string} />
        ) : null,
    }));
};
