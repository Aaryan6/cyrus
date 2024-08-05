import { createResource } from "@/lib/actions/resources";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "@/lib/ai/embedding";
import { nanoid } from "@/lib/utils";
import { db } from "@/lib/db";
import {
  addEventToCalendar,
  getEventsFromCalendar,
} from "@/lib/actions/calendar";
import { currentUser } from "@/hooks/use-current-user";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();
  const user = await currentUser();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
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
        execute: async ({ question }) =>
          await getEventsFromCalendar({
            question,
          }),
      }),
    },
    messages: convertToCoreMessages(messages),
    experimental_toolCallStreaming: true,
    async onFinish(event) {
      const title = messages[0].content.substring(0, 100);
      const id = chatId ?? nanoid();
      const createdAt = Date.now();
      const stringDate = new Date(createdAt);
      const path = `/${user?.username}/${id}`;
      const payload = {
        id,
        title,
        user_id: user?.id,
        createdAt,
        path,
        messages: [...messages, { role: "assistant", content: event.text }],
      };

      await db.chats.upsert({
        where: {
          id,
        },
        update: {
          payload: payload,
          updatedAt: stringDate,
        },
        create: {
          id,
          payload,
          userId: user?.id!,
          createdAt: stringDate,
          updatedAt: stringDate,
        },
      });
    },
  });

  return result.toAIStreamResponse();
}
