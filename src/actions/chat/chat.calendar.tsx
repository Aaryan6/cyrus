import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
} from "ai/rsc";
import {
  BotCard,
  BotMessage,
  StaticBotMessage,
} from "@/components/chat/bot-message";
import {
  CalendarCard,
  CalendarDeletedCard,
  CalendarEvents,
} from "@/components/calendar/ui/calendar-event";
import {
  deleteEventsFromCalendar,
  getEventsFromCalendar,
  scheduleEventToCalendar,
  updateEventsFromCalendar,
} from "@/lib/actions/calendar";
import { nanoid } from "@/lib/utils";
import { z } from "zod";

type Props = {
  aiState: ReturnType<typeof getMutableAIState>;
  uiStream: ReturnType<typeof createStreamableUI>;
  spinnerStream: ReturnType<typeof createStreamableUI>;
};

export async function Calendar({ aiState, uiStream, spinnerStream }: Props) {
  const stream = createStreamableValue();

  uiStream.append(<BotMessage message={stream.value} />);

  let textContent = "";
  await streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a helpful friendly assistant, your name is Jinn. Chat with the user & talk like little witty.
    
    - If the user request to add an event to the calendar then use the tool \`scheduleMeeting\` to add the event.
    - If the user request to get the events from the calendar then use the tool \`getEventsFromCalendar\` to get the events.
    - If the user request to update the event from the calendar then use the tool \`updateEventFromCalendar\` to update the event.
    - If the user request to delete the event from the calendar then use the tool \`deleteEventFromCalendar\` to delete the event.
    
    Besides that, you can also chat with users.`,
    messages: aiState.get().messages,
    tools: {
      addEventToCalendar: {
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
        description: `Get events from the calendar, if the user wants to know about the events then use this tool. for the date context today date time is ${new Date()}`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
      },
      updateEventFromCalendar: {
        description: `update the event from the calendar with user permission, for the date context today date time is ${new Date()}`,
        parameters: z.object({
          question: z.string().describe("the users question"),
          eventId: z.string().describe("the event id to delete"),
          summary: z.string().optional().describe("the title of the event"),
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
      },
      deleteEventsFromCalendar: {
        description: `delete the events from the calendar with user permission, for the date context today date time is ${new Date()}`,
        parameters: z.object({
          question: z.string().describe("the users question"),
          eventId: z.string().describe("the event id to delete"),
        }),
      },
    },
  })
    .then(async ({ fullStream }) => {
      spinnerStream.done(null);
      for await (const delta of fullStream) {
        const { type } = delta;

        if (textContent.length > 0) {
          if (type === "finish") {
            aiState.done({
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
          }
        }

        if (type === "text-delta") {
          const { textDelta } = delta;
          textContent += textDelta;
          stream.update(textContent);
        } else if (type === "tool-call") {
          const { toolName, args } = delta;

          if (toolName === "addEventToCalendar") {
            const {
              description,
              endTime,
              startTime,
              summary,
              attendees,
              location,
            } = args;

            const { data } = await scheduleEventToCalendar({
              endTime,
              startTime,
              summary,
              description,
              location,
              attendees,
            });

            uiStream.update(
              <BotCard>
                <CalendarCard data={data!} />
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
                    name: "addEventToCalendar",
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
          } else if (toolName === "getEventsFromCalendar") {
            const { data } = await getEventsFromCalendar();

            if (data?.items?.length === 0) {
              uiStream.update(
                <StaticBotMessage message="No events found on the calendar." />
              );
              aiState.done({
                ...aiState.get(),
                interactions: [],
                messages: [
                  ...aiState.get().messages,
                  {
                    id: nanoid(),
                    role: "assistant",
                    content: "No events found on the calendar.",
                    display: {
                      name: "getEventsFromCalendar",
                      props: {
                        events: data,
                      },
                    },
                  },
                ],
              });
              return;
            } else {
              uiStream.update(
                <BotCard>
                  <CalendarEvents data={data!} />
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
            }
          } else if (toolName === "updateEventFromCalendar") {
            const {
              eventId,
              attendees,
              description,
              endTime,
              location,
              startTime,
              summary,
            } = args;
            const { data } = await updateEventsFromCalendar({
              eventId,
              endTime,
              startTime,
              attendees,
              description,
              location,
              summary,
            });

            uiStream.update(
              <BotCard>
                <CalendarCard data={data!} />
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
                  content: "Here is the updated event.",
                  display: {
                    name: "updateEventFromCalendar",
                    props: {
                      startTime,
                      endTime,
                      summary,
                      description,
                      location,
                      attendees,
                      eventId,
                    },
                  },
                },
              ],
            });
          } else if (toolName === "deleteEventsFromCalendar") {
            const { eventId } = args;
            const { data } = await deleteEventsFromCalendar({ eventId });
            uiStream.update(
              <BotCard>
                <CalendarDeletedCard data={data!} />
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
                  content: "Here is the deleted event.",
                  display: {
                    name: "deleteEventsFromCalendar",
                    props: {
                      eventId,
                    },
                  },
                },
              ],
            });
          }
        }
      }
    })
    .finally(() => {
      stream.done();
    });

  return {
    answer: textContent,
  };
}
