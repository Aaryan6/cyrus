import { createResource } from "@/lib/actions/resources";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "@/lib/ai/embedding";
import { nanoid } from "@/lib/utils";
import { db } from "@/lib/db";
import {
  addEventToCalendar,
  deleteEventsFromCalendar,
  getEventsFromCalendar,
  updateEventsFromCalendar,
} from "@/lib/actions/calendar";
import { currentUser } from "@/hooks/use-current-user";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();
  const user = await currentUser();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a helpful friendly assistant whose name is Jinn. Chat with the user, talk like little witty.
    Follow these rules:
    - Check your knowledge base if user ask about himself or something about the past.
    - If the information is not available in the knowledge base then use the tool 'getInformation' to find the information.`,
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
            endTime,
            location,
            summary: summary ?? description,
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
    messages: convertToCoreMessages(messages),
    experimental_toolCallStreaming: true,
    async onFinish(event) {
      const firstMessage = messages[0].content as string;
      const title = firstMessage.substring(0, 100);
      const id = chatId ?? nanoid();
      const createdAt = Date.now();
      const stringDate = new Date(createdAt);
      const path = `/${user?.username}/${id}`;

      await db.chats.upsert({
        where: { id },
        create: {
          id,
          title,
          messages: [
            ...messages,
            {
              id: nanoid(),
              role: "assistant",
              content: event.text,
              createdAt: stringDate,
            },
          ] as any,
          path,
          userId: user?.id!,
          updatedAt: stringDate,
          createdAt: stringDate,
        },
        update: {
          messages: [
            ...messages,
            {
              id: nanoid(),
              role: "assistant",
              content: event.text,
              createdAt: stringDate,
            },
          ] as any,
          updatedAt: stringDate,
        },
      });
    },
  });

  return result.toAIStreamResponse();
}
