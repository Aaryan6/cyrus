import { getUserInfo } from "@/actions/user.server";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

type EventProps = {
  summary?: string;
  location?: string;
  description: string;
  startTime: string;
  endTime?: string;
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
    const user = await getUserInfo();
    if (!user?.provider_token) {
      return { error: "No provider token available" };
    }
    const OAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    OAuth2Client.setCredentials({
      access_token: user.provider_token,
      scope: SCOPES.join(" "),
    });

    // Manually check if token is expired
    const tokenInfo = await OAuth2Client.getTokenInfo(user.provider_token);
    const isTokenExpired = tokenInfo.expiry_date! < Date.now();

    if (isTokenExpired) {
      // Token is expired, we need to re-authenticate
      return { error: "Token expired, please re-authenticate" };
    }

    const calendar = google.calendar({ version: "v3", auth: OAuth2Client });

    const event = await calendar.events.insert({
      requestBody: {
        start: {
          dateTime: new Date(startTime).toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: endTime ? new Date(endTime).toISOString() : null,
          timeZone: "UTC",
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
