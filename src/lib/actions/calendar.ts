"use server";
import { currentUser } from "@/hooks/use-current-user";
import { google } from "googleapis";
import { formatForGoogleCalendar } from "../utils";
import { nanoid } from "nanoid";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

type EventProps = {
  summary?: string;
  location?: string;
  description: string;
  startTime: string;
  endTime: string;
  attendees?: { email: string }[];
};
export async function addEventToCalendar({
  description,
  startTime,
  attendees,
  endTime,
  location,
  summary,
}: EventProps) {
  const id = nanoid();
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Session is not available" };
    }
    const OAuth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET
    );

    OAuth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    });

    const calendar = google.calendar({ version: "v3", auth: OAuth2Client });

    console.log(startTime, endTime);

    const event = await calendar.events.insert({
      requestBody: {
        start: {
          dateTime: formatForGoogleCalendar(startTime),
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: endTime ? formatForGoogleCalendar(endTime) : null,
          timeZone: "Asia/Kolkata",
        },
        description: description,
        eventType: "default",
        summary: summary,
        location: location,
        attendees: attendees,
        conferenceData: {
          createRequest: {
            requestId: id,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
      calendarId: "primary",
      conferenceDataVersion: 1,
    });

    return { data: event };
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while adding the event to the calendar",
    };
  }
}

export async function getEventsFromCalendar() {
  try {
    const user = await currentUser();
    if (!user?.access_token) {
      return { error: "No provider token available" };
    }
    const OAuth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET
    );

    OAuth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    });

    const calendar = google.calendar({ version: "v3", auth: OAuth2Client });

    const event = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return { data: event.data };
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while adding the event to the calendar",
    };
  }
}

export async function deleteEventsFromCalendar({
  eventId,
}: {
  eventId: string;
}) {
  try {
    const user = await currentUser();
    if (!user?.access_token) {
      return { error: "No provider token available" };
    }
    const OAuth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET
    );

    OAuth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    });

    const calendar = google.calendar({ version: "v3", auth: OAuth2Client });

    const event = await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    return { data: event };
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while adding the event to the calendar",
    };
  }
}

export async function updateEventsFromCalendar({
  eventId,
  startTime,
  endTime,
  description,
  attendees,
  location,
}: {
  eventId: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
  attendees?: { email: string }[];
}) {
  const id = nanoid();
  try {
    const user = await currentUser();
    if (!user?.access_token) {
      return { error: "No provider token available" };
    }
    const OAuth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET
    );

    OAuth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    });

    const calendar = google.calendar({ version: "v3", auth: OAuth2Client });

    const currentEvent = await calendar.events.get({
      calendarId: "primary",
      eventId,
    });

    if (!currentEvent) {
      return { error: "No event found with the given id" };
    }

    const event = await calendar.events.update({
      calendarId: "primary",
      eventId,
      requestBody: {
        start: {
          dateTime: startTime
            ? formatForGoogleCalendar(startTime)
            : currentEvent.data.start!.dateTime,
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: endTime
            ? formatForGoogleCalendar(endTime)
            : currentEvent.data.end!.dateTime,
          timeZone: "Asia/Kolkata",
        },
        description: description || currentEvent.data.description,
        location: location || currentEvent.data.location,
        attendees: attendees || currentEvent.data.attendees,
      },
    });

    return { data: event };
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while adding the event to the calendar",
    };
  }
}
