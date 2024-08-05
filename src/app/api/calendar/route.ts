import { currentUser } from "@/hooks/use-current-user";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user?.access_token) {
      return NextResponse.json(
        { error: "No provider token available" },
        { status: 401 }
      );
    }

    const OAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    OAuth2Client.setCredentials({
      access_token: user.access_token,
      scope: SCOPES.join(" "),
    });

    // Manually check if token is expired
    const tokenInfo = await OAuth2Client.getTokenInfo(user.access_token);
    const isTokenExpired = tokenInfo.expiry_date! < Date.now();

    if (isTokenExpired) {
      // Token is expired, we need to re-authenticate
      return NextResponse.json(
        { error: "Token expired, please re-authenticate" },
        { status: 401 }
      );
    }

    const calendar = google.calendar({ version: "v3", auth: OAuth2Client });

    const calendars = await calendar.calendarList.list();

    return NextResponse.json({ data: calendars.data });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    // if (!session?.provider_token) {
    //   return NextResponse.json(
    //     { error: "No provider token available" },
    //     { status: 401 }
    //   );
    // }

    const OAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    OAuth2Client.setCredentials({
      access_token: "",
      scope: SCOPES.join(" "),
    });

    // Manually check if token is expired
    const tokenInfo = await OAuth2Client.getTokenInfo("");
    const isTokenExpired = tokenInfo.expiry_date! < Date.now();

    if (isTokenExpired) {
      // Token is expired, we need to re-authenticate
      return NextResponse.json(
        { error: "Token expired, please re-authenticate" },
        { status: 401 }
      );
    }

    const calendar = google.calendar({ version: "v3", auth: OAuth2Client });

    const currentDate = new Date();
    const startDateTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      18,
      0,
      0
    );
    const endDateTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      20,
      0,
      0
    );

    const event = await calendar.events.insert({
      requestBody: {
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "UTC",
        },
        description: "This is a test event",
        eventType: "default",
      },
      calendarId: "primary",
    });

    return NextResponse.json({ data: event });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
