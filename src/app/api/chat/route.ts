import { createResource } from "@/lib/actions/resources";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "@/lib/ai/embedding";
import { nanoid } from "@/lib/utils";
import { getUserInfo } from "@/actions/user.server";
import db from "@/lib/supabase/db";
import { chats } from "@/lib/supabase/schema";
import { sql } from "drizzle-orm";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();
  const user = await getUserInfo();

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
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `Check the information from your knowledge base before giving the answer, called this function when user talk about him & ask for information.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
    messages: convertToCoreMessages(messages),
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

      await db
        .insert(chats)
        .values({
          id,
          payload: sql`${payload}::jsonb`,
          userId: user?.id,
          updatedAt: stringDate,
          createdAt: stringDate,
        })
        .onConflictDoUpdate({
          target: chats.id,
          set: {
            payload: sql`${payload}::jsonb`,
            updatedAt: stringDate,
          },
        });
    },
  });

  return result.toAIStreamResponse();
}
