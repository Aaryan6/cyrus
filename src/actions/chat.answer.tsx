"use server";
import { CoreMessage, generateId } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import {
  BotCard,
  BotMessage,
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
  history: ReturnType<typeof getMutableAIState>;
};

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function Answer({ messages, history }: Props) {
  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const result = await streamUI({
    model: google("models/gemini-1.5-flash-latest"),
    system: `You are a helpful friendly assistant, your name is Jinn. Chat with the user & talk like little witty.
    
    - If the user request to add an event to the calendar then use the tool \`schedule_meeting\` to add the event.
    - If the user request to get the events from the calendar then use the tool \`get_events_from_calendar\` to get the events.
    
    Besides that, you can also chat with users.`,
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = (
          <BotCard>
            <BotMessage message={textStream.value} />
          </BotCard>
        );
      }

      if (done) {
        textStream.done(content);
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
      } else {
        textStream.append(delta);
      }

      return textNode;
    },
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
        generate: async function* ({
          description,
          startTime,
          attendees,
          endTime,
          location,
          summary,
        }) {
          yield <UIStreamingMessage />;
          const { data, error } = await scheduleEventToCalendar({
            description,
            startTime,
            attendees,
            endTime,
            location,
            summary,
          });
          if (error) {
            return <div className="text-red-500">{error}</div>;
          }

          const toolCallId = generateId();

          history.done({
            ...history.get(),
            messages: [
              ...history.get().messages,
              {
                id: generateId(),
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolName: "scheduleMeeting",
                    toolCallId,
                    arg: {
                      description,
                      startTime,
                      attendees,
                      endTime,
                      location,
                      summary,
                    },
                  },
                ],
              },
              {
                id: generateId(),
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "scheduleMeeting",
                    toolCallId,
                    result: data,
                  },
                ],
              },
            ],
          });
          return <CreatedEvent data={data!} />;
        },
      },
      getEventsFromCalendar: {
        description: `Get events from the calendar, if the user wants to know about the events then use this tool. if user is not defining the month and year then use current month ${new Date().getMonth()} and current year is ${new Date().getFullYear()}`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        generate: async function* () {
          yield <UIStreamingMessage />;

          const { data, error } = await getEventsFromCalendar();

          console.log({ data });
          const toolCallId = generateId();

          history.done({
            ...history.get(),
            messages: [
              ...history.get().messages,
              {
                id: generateId(),
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolName: "getEventsFromCalendar",
                    toolCallId,
                    arg: {},
                  },
                ],
              },
              {
                id: generateId(),
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "scheduleMeeting",
                    toolCallId,
                    result: data,
                  },
                ],
              },
            ],
          });
          if (error) {
            return (
              <BotCard>
                <TokenErrorMessage message={error} />
              </BotCard>
            );
          }
          return <ShowEvent data={data!} />;
        },
      },
    },
    messages: messages,
  });

  return result.value;
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
