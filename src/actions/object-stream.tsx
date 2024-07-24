import { CoreMessage, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { BotMessage } from "@/components/chat/bot-message";

type Props = {
  uiStream: ReturnType<typeof createStreamableUI>;
  messages: CoreMessage[];
};

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function StreamResponse({ uiStream, messages }: Props) {
  const stream = createStreamableValue();

  uiStream.append(<BotMessage message={stream.value} />);

  let finalInquiry = "";
  await streamText({
    model: google("models/gemini-1.5-pro-latest"),
    system: `Your are Jinn an AI assistant.`,
    messages,
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
