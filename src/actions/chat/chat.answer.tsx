"use server";
import { CoreMessage, generateId, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
  StaticBotMessage,
  TokenErrorMessage,
} from "@/components/chat/bot-message";
import { z } from "zod";
import { createResource } from "@/lib/actions/resources";
import { findRelevantContent } from "@/lib/ai/embedding";
import {
  addEventToCalendar,
  deleteEventsFromCalendar,
  getEventsFromCalendar,
  scheduleEventToCalendar,
  updateEventsFromCalendar,
} from "@/lib/actions/calendar";
import { nanoid } from "@/lib/utils";
import {
  CreatedEvent,
  ShowEvent,
  UIStreamingMessage,
} from "@/components/chat/ui/calendar-event";

type Props = {
  messages: CoreMessage[];
  aiState: ReturnType<typeof getMutableAIState>;
};

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function Answer({ messages, aiState }: Props) {
  const textStream = createStreamableValue("");
  const spinnerStream = createStreamableUI(<SpinnerMessage />);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  const result = await streamText({
    model: openai("models/gemini-1.5-flash-latest"),
    system: `You are a helpful friendly assistant, your name is Jinn. Chat with the user & talk like little witty.
    
    - If the user request to add an event to the calendar then use the tool \`scheduleMeeting\` to add the event.
    - If the user request to get the events from the calendar then use the tool \`getEventsFromCalendar\` to get the events.
    
    Besides that, you can also chat with users.`,
    tools: {
      scheduleMeeting: {
        description: `Use this tool to schedule the meeting on the calendar, ask user for information at least required information. for the date context today date time is ${new Date()}`,
        parameters: z.object({
          description: z.string().describe("the description of the meeting"),
          startTime: z
            .string()
            .describe(
              `the start time of the event in the format of ${new Date().toISOString()}`
            ),
          endTime: z
            .string()
            .describe(
              `the start time of the event in the format of ${new Date().toISOString()}`
            ),
          summary: z.string().describe("the title of the meeting"),
          location: z
            .string()
            .optional()
            .describe("the location of the meeting"),
          attendees: z
            .array(z.object({ email: z.string() }))
            .optional()
            .describe("the attendees of the event"),
        }),
      },
      getEventsFromCalendar: {
        description: `Get events from the calendar, if the user wants to know about the events then use this tool. if user is not defining the month and year then use current month ${new Date().getMonth()} and current year is ${new Date().getFullYear()}`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
      },
    },
    messages,
  });

  let textContent = "";
  spinnerStream.done(null);

  for await (const delta of result.fullStream) {
    const { type } = delta;

    if (type === "text-delta") {
      const { textDelta } = delta;

      textContent += textDelta;
      messageStream.update(
        <BotCard>
          <StaticBotMessage message={textContent} />
        </BotCard>
      );

      aiState.update({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: nanoid(),
            role: "assistant",
            content: textContent,
          },
        ],
      });
    } else if (type === "tool-call") {
      const { toolName, args } = delta;

      if (toolName === "getEventsFromCalendar") {
        const { data } = await getEventsFromCalendar();

        uiStream.update(
          <BotCard>
            <ShowEvent data={data!} />
          </BotCard>
        );

        aiState.done({
          ...aiState.get(),
          interactions: [],
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content: "Here are the your events:",
              display: {
                name: "getEventsFromCalendar",
                props: {
                  events: data,
                },
              },
            },
          ],
        });
      } else if (toolName === "scheduleMeeting") {
        const {
          description,
          endTime,
          startTime,
          summary,
          attendees,
          location,
        } = args;

        console.log({
          description,
          endTime,
          startTime,
          summary,
          attendees,
          location,
        });
        const { data } = await scheduleEventToCalendar({
          endTime,
          startTime,
          summary,
          description,
          location,
          attendees,
        });
        console.log({ data });
        uiStream.update(
          <BotCard>
            <CreatedEvent data={data!} />
          </BotCard>
        );

        aiState.done({
          ...aiState.get(),
          interactions: [],
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content: "Here is the new added event for you.",
              display: {
                name: "scheduleMeeting",
                props: {
                  startTime,
                  endTime,
                  summary,
                  description,
                  location,
                },
              },
            },
          ],
        });
      }
    }
  }
  uiStream.done();
  textStream.done();
  messageStream.done();

  return {
    spinner: spinnerStream.value,
    display: messageStream.value,
  };
}

// TODO: tools to add
/**
       addEventToCalendar: {
        description: `Use this tool to add an event or reminder on the calendar, ask user for information at least required information. for the date context today date time is ${new Date()}`,
        parameters: z.object({
          description: z.string().describe("the description of the event"),
          startTime: z
            .string()
            .describe(
              `the start time of the event in the format of ${new Date().toISOString()}`
            ),
          endTime: z
            .string()
            .describe(
              `the start time of the event in the format of ${new Date().toISOString()}`
            ),
          summary: z.string().describe("the title of the event"),
          location: z.string().optional().describe("the location of the event"),
        }),
        generate: async function* ({
          description,
          startTime,
          endTime,
          location,
          summary,
        }) {
          yield <UIStreamingMessage />;
          const { data, error } = await addEventToCalendar({
            description,
            startTime,
            endTime,
            location,
            summary,
          });
          console.log(data);
          if (error) {
            return <div className="text-red-500">{error}</div>;
          }
          return <CreatedEvent data={data!} />;
        },
      },

        updateEventsFromCalendar: {
        description: `update the events from the calendar with user permission, if user is not defining the month and year then use current month ${new Date().getMonth()} and current year is ${new Date().getFullYear()}`,
        parameters: z.object({
          question: z.string().describe("the users question"),
          eventId: z.string().describe("the event id to delete"),
          startTime: z
            .string()
            .optional()
            .describe("the start time of the event"),
          endTime: z.string().optional().describe("the end time of the event"),
          description: z
            .string()
            .optional()
            .describe("the description of the event"),
          location: z.string().optional().describe("the location of the event"),
          attendees: z
            .array(z.object({ email: z.string() }))
            .optional()
            .describe("the attendees of the event"),
        }),
        generate: async ({
          eventId,
          attendees,
          description,
          endTime,
          location,
          startTime,
        }) => {
          const res = await updateEventsFromCalendar({
            eventId,
            endTime,
            startTime,
            attendees,
            description,
            location,
          });
          return <div className=""></div>;
        },
      },

      deleteEventsFromCalendar: {
        description: `delete the events from the calendar with user permission, if user is not defining the month and year then use current month ${new Date().getMonth()} and current year is ${new Date().getFullYear()}`,
        parameters: z.object({
          question: z.string().describe("the users question"),
          eventId: z.string().describe("the event id to delete"),
        }),
        generate: async ({ eventId }) => {
          const res = await deleteEventsFromCalendar({ eventId });
          return <div className=""></div>;
        },
      },

            addResource: {
        description: `Add a resource to your knowledge base if the information is important or can be used in future. If the user provides any information about him then use this tool without asking for confirmation. and if the information is casually and not important for future then don't add it to the knowledge base.`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
        }),
        generate: async ({ content }) => {
          const res = createResource({ content, userId: user?.id! });
          return <div className=""></div>;
        },
      },
      getInformation: {
        description: `Check the information from your knowledge base before giving the answer, called this function when user talk about him & ask for information.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        generate: async ({ question }) => {
          const res = findRelevantContent({
            userQuery: question,
            userId: user?.id!,
          });
          return <div className=""></div>;
        },
      },
 */
