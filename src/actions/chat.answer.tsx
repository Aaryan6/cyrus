import { CoreMessage, streamText, tool } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { BotMessage } from "@/components/chat/bot-message";
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

type Props = {
  uiStream: ReturnType<typeof createStreamableUI>;
  messages: CoreMessage[];
};

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function Answer({ uiStream, messages }: Props) {
  const user = await currentUser();
  const stream = createStreamableValue();

  uiStream.append(<BotMessage message={stream.value} />);

  let finalInquiry = "";
  await streamText({
    model: google("models/gemini-1.5-flash-latest"),
    system: `You are a helpful friendly assistant. Chat with the user, talk like little witty. Try to be helpful and informative. Check your knowledge base before answering any questions, if you not be able to found in the tool calls, respond, "Sorry, I don't know."`,
    tools: {
      addResource: tool({
        description: `Add a resource to your knowledge base if the information is important or can be used in future. If the user provides any information about him then use this tool without asking for confirmation. and if the information is casually and not important for future then don't add it to the knowledge base.`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
        }),
        execute: async ({ content }) =>
          createResource({ content, userId: user?.id! }),
      }),
      getInformation: tool({
        description: `Check the information from your knowledge base before giving the answer, called this function when user talk about him & ask for information.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) =>
          findRelevantContent({ userQuery: question, userId: user?.id! }),
      }),
      addEventToCalendar: tool({
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
        execute: async ({
          description,
          startTime,
          attendees,
          endTime,
          location,
          summary,
        }) =>
          await addEventToCalendar({
            description,
            startTime,
            attendees,
            endTime,
            location,
            summary,
          }),
      }),
      getEventsFromCalendar: tool({
        description: `Get events from the calendar, if the user wants to know about the events then use this tool. if user is not defining the month and year then use current month ${new Date().getMonth()} and current year is ${new Date().getFullYear()}`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async () => await getEventsFromCalendar(),
      }),
      deleteEventsFromCalendar: tool({
        description: `delete the events from the calendar with user permission, if user is not defining the month and year then use current month ${new Date().getMonth()} and current year is ${new Date().getFullYear()}`,
        parameters: z.object({
          question: z.string().describe("the users question"),
          eventId: z.string().describe("the event id to delete"),
        }),
        execute: async ({ eventId }) =>
          await deleteEventsFromCalendar({ eventId }),
      }),
      updateEventsFromCalendar: tool({
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
        execute: async ({
          eventId,
          attendees,
          description,
          endTime,
          location,
          startTime,
        }) =>
          await updateEventsFromCalendar({
            eventId,
            endTime,
            startTime,
            attendees,
            description,
            location,
          }),
      }),
    },
    messages: messages,
    experimental_toolCallStreaming: true,
  })
    .then(async ({ textStream }) => {
      for await (const textPart of textStream) {
        if (textPart) {
          finalInquiry += textPart;
          stream.update(finalInquiry);
        }
      }
    })
    .finally(() => {
      console.log(finalInquiry);
      stream.done();
    });

  return finalInquiry;
}
