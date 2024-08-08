"use server";
import { CoreMessage, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { BotMessage, StaticBotMessage } from "@/components/chat/bot-message";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { createResource } from "@/lib/actions/resources";
import { findRelevantContent } from "@/lib/ai/embedding";
import {
  addEventToCalendar,
  deleteEventsFromCalendar,
  getEventsFromCalendar,
  updateEventsFromCalendar,
} from "@/lib/actions/calendar";
import { currentUser } from "@/hooks/use-current-user";
import { nanoid } from "@/lib/utils";
import {
  EventsListProps,
  ShowEvent,
} from "@/components/chat/ui/calendar-event";

type Props = {
  uiStream: ReturnType<typeof createStreamableUI>;
  messages: CoreMessage[];
  history: ReturnType<typeof getMutableAIState>;
};

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function Answer({ uiStream, messages, history }: Props) {
  const user = await currentUser();
  const stream = createStreamableValue();

  uiStream.append(<BotMessage message={stream.value} />);

  const result = await streamUI({
    model: google("models/gemini-1.5-flash-latest"),
    system: `You are a helpful friendly assistant. Chat with the user, talk like little witty. Try to be helpful and informative. Check your knowledge base before answering any questions, if you not be able to found in the tool calls, respond, "Sorry, I don't know."`,
    text: ({ content, done }) => {
      stream.append(content);
      if (done) {
        history.done({
          ...history.get(),
          messages: [
            ...history.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content,
            },
          ],
        });
      }

      return <StaticBotMessage message={content} />;
    },
    tools: {
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
      addEventToCalendar: {
        description: `Add an event to the calendar, if the user provides any information about the event then use this tool with confirmation of user. if user is not defining the month and year then use current month ${new Date().getMonth()} and current year is ${new Date().getFullYear()}`,
        parameters: z.object({
          description: z.string().describe("the description of the event"),
          startTime: z.string().describe("the start time of the event"),
          endTime: z.string().describe("the end time of the event"),
          summary: z.string().optional().describe("the summary of the event"),
          location: z.string().optional().describe("the location of the event"),
          attendees: z
            .array(z.object({ email: z.string() }))
            .optional()
            .describe("the attendees of the event"),
        }),
        generate: async ({
          description,
          startTime,
          attendees,
          endTime,
          location,
          summary,
        }) => {
          const res = await addEventToCalendar({
            description,
            startTime,
            attendees,
            endTime,
            location,
            summary,
          });
          return <div className=""></div>;
        },
      },
      getEventsFromCalendar: {
        description: `Get events from the calendar, if the user wants to know about the events then use this tool. if user is not defining the month and year then use current month ${new Date().getMonth()} and current year is ${new Date().getFullYear()}`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        generate: async () => {
          const { data, error } = await getEventsFromCalendar();
          if (error) {
            return <div className="text-red-500">{error}</div>;
          }
          return <ShowEvent data={data!} />;
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
    },
    messages: messages,
  });

  return result.value;
}
