import { currentUser } from "@/hooks/use-current-user";
import { google } from "googleapis";
import { formatForGoogleCalendar } from "../utils";

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
      },
      calendarId: "primary",
    });

    return { data: event };
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while adding the event to the calendar",
    };
  }
}

export async function getEventsFromCalendar({
  question,
}: {
  question: string;
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

    const event = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return { data: event };
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while adding the event to the calendar",
    };
  }
}
