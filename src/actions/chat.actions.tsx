"use server";
import { CoreMessage } from "ai";
import { createAI, getAIState, getMutableAIState } from "ai/rsc";
import { Answer } from "@/actions/chat.answer";
import { UserMessage } from "@/components/chat/user-message";
import { BotCard, StaticBotMessage } from "@/components/chat/bot-message";
import { storeChat } from "@/actions/store-chat";
import { nanoid } from "@/lib/utils";
import { CreatedEvent, ShowEvent } from "@/components/chat/ui/calendar-event";

async function submit(input: string, id: string) {
  "use server";

  const history = getMutableAIState();

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

  const result = await Answer({ messages, history });

  return {
    id: nanoid(),
    display: result,
  };
}

export type AIMessage = CoreMessage & {
  id: string;
};

export type AIState = {
  messages: AIMessage[];
  chatId: string;
};

export type UIState = {
  id: string;
  display: React.ReactNode;
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
    if (done) {
      await storeChat({ messages: state.messages, chat_id: state.chatId });
    }
  },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState?.messages?.map((message) => {
    const { id, role, content } = message;
    switch (role) {
      case "user":
        return {
          id,
          display: <UserMessage message={content as string} />,
        };
      case "assistant":
        if (typeof content === "string") {
          return {
            id,
            display: (
              <BotCard>
                <StaticBotMessage message={content} />
              </BotCard>
            ),
          };
        } else {
          return null;
        }
      case "tool":
        return {
          id,
          display: content.map((tool) => {
            return tool.toolName === "scheduleMeeting" ? (
              <BotCard>
                <CreatedEvent data={tool.result!} />
              </BotCard>
            ) : tool.toolName === "getEventsFromCalendar" ? (
              <BotCard>
                <ShowEvent data={tool.result!} />
              </BotCard>
            ) : null;
          }),
        };
      default:
        return null;
    }
  }) as UIState;
};
