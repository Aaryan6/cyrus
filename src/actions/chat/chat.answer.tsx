import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
} from "ai/rsc";
import { BotMessage } from "@/components/chat/bot-message";
import { z } from "zod";
import { createResource } from "@/lib/actions/resources";
import { currentUser } from "@/hooks/use-current-user";
import { findRelevantContent } from "@/lib/ai/embedding";

type Props = {
  aiState: ReturnType<typeof getMutableAIState>;
  uiStream: ReturnType<typeof createStreamableUI>;
  spinnerStream: ReturnType<typeof createStreamableUI>;
};

export async function Answer({ aiState, uiStream, spinnerStream }: Props) {
  const user = await currentUser();
  const stream = createStreamableValue();

  uiStream.append(<BotMessage message={stream.value} />);

  let textContent = "";
  await streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a helpful friendly assistant, your name is Jinn. Chat with the user & talk like little witty.
    
    - If the user asks for information, check the knowledge base before giving the answer.
    - If the information is not available in the knowledge base then use the tool \'getInformation\' to find the information.
    - If the user provides any information about him then add it to the knowledge base using the tool \'addResource\'.
    
    Besides that, you can also chat with users.`,
    messages: aiState.get().messages,

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
    },
    maxRetries: 2,
    experimental_toolCallStreaming: true,
    onFinish(event) {
      console.log("onFinish", event);
    },
  })
    .then(async ({ textStream }) => {
      spinnerStream.done(null);
      for await (const delta of textStream) {
        textContent += delta;
        stream.update(textContent);
      }
    })
    .finally(() => {
      stream.done();
    });

  return {
    answer: textContent,
  };
}
