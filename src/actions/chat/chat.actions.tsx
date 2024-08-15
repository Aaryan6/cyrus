"use server";
import { CoreMessage } from "ai";
import {
  createAI,
  createStreamableUI,
  getAIState,
  getMutableAIState,
} from "ai/rsc";
import { Answer } from "@/actions/chat/chat.answer";
import { UserMessage } from "@/components/chat/user-message";
import { BotCard, StaticBotMessage } from "@/components/chat/bot-message";
import { storeChat } from "@/actions/store-chat";
import { nanoid } from "@/lib/utils";
import {
  CalendarCard,
  CalendarEvents,
} from "@/components/chat/ui/calendar-event";

async function submit(input: string, id: string) {
  "use server";

  const aiState = getMutableAIState();
  const uiStream = createStreamableUI();

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
  }

  const processEvents = async () => {
    await Answer({
      aiState,
      uiStream,
    });

    uiStream.done();
  };
  processEvents();

  return {
    id: nanoid(),
    display: uiStream.value,
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
  return aiState.messages
    ?.filter((message) => message.role !== "system")
    .map((message) => {
      const { id, role, content, display } = message;
      switch (role) {
        case "user":
          return {
            id,
            display: <UserMessage message={content as string} />,
          };
        case "assistant":
          if (display) {
            switch (display.name) {
              case "addEventToCalendar":
                return {
                  id,
                  display: (
                    <BotCard>
                      <CalendarCard data={display.props} />
                    </BotCard>
                  ),
                };
              case "getEventsFromCalendar":
                return {
                  id,
                  display: (
                    <BotCard>
                      <CalendarEvents data={display.props.events} />
                    </BotCard>
                  ),
                };
              default:
                return {
                  id,
                  display: <StaticBotMessage message={content as string} />,
                };
            }
          } else {
            return {
              id,
              display: <StaticBotMessage message={content as string} />,
            };
          }
        default:
          return {
            id,
            display: <StaticBotMessage message={"No message!"} />,
          };
      }
    });
};
